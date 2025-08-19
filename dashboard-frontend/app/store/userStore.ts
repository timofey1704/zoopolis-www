import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, UserState } from '../types'

interface UserStore extends UserState {
  // состояние
  isAuthenticated: boolean
  user: User | null

  // действия
  setUser: (user: User | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  logout: () => void

  // асинхронные действия
  //!  что пользователь может делать асинхронно?
}

const useUserStore = create<UserStore>()(
  persist(
    set => ({
      // начальное состояние
      isAuthenticated: false,
      user: null,
      favorites: [],

      // синхронные действия
      setUser: user => set({ user }),
      setAuthenticated: isAuthenticated => set({ isAuthenticated }),
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
        }),
    }),

    //! асинхронщина?
    { name: 'user-store' }
  )
)

export default useUserStore

// пример использования
// const { user, isAuthenticated } = useUserStore() -- получаем данные из стора
// const { setUser, setAuthenticated } = useUserStore() -- устанавливаем данные в стор
// const { logout } = useUserStore() -- выходим из пользовательского аккаунта
