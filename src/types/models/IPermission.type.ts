export interface IPermission {
  id: string
  parentPermissionId: string
  isActive: boolean
  parentPermission: IPermission | null
  childPermissions: IPermission[]
  created: string | null
  lastUpdated: string | null
}
