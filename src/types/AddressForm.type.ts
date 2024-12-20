export default interface AddressForm {
  userId: string
  fullName: string
  mobileNumber: string
  city: {
    id: number
    name: string
    slug: string
    province_id: number
  }
  province: {
    id: number
    name: string
    slug: string
  }
  fullAddress: string
  postalCode: string
}
