import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface FetchOptions<TData, TVariables, TError> {
  method?: HttpMethod
  config?: AxiosRequestConfig
  //! опции react-query для GET: staleTime, gcTime, enabled и т.д. переопределяют дефолты из QueryClient
  queryOptions?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
  mutationOptions?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
}

interface QueryResult<TData, TError> {
  data: TData | undefined
  isLoading: boolean
  error: TError | null
  refetch: () => Promise<unknown>
}

interface MutationResult<TData, TVariables, TError> {
  mutate: (variables: TVariables) => void
  isLoading: boolean
  error: TError | null
  data: TData | undefined
}

async function tryRefreshToken(apiUrl: string): Promise<boolean> {
  const res = await fetch(`${apiUrl}/login/refresh/`, {
    method: 'POST',
    credentials: 'include',
  })
  return res.ok
}

export function useClientFetch<TData = unknown, TVariables = undefined, TError = AxiosError>(
  url: string,
  options: FetchOptions<TData, TVariables, TError> = {}
): TVariables extends undefined
  ? QueryResult<TData, TError>
  : MutationResult<TData, TVariables, TError> {
  const { method = 'GET', config = {}, queryOptions = {}, mutationOptions = {} } = options

  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`

  // авторизация через JWT в httpOnly cookie (withCredentials: true)
  const axiosConfig = { ...config, headers: config.headers, withCredentials: true }

  //! GET-запросы кэшируются (staleTime/gcTime в QueryClient). при повторном заходе данные показываются из кэша сразу
  const query = useQuery<TData, TError>({
    queryKey: [url, config.params],
    queryFn: async () => {
      const run = () => axios.get(fullUrl, axiosConfig)
      const res = await run().catch(async (err: AxiosError) => {
        if (err.response?.status === 401 && (await tryRefreshToken(API_URL!))) return run()
        throw err
      })
      return res.data
    },
    ...queryOptions,
    // отключаем автоматическое выполнение для мутаций
    enabled: method === 'GET' && queryOptions.enabled !== false,
  })

  const mutation = useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const doRequest = () =>
        axios({
          method: method.toLowerCase(),
          url: fullUrl,
          data: variables,
          ...axiosConfig,
        })
      const res = await doRequest().catch(async (err: AxiosError) => {
        if (err.response?.status === 401 && (await tryRefreshToken(API_URL!))) return doRequest()
        throw err
      })
      return res.data
    },
    ...mutationOptions,
  })

  // возвращаем соответствующий результат в зависимости от метода
  if (method === 'GET') {
    return {
      data: query.data,
      isLoading: query.isLoading,
      error: query.error,
      refetch: query.refetch,
    } as TVariables extends undefined ? QueryResult<TData, TError> : never
  }

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  } as TVariables extends undefined ? never : MutationResult<TData, TVariables, TError>
}

// примеры использования:

/*
// GET запрос
interface UserData {
  id: number
  name: string
  email: string
}

const { data, isLoading, error } = useClientFetch<UserData>('/users/me')

// POST запрос с типизированным payload
interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: UserData
}

const { mutate, isLoading } = useClientFetch<LoginResponse, LoginPayload>('/auth/login', {
  method: 'POST',
  mutationOptions: {
    onSuccess: (data) => {
      // data типизирован как LoginResponse
    },
    onError: (error) => {
      // error типизирован как AxiosError
    }
  }
})

// использование:
mutate({ email: 'user@example.com', password: '123456' })

// PATCH запрос
interface UpdateUserPayload {
  name?: string
  email?: string
}

const { mutate } = useClientFetch<UserData, UpdateUserPayload>('/users/me', {
  method: 'PATCH'
})

// использование:
mutate({ name: 'New Name' })
*/
