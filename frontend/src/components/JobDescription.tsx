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
        aria-invalid={!!error}
        aria-describedby={error ? 'job-description-error' : undefined}
        className="block w-full rounded-xl border border-zinc-600 bg-zinc-800/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 transition-colors duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none hover:border-zinc-500 disabled:bg-zinc-800/80 disabled:border-zinc-700 disabled:cursor-not-allowed disabled:opacity-80 h-[300px] min-h-[120px] resize-y"
      />
      {error && (
        <p id="job-description-error" className="text-sm text-red-400 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default JobDescription
