import { IPermission } from '@/types'

export interface IRole {
  id: string
  title: string
  isActive: boolean
  permissions: IPermission[]
  created: string | null
  lastUpdated: string | null
}
