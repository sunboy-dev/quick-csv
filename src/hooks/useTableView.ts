import { useState, useMemo, useCallback } from 'react'
import type { TableData, SortState, SortDirection } from '../types'

interface UseTableViewResult {
  /** Current search keyword */
  search: string
  setSearch: (value: string) => void
  /** Current sort state */
  sort: SortState
  /** Toggle sort on a column index */
  toggleSort: (columnIndex: number) => void
  /** Processed rows (filtered + sorted) */
  displayRows: string[][]
  /** Total rows before filtering */
  totalRows: number
}

export function useTableView(data: TableData | null): UseTableViewResult {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState>({ columnIndex: null, direction: null })

  // Reset sort when data changes shape
  const columnCount = data?.columns.length ?? 0

  const toggleSort = useCallback(
    (columnIndex: number) => {
      setSort((prev) => {
        if (prev.columnIndex !== columnIndex) {
          return { columnIndex, direction: 'asc' as SortDirection }
        }
        // Cycle: asc → desc → reset
        const next: SortDirection =
          prev.direction === 'asc' ? 'desc' : prev.direction === 'desc' ? null : 'asc'
        return { columnIndex: next === null ? null : columnIndex, direction: next }
      })
    },
    [],
  )

  const displayRows = useMemo(() => {
    if (!data) return []

    let rows = data.rows

    // 1) Filter by search keyword
    if (search.trim()) {
      const keyword = search.trim().toLowerCase()
      rows = rows.filter((row) => row.some((cell) => cell.toLowerCase().includes(keyword)))
    }

    // 2) Sort
    if (sort.columnIndex !== null && sort.direction !== null) {
      const ci = sort.columnIndex
      const dir = sort.direction === 'asc' ? 1 : -1
      rows = [...rows].sort((a, b) => {
        const av = a[ci] ?? ''
        const bv = b[ci] ?? ''
        // Try numeric comparison first
        const an = Number(av)
        const bn = Number(bv)
        if (!isNaN(an) && !isNaN(bn)) {
          return (an - bn) * dir
        }
        return av.localeCompare(bv) * dir
      })
    }

    return rows
  }, [data, search, sort])

  return {
    search,
    setSearch,
    sort,
    toggleSort,
    displayRows,
    totalRows: data?.rows.length ?? 0,
  }
}
