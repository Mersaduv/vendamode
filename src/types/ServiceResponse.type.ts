export default interface ServiceResponse<T> {
  count: number
  data: T | null
  success: boolean
  message: string
}
