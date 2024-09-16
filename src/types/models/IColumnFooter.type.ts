import { IFooterArticleColumn } from './IFooterArticleColumn.type'

export interface IColumnFooter {
  id?: string | undefined
  name: string
  index?: number
  footerArticleColumns: IFooterArticleColumn[]
  created?: string
  lastUpdated?: string
}
