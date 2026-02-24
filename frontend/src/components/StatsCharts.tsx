import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const METRIC_SUBJECTS = [
  'Tasa respuesta',
  'Rapidez entrevista',
  'Entrevistas/mes',
  'Match ofertas',
  'Respuesta reclutadores',
  'Progreso proceso',
] as const

/** Métricas ANTES de usar CV Adapter (derecha) */
const radarAntesData = [
  { subject: METRIC_SUBJECTS[0], value: 12, fullMark: 100 },
  { subject: METRIC_SUBJECTS[1], value: 22, fullMark: 100 },
  { subject: METRIC_SUBJECTS[2], value: 15, fullMark: 100 },
  { subject: METRIC_SUBJECTS[3], value: 25, fullMark: 100 },
  { subject: METRIC_SUBJECTS[4], value: 15, fullMark: 100 },
  { subject: METRIC_SUBJECTS[5], value: 20, fullMark: 100 },
]

/** Métricas DESPUÉS de usar CV Adapter – mejora (izquierda) */
const radarDespuesData = [
  { subject: METRIC_SUBJECTS[0], value: 48, fullMark: 100 },
  { subject: METRIC_SUBJECTS[1], value: 72, fullMark: 100 },
  { subject: METRIC_SUBJECTS[2], value: 65, fullMark: 100 },
  { subject: METRIC_SUBJECTS[3], value: 75, fullMark: 100 },
  { subject: METRIC_SUBJECTS[4], value: 55, fullMark: 100 },
  { subject: METRIC_SUBJECTS[5], value: 70, fullMark: 100 },
]

const customTooltipStyle = {
  backgroundColor: 'rgba(24, 24, 27, 0.95)',
  border: '1px solid rgba(63, 63, 70, 0.8)',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '13px',
  color: '#fafafa',
}

const StatsCharts = () => {
  return (
    <section className="relative border-y border-zinc-800/80 bg-zinc-900/30 py-14 md:py-20">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-teal-500/40 to-transparent" aria-hidden />
      <div className="container mx-auto px-4 pl-6 md:pl-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2 text-center md:text-left bg-gradient-to-r from-zinc-50 to-zinc-400 bg-clip-text text-transparent">
          Los resultados hablan
        </h2>
        <p className="text-zinc-500 text-center md:text-left mb-12 max-w-xl">
          Datos de usuarios que adaptaron su CV con nuestra herramienta (muestra representativa).
        </p>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Izquierda: Antes (lectura natural primero) */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-zinc-600/40 via-zinc-600/30 to-zinc-600/40">
            <div className="rounded-2xl bg-zinc-800/50 p-6 h-full">
              <h3 className="font-display text-lg font-bold text-zinc-50 mb-1">
                Antes de CV Adapter
              </h3>
              <p className="text-sm text-zinc-500 mb-4">
                Métricas típicas sin adaptar el CV a la oferta
              </p>
              <div className="h-[260px] sm:h-[280px]" role="img" aria-label="Gráfico radar: métricas antes de usar la herramienta">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarAntesData} margin={{ top: 16, right: 24, left: 24, bottom: 16 }}>
                    <PolarGrid stroke="rgba(63, 63, 70, 0.8)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#a1a1aa', fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: '#71717a', fontSize: 10 }}
                    />
                    <Radar
                      name="Antes"
                      dataKey="value"
                      stroke="#52525b"
                      fill="#52525b"
                      fillOpacity={0.35}
                      strokeWidth={2}
                    />
                    <Tooltip
                      contentStyle={customTooltipStyle}
                      formatter={(value: number) => [`${value}%`, '']}
                      labelFormatter={(label) => label}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-zinc-500 mt-3 font-medium">
                Valores de referencia sin uso de la herramienta
              </p>
            </div>
          </div>

          {/* Derecha: Después (mejora) */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-emerald-500/30">
            <div className="rounded-2xl bg-zinc-800/50 p-6 h-full">
              <h3 className="font-display text-lg font-bold text-zinc-50 mb-1">
                Después de CV Adapter
              </h3>
              <p className="text-sm text-zinc-500 mb-4">
                Métricas de mejora tras adaptar el CV con la herramienta
              </p>
              <div className="h-[260px] sm:h-[280px]" role="img" aria-label="Gráfico radar: métricas después de usar la herramienta">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarDespuesData} margin={{ top: 16, right: 24, left: 24, bottom: 16 }}>
                    <PolarGrid stroke="rgba(63, 63, 70, 0.8)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#a1a1aa', fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: '#71717a', fontSize: 10 }}
                    />
                    <Radar
                      name="Después"
                      dataKey="value"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.4}
                      strokeWidth={2}
                    />
                    <Tooltip
                      contentStyle={customTooltipStyle}
                      formatter={(value: number) => [`${value}%`, '']}
                      labelFormatter={(label) => label}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-emerald-400/90 mt-3 font-medium">
                Mejora notable en tasa de respuesta, rapidez y match con ofertas
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-6" aria-hidden>
          <span className="inline-flex items-center gap-2 text-sm text-zinc-500">
            <span className="w-3 h-3 rounded-full bg-zinc-500" /> Antes
          </span>
          <span className="inline-flex items-center gap-2 text-sm text-zinc-500">
            <span className="w-3 h-3 rounded-full bg-emerald-500" /> Después
          </span>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-8 max-w-2xl mx-auto">
          * Resultados basados en encuestas a usuarios. Los resultados individuales pueden variar en función del sector y del uso de la herramienta.
        </p>
      </div>
    </section>
  )
}

export default StatsCharts
