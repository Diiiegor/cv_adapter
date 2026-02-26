import { useState, useRef, useEffect } from 'react'
import { adaptCVStream, type AdaptCVResponse } from '../services/api'
import CVUpload from './CVUpload'
import JobDescription from './JobDescription'
import PdfPreview from './PdfPreview'

const STEPS: { step: number; label: string }[] = [
  { step: 1, label: 'Validando tamaño del archivo' },
  { step: 2, label: 'Validando tipo de archivo (PDF)' },
  { step: 3, label: 'Validando que sea un CV' },
  { step: 4, label: 'CV validado' },
  { step: 5, label: 'Adaptando CV a la oferta' },
  { step: 6, label: 'Generando PDF' },
  { step: 7, label: 'PDF generado' },
]

const CVAdapter = () => {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AdaptCVResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progressStep, setProgressStep] = useState<number>(0)
  const [progressMessage, setProgressMessage] = useState<string>('')
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl)
    }
  }, [pdfBlobUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError('Por favor, selecciona un archivo PDF')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setProgressStep(0)
    setProgressMessage('')
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl)
      setPdfBlobUrl(null)
    }

    try {
      const response = await adaptCVStream(
        file,
        jobDescription.trim() || undefined,
        (ev) => {
          if (ev.event === 'progress') {
            setProgressStep(ev.data.step)
            setProgressMessage(ev.data.message)
          } else if (ev.event === 'done') {
            setProgressStep(ev.data.step)
            setProgressMessage(ev.data.message)
          }
        }
      )
      setResult(response)
      if (response.data?.pdf_base64) {
        const byteChars = atob(response.data.pdf_base64)
        const byteArray = new Uint8Array(byteChars.length)
        for (let i = 0; i < byteChars.length; i++) {
          byteArray[i] = byteChars.charCodeAt(i)
        }
        const blob = new Blob([byteArray], { type: 'application/pdf' })
        setPdfBlobUrl(URL.createObjectURL(blob))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al adaptar el CV')
    } finally {
      setLoading(false)
      setProgressStep(0)
      setProgressMessage('')
    }
  }

  const handleReset = () => {
    setFile(null)
    setJobDescription('')
    setResult(null)
    setError(null)
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl)
      setPdfBlobUrl(null)
    }
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

          {loading && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-xl p-5 md:p-6 bg-zinc-800/80 border border-zinc-600/60"
            >
              <p className="font-display font-semibold text-zinc-200 mb-4">Progreso</p>
              <ul className="space-y-3">
                {STEPS.map(({ step, label }) => {
                  const completed = progressStep > step || (progressStep === step && step === 7)
                  const current = progressStep === step && step !== 7
                  return (
                    <li
                      key={step}
                      className={`flex items-center gap-3 text-sm transition-colors ${
                        completed ? 'text-emerald-400' : current ? 'text-emerald-300' : 'text-zinc-500'
                      }`}
                    >
                      {completed ? (
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      ) : current ? (
                        <span className="w-6 h-6 flex items-center justify-center shrink-0" aria-hidden>
                          <svg
                            className="animate-spin h-5 w-5 text-emerald-400"
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
                        </span>
                      ) : (
                        <span className="w-6 h-6 rounded-full border border-zinc-600 flex shrink-0" aria-hidden />
                      )}
                      <span className={current ? 'font-medium' : ''}>{label}</span>
                      {current && progressMessage && (
                        <span className="text-zinc-400 truncate">— {progressMessage}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {result?.success && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-xl p-5 md:p-6 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-500/40 shadow-lg shadow-emerald-500/5"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/30">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold text-lg text-emerald-100">
                    CV adaptado a la oferta
                  </p>
                  <p className="text-sm text-zinc-400 mt-1">{result.detail}</p>
                </div>
              </div>
              {pdfBlobUrl && (
                <div className="mt-4">
                  <PdfPreview blobUrl={pdfBlobUrl} />
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={!file || loading}
              className="flex-1 min-w-[140px] font-display bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-zinc-50 py-3 px-6 rounded-xl font-semibold hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-500 active:from-emerald-700 active:via-teal-700 active:to-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 focus-visible:ring-emerald-500 disabled:from-zinc-600 disabled:via-zinc-600 disabled:to-zinc-600 disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-200"
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
                className="px-6 py-3 border border-zinc-600 rounded-xl font-medium text-zinc-300 hover:bg-zinc-800 hover:border-zinc-500 active:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
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
