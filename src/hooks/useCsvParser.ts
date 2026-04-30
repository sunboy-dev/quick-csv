import { useState, useEffect, useRef } from 'react'
import Papa from 'papaparse'
import type { TableData, ParseResult } from '../types'

export function useCsvParser(csvInput: string, debounceMs = 400): ParseResult {
  const [result, setResult] = useState<ParseResult>({ data: null, error: null })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    const trimmed = csvInput.trim()

    // Empty input → reset
    if (!trimmed) {
      setResult({ data: null, error: null })
      return
    }

    // Debounce parsing
    timerRef.current = setTimeout(() => {
      try {
        const parsed = Papa.parse<string[]>(trimmed, {
          skipEmptyLines: true,
          header: false,
        })

        if (parsed.errors.length > 0) {
          const firstError = parsed.errors[0]
          setResult({
            data: null,
            error: `Row ${(firstError.row ?? 0) + 1}: ${firstError.message}`,
          })
          return
        }

        const rawRows = parsed.data as string[][]

        if (rawRows.length === 0) {
          setResult({ data: null, error: null })
          return
        }

        // First row = header, trim whitespace on every cell
        const columns = rawRows[0].map((c) => c.trim())
        const rows = rawRows.slice(1).map((row) => row.map((cell) => cell.trim()))

        const tableData: TableData = { columns, rows }
        setResult({ data: tableData, error: null })
      } catch (err) {
        setResult({
          data: null,
          error: err instanceof Error ? err.message : 'Failed to parse CSV',
        })
      }
    }, debounceMs)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [csvInput, debounceMs])

  return result
}
