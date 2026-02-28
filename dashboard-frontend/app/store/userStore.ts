import { create } from 'zustand'
import { User } from '../types'

interface UserStore {
  user: User | null
  isAuthChecked: boolean

  setUser: (user: User | null) => void
  setAuthChecked: (value: boolean) => void
  logout: () => void
}

const useUserStore = create<UserStore>(set => ({
  user: null,
  isAuthChecked: false,

  setUser: user => set({ user }),
  setAuthChecked: value => set({ isAuthChecked: value }),

  logout: () =>
    set({
      user: null,
    }),
}))

export default useUserStore

// пример использования
// const { user, isAuthenticated } = useUserStore() -- получаем данные из стора
// const { setUser, setAuthenticated } = useUserStore() -- устанавливаем данные в стор
// const { logout } = useUserStore() -- выходим из пользовательского аккаунта
