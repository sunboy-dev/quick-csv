import { useRef, useState, useCallback } from 'react'

interface FileUploadProps {
  onFileContent: (content: string) => void
}

export default function FileUpload({ onFileContent }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  const readFile = useCallback(
    (file: File) => {
      setFileError(null)

      if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
        setFileError('Only .csv files are supported')
        return
      }

      if (file.size === 0) {
        setFileError('File is empty')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        if (typeof text === 'string') {
          onFileContent(text)
        }
      }
      reader.onerror = () => {
        setFileError('Failed to read file')
      }
      reader.readAsText(file)
    },
    [onFileContent],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) readFile(file)
    },
    [readFile],
  )

  const handleClick = () => inputRef.current?.click()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) readFile(file)
    // Reset so the same file can be re-uploaded
    e.target.value = ''
  }

  return (
    <div className="flex flex-col h-full gap-2">
      <div
        id="file-upload-zone"
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex-1 flex flex-col items-center justify-center gap-3
          rounded-xl border-2 border-dashed cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? 'border-secondary bg-secondary-50/80 scale-[1.01]'
              : 'border-neutral-300 bg-neutral-50 hover:border-secondary-300 hover:bg-secondary-50/40'
          }
        `}
      >
        {/* Upload icon */}
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-200 ${
            isDragging
              ? 'bg-secondary-100 text-secondary-600'
              : 'bg-neutral-200/60 text-neutral-400'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5.5 h-5.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <div className="text-center px-3">
          <p
            className={`text-sm font-medium transition-colors duration-200 ${
              isDragging ? 'text-secondary-700' : 'text-neutral-600'
            }`}
          >
            Drag &amp; drop CSV here
          </p>
          <p className="text-xs text-neutral-400 mt-0.5">or click to upload</p>
        </div>
      </div>

      {/* Error message */}
      {fileError && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {fileError}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        id="file-upload-input"
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  )
}
