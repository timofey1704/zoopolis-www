export const getGreetingByTime = () => {
  const hour = new Date().getHours()

  if (hour < 5) return 'Доброй ночи'

  switch (true) {
    case hour < 11:
      return 'Доброе утро'
    case hour < 17:
      return 'Добрый день'
    default:
      return 'Добрый вечер'
  }
}
