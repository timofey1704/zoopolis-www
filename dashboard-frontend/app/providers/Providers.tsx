'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './AuthProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      // кэш: данные считаются свежими 1 мин — при возврате на страницу показываются сразу из кэша без загрузки
      staleTime: 60 * 1000,
      // не удалять неиспользуемые данные из кэша 10 мин — быстрый возврат при навигации
      gcTime: 10 * 60 * 1000,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
