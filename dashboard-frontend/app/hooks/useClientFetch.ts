import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { useSession } from 'next-auth/react'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface FetchOptions<TData, TVariables, TError> {
  method?: HttpMethod
  config?: AxiosRequestConfig
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

// флаг для отслеживания первой 401 ошибки
let hasRefreshed = false

export function useClientFetch<TData = unknown, TVariables = undefined, TError = AxiosError>(
  url: string,
  options: FetchOptions<TData, TVariables, TError> = {}
): TVariables extends undefined
  ? QueryResult<TData, TError>
  : MutationResult<TData, TVariables, TError> {
  const { method = 'GET', config = {}, queryOptions = {}, mutationOptions = {} } = options
  const { data: session } = useSession()

  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`

  // обработчик 401 ошибки
  const handle401Error = (error: AxiosError) => {
    if (error.response?.status === 401 && !hasRefreshed) {
      hasRefreshed = true
      window.location.reload()
      return
    }
    throw error
  }

  // добавляем токен в заголовки -- нужно чтобы хук получал данные закрытые под авторизацию
  const headers = {
    ...config.headers,
    Authorization: session?.accessToken ? `Bearer ${session.accessToken}` : undefined,
  }

  // всегда вызываем оба хука
  const query = useQuery<TData, TError>({
    queryKey: [url, config.params],
    queryFn: async () => {
      try {
        const response = await axios.get(fullUrl, { ...config, headers })
        return response.data
      } catch (error) {
        if (error instanceof AxiosError) {
          handle401Error(error) // если 401 ошибка первый раз, то перезагружаем страницу
        }
        throw error
      }
    },
    ...queryOptions,
    // отключаем автоматическое выполнение для мутаций
    enabled: method === 'GET' && queryOptions.enabled !== false,
  })

  const mutation = useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      try {
        const response = await axios({
          method: method.toLowerCase(),
          url: fullUrl,
          data: variables,
          ...config,
          headers,
        })
        return response.data
      } catch (error) {
        if (error instanceof AxiosError) {
          handle401Error(error)
        }
        throw error
      }
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
