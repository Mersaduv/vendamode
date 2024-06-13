import { UserTypes, IRole } from '@/types'

export interface IUserSpecification {
  userId: string
  userType: UserTypes
  roles: string[] | null
  isActive: boolean
  gender: 'آقا' | 'بانو'
  imageScr: {
    id: string
    imageUrl: string
    placeholder: string
  } | null
  idCardImageSrc: {
    id: string
    imageUrl: string
    placeholder: string
  } | null
  mobileNumber: string
  passCode: string
  firstName: string
  familyName: string
  fatherName: string
  telePhone: string
  province: string
  city: string
  postalCode: string
  firstAddress: string
  secondAddress: string
  birthDate: string
  idNumber: string
  nationalCode: string
  bankAccountNumber: string
  shabaNumber: string
  email: string
  note: string
  created: string | null
  lastUpdated: string | null
}
