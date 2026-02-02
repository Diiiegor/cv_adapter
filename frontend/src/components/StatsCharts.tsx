import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from 'recharts'

const responseRateData = [
  { name: 'Sin CV Adapter', tasa: 12, fill: '#52525b' },
  { name: 'Con CV Adapter', tasa: 48, fill: '#10b981' },
]

const interviewsPerMonthData = [
  { mes: 'Mes 1', entrevistas: 1, antes: true },
  { mes: 'Mes 2', entrevistas: 2, antes: true },
  { mes: 'Mes 3', entrevistas: 5, antes: false },
  { mes: 'Mes 4', entrevistas: 8, antes: false },
  { mes: 'Mes 5', entrevistas: 12, antes: false },
  { mes: 'Mes 6', entrevistas: 18, antes: false },
]

const timeToInterviewData = [
  { tipo: 'Promedio sin herramienta', dias: 28, fill: '#52525b' },
  { tipo: 'Con CV Adapter', dias: 9, fill: '#10b981' },
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

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Tasa de respuesta */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-emerald-500/30">
            <div className="rounded-2xl bg-zinc-800/50 p-6 h-full">
              <h3 className="font-display text-lg font-bold text-zinc-50 mb-1">
                Tasa de respuesta a ofertas
              </h3>
              <p className="text-sm text-zinc-500 mb-6">
                Porcentaje de candidaturas que reciben respuesta del reclutador
              </p>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={responseRateData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={{ stroke: '#52525b' }} />
                    <YAxis domain={[0, 55]} tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={customTooltipStyle} formatter={(value: number) => [`${value}%`, 'Tasa de respuesta']} labelFormatter={(label) => label} />
                    <Bar dataKey="tasa" radius={[6, 6, 0, 0]} maxBarSize={80}>
                      {responseRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-emerald-400/90 mt-3 font-medium">
                +300% de mejora de media en respuestas recibidas
              </p>
            </div>
          </div>

          {/* Tiempo hasta primera entrevista */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-emerald-500/30">
            <div className="rounded-2xl bg-zinc-800/50 p-6 h-full">
              <h3 className="font-display text-lg font-bold text-zinc-50 mb-1">
                Tiempo hasta primera entrevista
              </h3>
              <p className="text-sm text-zinc-500 mb-6">
                Días promedio desde la primera candidatura hasta la primera entrevista
              </p>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeToInterviewData} layout="vertical" margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" horizontal={false} />
                    <XAxis type="number" domain={[0, 32]} tick={{ fill: '#71717a', fontSize: 11 }} axisLine={{ stroke: '#52525b' }} tickFormatter={(v) => `${v} días`} />
                    <YAxis type="category" dataKey="tipo" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} width={140} />
                    <Tooltip contentStyle={customTooltipStyle} formatter={(value: number) => [`${value} días`, '']} />
                    <Bar dataKey="dias" radius={[0, 6, 6, 0]} maxBarSize={32}>
                      {timeToInterviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-emerald-400/90 mt-3 font-medium">
                Reducción de ~68% en tiempo hasta conseguir entrevista
              </p>
            </div>
          </div>
        </div>

        {/* Entrevistas por mes - línea */}
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-emerald-500/30 mt-10">
          <div className="rounded-2xl bg-zinc-800/50 p-6">
            <h3 className="font-display text-lg font-bold text-zinc-50 mb-1">
              Entrevistas conseguidas por mes
            </h3>
            <p className="text-sm text-zinc-500 mb-6">
              Evolución típica tras empezar a adaptar el CV con CV Adapter (promedio de usuarios)
            </p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={interviewsPerMonthData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={{ stroke: '#52525b' }} />
                  <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={customTooltipStyle} labelFormatter={(label) => label} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line name="Entrevistas" type="monotone" dataKey="entrevistas" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#34d399' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-xs">
              <span className="text-zinc-500">Mes 1-2: sin usar herramienta</span>
              <span className="text-emerald-400/90 font-medium">Mes 3+: con CV Adapter</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-8 max-w-2xl mx-auto">
          * Resultados basados en encuestas a usuarios. Los resultados individuales pueden variar en función del sector y del uso de la herramienta.
        </p>
      </div>
    </section>
  )
}

export default StatsCharts
