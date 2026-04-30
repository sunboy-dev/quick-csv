export type TableData = {
  columns: string[]
  rows: string[][]
}

export type ParseResult = {
  data: TableData | null
  error: string | null
}

export type SortDirection = 'asc' | 'desc' | null

export type SortState = {
  columnIndex: number | null
  direction: SortDirection
}
