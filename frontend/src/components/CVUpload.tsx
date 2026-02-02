import { useRef, type RefObject } from 'react'

export interface CVUploadProps {
  file: File | null
  onFileChange: (file: File | null) => void
  loading?: boolean
  error?: string | null
  inputRef?: RefObject<HTMLInputElement | null>
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
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
      <div className="mt-1 flex justify-center items-center px-4 pt-5 pb-6 border-2 border-zinc-600 border-dashed rounded-lg hover:border-emerald-500/60 transition-colors h-[300px] bg-zinc-800/50">
        <div className="space-y-1 text-center w-full">
          <svg
            className="mx-auto h-12 w-12 text-zinc-500"
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
          <div className="flex text-sm text-zinc-400 justify-center">
            <label
              htmlFor="pdf-file"
              className="relative cursor-pointer rounded-md font-medium text-emerald-400 hover:text-emerald-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-zinc-900 focus-within:ring-emerald-500"
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
              />
            </label>
            <p className="pl-1">o arrastra y suelta</p>
          </div>
          <p className="text-xs text-zinc-500">PDF hasta 10MB</p>
          {file && (
            <p className="text-sm text-emerald-400 font-medium mt-2">
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
      </div>
      {validationError && (
        <p className="text-sm text-red-400" role="alert">
          {validationError}
        </p>
      )}
    </div>
  )
}

export default CVUpload
