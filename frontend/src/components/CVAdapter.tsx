import { useState, useRef } from 'react'
import { adaptCV, type AdaptCVResponse } from '../services/api'
import CVUpload from './CVUpload'
import JobDescription from './JobDescription'

const CVAdapter = () => {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AdaptCVResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError('Por favor, selecciona un archivo PDF')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await adaptCV(file, jobDescription.trim() || undefined)
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al adaptar el CV')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setJobDescription('')
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-emerald-500/40 via-teal-500/25 to-emerald-500/30 shadow-2xl shadow-black/20">
        <div className="rounded-2xl bg-zinc-900/95 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-zinc-100">CV</h2>
              <CVUpload
                file={file}
                onFileChange={(f) => {
                  setFile(f)
                  setError(null)
                  setResult(null)
                }}
                loading={loading}
                error={error && !result ? error : null}
                inputRef={fileInputRef}
              />
            </div>
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-zinc-100">
                Descripción del puesto
              </h2>
              <JobDescription
                value={jobDescription}
                onChange={setJobDescription}
                disabled={loading}
              />
            </div>
          </div>

          {result?.success && (
            <div className="border rounded-xl p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border-emerald-500/40">
              <p className="font-medium text-lg mb-2">
                <span className="text-emerald-400">
                  ✓ CV adaptado a la oferta
                </span>
              </p>
              <p className="text-sm text-zinc-400 mb-3">{result.detail}</p>
              {result.data?.download_url && (
                <a
                  href={result.data.download_url}
                  download
                  className="inline-flex items-center gap-2 font-medium text-emerald-400 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar CV adaptado
                </a>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={!file || loading}
              className="flex-1 font-display bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-zinc-50 py-3 px-6 rounded-xl font-semibold hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-emerald-500 disabled:from-zinc-600 disabled:via-zinc-600 disabled:to-zinc-600 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adaptando...
                </span>
              ) : (
                'Adaptar CV'
              )}
            </button>
            {(file || jobDescription || result) && (
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-6 py-3 border border-zinc-600 rounded-xl font-medium text-zinc-300 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-emerald-500 disabled:bg-zinc-800 disabled:cursor-not-allowed transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default CVAdapter
