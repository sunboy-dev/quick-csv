import { useState } from 'react'
import CsvInput from './components/CsvInput'
import DataTable from './components/DataTable'
import { useCsvParser } from './hooks/useCsvParser'
import { useTableView } from './hooks/useTableView'

export default function App() {
  const [csvInput, setCsvInput] = useState('')
  const { data, error } = useCsvParser(csvInput)
  const {
    search,
    setSearch,
    sort,
    toggleSort,
    displayRows,
    totalRows,
  } = useTableView(data)

  return (
    <div className="h-screen flex flex-col bg-neutral-50 p-4 gap-4 overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-secondary text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-primary leading-tight tracking-tight">
              Quick CSV
            </h1>
            <p className="text-[11px] font-medium text-neutral-400 leading-tight">
              Paste · View · Analyze
            </p>
          </div>
        </div>

        {/* Status pill */}
        {data && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-medium animate-in">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {data.columns.length} column{data.columns.length !== 1 ? 's' : ''} · {data.rows.length.toLocaleString()} row{data.rows.length !== 1 ? 's' : ''}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Parse error
          </div>
        )}
      </header>

      {/* CSV Input — ~35% */}
      <div className="flex-[35] min-h-0 flex flex-col">
        <CsvInput value={csvInput} onChange={setCsvInput} />
      </div>

      {/* Data Table — ~65% */}
      <div className="flex-[65] min-h-0 flex flex-col">
        <DataTable
          data={data}
          error={error}
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onToggleSort={toggleSort}
          displayRows={displayRows}
          totalRows={totalRows}
        />
      </div>
    </div>
  )
}
