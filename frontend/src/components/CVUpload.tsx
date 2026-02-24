import { useRef, useState, type RefObject } from 'react'

export interface CVUploadProps {
  file: File | null
  onFileChange: (file: File | null) => void
  loading?: boolean
  error?: string | null
  inputRef?: RefObject<HTMLInputElement | null>
}

const formatFileSize = (bytes: number) => {
  const mb = bytes / 1024 / 1024
  return mb < 0.01 ? '< 0.01 MB' : `${mb.toFixed(2)} MB`
}

const CVUpload = ({
  file,
  onFileChange,
  loading = false,
  error = null,
  inputRef: externalRef,
}: CVUploadProps) => {
  const internalRef = useRef<HTMLInputElement>(null)
  const inputRef = externalRef ?? internalRef
  const [isDragOver, setIsDragOver] = useState(false)

  const validateAndSet = (selectedFile: File | null) => {
    if (!selectedFile) {
      onFileChange(null)
      return
    }
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      onFileChange(null)
      return
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      onFileChange(null)
      return
    }
    onFileChange(selectedFile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSet(e.target.files?.[0] ?? null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!loading) setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    if (loading) return
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) validateAndSet(dropped)
  }

  const getValidationError = (): string | null => {
    if (error) return error
    if (!file) return null
    if (!file.name.toLowerCase().endsWith('.pdf')) return 'Solo se permiten archivos PDF'
    if (file.size > 10 * 1024 * 1024) return 'El archivo es demasiado grande (máximo 10MB)'
    return null
  }

  const validationError = getValidationError()

  return (
    <div className="space-y-2">
      <label
        htmlFor="pdf-file"
        className="block text-sm font-medium text-zinc-300"
      >
        Sube tu CV (PDF)
      </label>
      <div
        role="button"
        tabIndex={0}
        aria-label="Sube tu CV en PDF o arrastra un archivo aquí"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('label')) return
          if (!loading) inputRef.current?.click()
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          mt-1 flex justify-center items-center px-4 pt-5 pb-6 border-2 border-dashed rounded-xl
          transition-all duration-200 ease-out h-[300px] min-h-[200px]
          ${isDragOver && !loading
            ? 'border-emerald-500/70 bg-emerald-500/10'
            : 'border-zinc-600 bg-zinc-800/50 hover:border-emerald-500/50'
          }
          ${loading ? 'pointer-events-none opacity-70' : 'cursor-pointer'}
        `}
      >
        <div className="space-y-1 text-center w-full max-w-sm">
          <svg
            className={`mx-auto h-12 w-12 transition-colors ${isDragOver ? 'text-emerald-400' : 'text-zinc-500'}`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {isDragOver && !file && (
            <p className="text-sm font-medium text-emerald-400">Suelta el PDF aquí</p>
          )}
          {!isDragOver && (
            <>
              <div className="flex text-sm text-zinc-400 justify-center flex-wrap gap-1">
                <label
                  htmlFor="pdf-file"
                  className="relative cursor-pointer rounded-md font-medium text-emerald-400 hover:text-emerald-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 focus-within:ring-offset-zinc-900"
                >
                  <span>Sube un archivo</span>
                  <input
                    id="pdf-file"
                    name="pdf-file"
                    type="file"
                    accept=".pdf"
                    className="sr-only"
                    onChange={handleFileChange}
                    ref={inputRef}
                    disabled={loading}
                    aria-describedby={validationError ? 'pdf-file-error' : undefined}
                  />
                </label>
                <span>o arrastra y suelta</span>
              </div>
              <p className="text-xs text-zinc-500 tabular-nums">PDF hasta 10 MB</p>
            </>
          )}
          {file && (
            <div className="mt-3 flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-left max-w-full">
                <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-emerald-100 truncate" title={file.name}>{file.name}</span>
                <span className="text-xs text-zinc-400 tabular-nums shrink-0">{formatFileSize(file.size)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {validationError && (
        <p id="pdf-file-error" className="text-sm text-red-400 font-medium" role="alert">
          {validationError}
        </p>
      )}
    </div>
  )
}

export default CVUpload
