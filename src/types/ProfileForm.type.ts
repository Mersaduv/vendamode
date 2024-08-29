export default interface ProfileForm {
  mobileNumber?: string
  gender: 'آقا' | 'بانو'
  firstName: string
  familyName: string
  nationalCode?: string | undefined
  birthDate?: string
  bankAccountNumber?: string | undefined
  shabaNumber?: string | undefined
  email?: string
}
