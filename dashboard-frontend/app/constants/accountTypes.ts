export const accountTypeToDisplayName = {
  zooID: 'Зоо ID',
  concierge: 'Зооконсьерж',
  zoopolis: 'Зоополис',
} as const

// для бекенда
export const displayNameToAccountType: Record<string, keyof typeof accountTypeToDisplayName> = {
  'Зоо ID': 'zooID',
  Зооконсьерж: 'concierge',
  Зоополис: 'zoopolis',
}

export const getAccountTypeStyles = (accountType: string) => {
  switch (accountType.toLowerCase()) {
    case 'zooid':
      return 'bg-gray-400 text-white'
    case 'concierge':
      return 'bg-orange/70 text-white'
    case 'zoopolis':
      return 'bg-blue-500 text-white'
    default:
      return 'bg-gray-200'
  }
}
