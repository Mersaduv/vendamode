import type { IAddress } from '@/types'

export default interface WithAddressModalProps {
  openAddressModal: () => void
  isVerify: boolean
  isLoading: boolean
  addresses: IAddress[]
  isAddress: boolean
}