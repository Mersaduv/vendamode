export default interface IPagination<T> {
  currentPage: number
  nextPage: number
  previousPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  lastPage: number
  data: T | null
}
