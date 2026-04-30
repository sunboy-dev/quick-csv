import type { TableData, SortState } from '../types'

interface DataTableProps {
  data: TableData | null
  error: string | null
  /* Search */
  search: string
  onSearchChange: (value: string) => void
  /* Sort */
  sort: SortState
  onToggleSort: (columnIndex: number) => void
  /* Display rows (filtered + sorted) */
  displayRows: string[][]
  totalRows: number
}

export default function DataTable({
  data,
  error,
  search,
  onSearchChange,
  sort,
  onToggleSort,
  displayRows,
  totalRows,
}: DataTableProps) {
  /* ─── Error banner ─── */
  if (error) {
    return (
      <section
        id="data-table-card"
        className="flex flex-col h-full rounded-2xl bg-white shadow-soft border border-neutral-200 overflow-hidden"
      >
        <SectionHeader rowCount={0} totalRows={0} search="" onSearchChange={() => {}} hasData={false} />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium max-w-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </section>
    )
  }

  /* ─── Empty placeholder ─── */
  if (!data) {
    return (
      <section
        id="data-table-card"
        className="flex flex-col h-full rounded-2xl bg-white shadow-soft border border-neutral-200 overflow-hidden"
      >
        <SectionHeader rowCount={0} totalRows={0} search="" onSearchChange={() => {}} hasData={false} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-neutral-400 gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
          <p className="text-sm font-medium">No data to display</p>
          <p className="text-xs">Paste CSV content above to see the table</p>
        </div>
      </section>
    )
  }

  /* ─── Table ─── */
  return (
    <section
      id="data-table-card"
      className="flex flex-col h-full rounded-2xl bg-white shadow-soft border border-neutral-200 overflow-hidden"
    >
      <SectionHeader
        rowCount={displayRows.length}
        totalRows={totalRows}
        search={search}
        onSearchChange={onSearchChange}
        hasData={true}
      />

      {/* No search results */}
      {displayRows.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-neutral-400 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <p className="text-sm font-medium">No data found</p>
          <p className="text-xs">Try a different search term</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse text-sm min-w-max">
            <thead className="sticky top-0 z-10">
              <tr>
                {/* Row-number column */}
                <th className="bg-primary text-white/70 text-xs font-medium px-3 py-2.5 text-right whitespace-nowrap border-r border-primary-700">
                  #
                </th>
                {data.columns.map((col, i) => (
                  <th
                    key={i}
                    onClick={() => onToggleSort(i)}
                    className="bg-primary text-white font-semibold px-4 py-2.5 text-left whitespace-nowrap border-r border-primary-700 last:border-r-0 cursor-pointer select-none hover:bg-primary-800 transition-colors duration-100 group"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {col}
                      <SortIcon active={sort.columnIndex === i} direction={sort.columnIndex === i ? sort.direction : null} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-b border-neutral-100 transition-colors duration-100 hover:bg-secondary-50/60 even:bg-neutral-50"
                >
                  {/* Row number */}
                  <td className="px-3 py-2 text-right text-xs font-medium text-neutral-400 border-r border-neutral-100 tabular-nums">
                    {ri + 1}
                  </td>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-4 py-2 text-primary-800 whitespace-nowrap border-r border-neutral-100 last:border-r-0"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

/* ─── Sort direction indicator ─── */
function SortIcon({ active, direction }: { active: boolean; direction: 'asc' | 'desc' | null }) {
  if (!active || !direction) {
    // Dim arrows when inactive
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="7 15 12 20 17 15" />
        <polyline points="17 9 12 4 7 9" />
      </svg>
    )
  }

  if (direction === 'asc') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-secondary-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 14 12 9 7 14" />
      </svg>
    )
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-secondary-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="7 10 12 15 17 10" />
    </svg>
  )
}

/* ─── Sub-component: section header with search + export ─── */
function SectionHeader({
  rowCount,
  totalRows,
  search,
  onSearchChange,
  hasData,
}: {
  rowCount: number
  totalRows: number
  search: string
  onSearchChange: (v: string) => void
  hasData: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-neutral-100 shrink-0">
      {/* Left: icon + title + count */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-primary-800 tracking-tight">Table View</h2>
        {totalRows > 0 && (
          <span className="text-xs font-medium text-neutral-400 tabular-nums">
            {rowCount === totalRows
              ? `${totalRows.toLocaleString()} row${totalRows !== 1 ? 's' : ''}`
              : `${rowCount.toLocaleString()} / ${totalRows.toLocaleString()} rows`}
          </span>
        )}
      </div>

      {/* Right: search + export */}
      {hasData && (
        <div className="flex items-center gap-2">
          {/* Search input */}
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="table-search"
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-44 pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-neutral-50 text-primary-800 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
            />
          </div>
        </div>
      )}
    </div>
  )
}
