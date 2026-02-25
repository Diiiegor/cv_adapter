const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface AdaptCVResponse {
  success: boolean
  detail: string
  status: number
  data?: {
    download_url?: string
    message?: string
    adapted_cv?: unknown
  }
}

export type AdaptStreamEvent =
  | { event: 'progress'; data: { step: number; message: string; is_cv?: boolean } }
  | { event: 'done'; data: { success: true; step: number; message: string; adapted_cv?: unknown } }
  | { event: 'error'; data: { success: false; message: string } }

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64 ?? '')
    }
    reader.onerror = () => reject(reader.error)
  })
}

function parseSSE(line: string): { event?: string; data?: string } {
  const out: { event?: string; data?: string } = {}
  if (line.startsWith('event:')) out.event = line.slice(6).trim()
  else if (line.startsWith('data:')) out.data = line.slice(5).trim()
  return out
}

export const adaptCVStream = async (
  file: File,
  jobDescription: string | undefined,
  onEvent: (ev: AdaptStreamEvent) => void
): Promise<AdaptCVResponse> => {
  const fileBase64 = await fileToBase64(file)

  const response = await fetch(`${API_BASE_URL}/cv/adapt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file: fileBase64,
      job_description: jobDescription?.trim() || null,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Error al adaptar el CV')
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')

  const decoder = new TextDecoder()
  let buffer = ''
  let currentEvent = ''
  let currentData = ''

  return new Promise((resolve, reject) => {
    let settled = false

    const processLine = (line: string) => {
      const parsed = parseSSE(line)
      if (parsed.event) currentEvent = parsed.event
      if (parsed.data) currentData = parsed.data
    }

    const flushEvent = () => {
      if (!currentEvent || !currentData) return
      try {
        const data = JSON.parse(currentData) as Record<string, unknown>
        const ev = { event: currentEvent, data } as AdaptStreamEvent
        onEvent(ev)

        if (currentEvent === 'done') {
          settled = true
          resolve({
            success: true,
            detail: (data.message as string) ?? 'CV adaptado correctamente',
            status: 200,
            data: {
              message: (data.message as string) ?? undefined,
              adapted_cv: data.adapted_cv,
              ...(typeof data.adapted_cv === 'object' && data.adapted_cv !== null
                ? (data.adapted_cv as Record<string, unknown>)
                : {}),
            },
          })
        } else if (currentEvent === 'error') {
          settled = true
          reject(new Error((data.message as string) ?? 'Error al adaptar el CV'))
        }
      } finally {
        currentEvent = ''
        currentData = ''
      }
    }

    const read = async (): Promise<void> => {
      if (settled) return
      const { done, value } = await reader.read()
      if (done) {
        flushEvent()
        return
      }
      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      buffer = parts.pop() ?? ''
      for (const part of parts) {
        if (settled) return
        currentEvent = ''
        currentData = ''
        for (const line of part.split('\n')) processLine(line)
        flushEvent()
      }
      return read()
    }

    read().catch((err) => {
      if (!settled) {
        settled = true
        reject(err)
      }
    })
  })
}

export const adaptCV = async (
  file: File,
  jobDescription?: string
): Promise<AdaptCVResponse> => {
  return adaptCVStream(file, jobDescription, () => {})
}
