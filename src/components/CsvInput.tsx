import FileUpload from './FileUpload'

interface CsvInputProps {
  value: string
  onChange: (value: string) => void
}

export default function CsvInput({ value, onChange }: CsvInputProps) {
  return (
    <section
      id="csv-input-card"
      className="flex flex-col h-full rounded-2xl bg-white shadow-soft border border-neutral-200 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 shrink-0">
        <div className="flex items-center gap-2.5">
          {/* Icon */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary-50 text-secondary-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-primary-800 tracking-tight">CSV Input</h2>
        </div>
        <span className="text-xs font-medium text-neutral-400">Paste or upload a file</span>
      </div>

      {/* Body — 2-column: textarea (8) + upload (4) */}
      <div className="flex-1 flex gap-3 p-3 min-h-0">
        {/* Left: Textarea — flex-[2] ≈ 8/12 */}
        <div className="flex-[2] min-w-0 min-h-0 flex flex-col">
          <textarea
            id="csv-textarea"
            className="w-full h-full min-h-0 resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 font-mono text-sm text-primary-800 placeholder:text-neutral-400 transition-all duration-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
            placeholder="Paste your CSV here..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Right: File upload — flex-[1] ≈ 4/12 */}
        <div className="flex-[1] min-w-0 min-h-0">
          <FileUpload onFileContent={onChange} />
        </div>
      </div>
    </section>
  )
}
