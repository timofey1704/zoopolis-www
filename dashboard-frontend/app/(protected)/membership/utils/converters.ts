import { accountTypeToDisplayName } from '@/app/constants/accountTypes'

export const convertPriceToCents = (price: number): number => {
  return Math.round(price * 100) // BYN → копейки
}

export const getDisplayPlanName = (internalName: string): string => {
  return (
    accountTypeToDisplayName[internalName as keyof typeof accountTypeToDisplayName] || internalName
  )
}
