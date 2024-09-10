import { IFooterArticleColumn } from './IFooterArticleColumn.type'

export interface IColumnFooter {
  id?: string | undefined
  name: string
  index?: number
  footerArticleColumn: IFooterArticleColumn[]
  created?: string
  lastUpdated?: string
}
