export interface JobDescriptionProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string | null
}

const JobDescription = ({
  value,
  onChange,
  placeholder = 'Pega aquí la descripción de la oferta de trabajo...',
  disabled = false,
  error = null,
}: JobDescriptionProps) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="job-description"
        className="block text-sm font-medium text-zinc-300"
      >
        Descripción del puesto
      </label>
      <textarea
        id="job-description"
        name="job-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="block w-full rounded-lg border border-zinc-600 bg-zinc-800/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none disabled:bg-zinc-800 disabled:cursor-not-allowed h-[300px] resize-none"
      />
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default JobDescription
