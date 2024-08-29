export interface IDesignItem {
  id: string
  title: string
  image: {
    id: string
    imageUrl: string
    placeholder: string
  }
  link: string
  type: string
  isActive: boolean
  index: number
  created: string
  lastUpdated: string
}
