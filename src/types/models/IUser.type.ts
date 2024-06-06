import { IUserSpecification } from '@/types'

export interface IUser {
  id: string
  imageSrc: {
    id: string
    imageUrl: string
    placeholder: string
  } | null
  mobileNumber: string
  fullName: string
  roleNames: string[] | null
  lastActivity: string | null
  orderCount: number
  city: string | null
  wallet: boolean
  isActive: boolean
  userSpecification: IUserSpecification
  created: string | null
  lastUpdated: string | null
}
