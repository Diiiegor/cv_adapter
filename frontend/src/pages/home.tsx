import CVValidator from '../components/CVValidator'
import StatsCharts from '../components/StatsCharts'

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle grid + glow background */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid pointer-events-none opacity-60" aria-hidden />
      <div className="fixed inset-0 bg-hero-glow pointer-events-none" aria-hidden />

      {/* Nav / Branding */}
      <header className="relative bg-dark-bg/90 backdrop-blur-md sticky top-0 z-10">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" aria-hidden />
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-teal-500/20 flex items-center justify-center ring-1 ring-emerald-500/30">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-zinc-50 tracking-tight">CV Adapter</span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/10 border border-emerald-500/30 text-emerald-400">
              Sin filtros
            </span>
          </div>
          <p className="text-sm text-zinc-500 font-medium hidden sm:block italic">
            Pasa los filtros. Consigue entrevistas.
          </p>
        </div>
      </header>

      {/* Hero */}
      <section className="relative container mx-auto px-4 pt-14 pb-12 md:pt-20 md:pb-16 text-center">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
          No dejes que un algoritmo te descarte
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold text-zinc-50 max-w-4xl mx-auto leading-[1.1] tracking-tight">
          Que tu CV no te detenga.
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
            Pasa filtros ATS e IA.
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Adapta tu CV a cada oferta en minutos. Evita que los sistemas automáticos descarten tu perfil y llega directo a entrevistas.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
          <span className="px-4 py-2 rounded-full bg-gradient-to-r from-zinc-800/90 to-zinc-800/60 text-zinc-300 border border-emerald-500/20">
            ✓ Sin quedar atrapado en ATS
          </span>
          <span className="px-4 py-2 rounded-full bg-gradient-to-r from-zinc-800/90 to-zinc-800/60 text-zinc-300 border border-teal-500/20">
            ✓ Priorizado por IA
          </span>
          <span className="px-4 py-2 rounded-full bg-gradient-to-r from-zinc-800/90 to-zinc-800/60 text-zinc-300 border border-emerald-500/20">
            ✓ Más entrevistas, menos silencio
          </span>
        </div>
      </section>

      {/* Value sections — asymmetric accent */}
      <section className="relative border-y border-zinc-800/80 bg-gradient-section">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent" aria-hidden />
        <div className="container mx-auto px-4 py-14 md:py-20 pl-6 md:pl-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2 text-center md:text-left bg-gradient-to-r from-zinc-50 to-zinc-400 bg-clip-text text-transparent">
            Por qué te conviene
          </h2>
          <p className="text-zinc-500 text-center md:text-left mb-12 max-w-xl">
            Tres razones para dejar de enviar el mismo CV a todas partes.
          </p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-emerald-500/50 via-teal-500/30 to-emerald-500/30 transition-all duration-300 hover:from-emerald-500/60 hover:via-teal-400/40 hover:to-emerald-500/50">
              <div className="relative rounded-2xl bg-zinc-800/60 p-6 h-full">
                <span className="absolute top-4 right-4 font-display text-4xl font-extrabold text-zinc-700/80 group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">01</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/25 to-teal-500/20 flex items-center justify-center mb-4 ring-1 ring-emerald-500/30">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="font-display text-lg font-bold text-zinc-50 mb-2">Supera filtros ATS</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Muchas empresas usan sistemas que descartan CVs antes de que un humano los vea. Ajustamos formato y palabras clave para que pases la primera criba.
                </p>
              </div>
            </div>
            <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-emerald-500/50 via-teal-500/30 to-emerald-500/30 transition-all duration-300 hover:from-emerald-500/60 hover:via-teal-400/40 hover:to-emerald-500/50">
              <div className="relative rounded-2xl bg-zinc-800/60 p-6 h-full">
                <span className="absolute top-4 right-4 font-display text-4xl font-extrabold text-zinc-700/80 group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">02</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/25 to-teal-500/20 flex items-center justify-center mb-4 ring-1 ring-emerald-500/30">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-display text-lg font-bold text-zinc-50 mb-2">Filtros de IA</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Los reclutadores usan IA para priorizar candidatos. Alineamos tu CV con la oferta para que los algoritmos te sitúen entre los primeros.
                </p>
              </div>
            </div>
            <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-emerald-500/50 via-teal-500/30 to-emerald-500/30 transition-all duration-300 hover:from-emerald-500/60 hover:via-teal-400/40 hover:to-emerald-500/50">
              <div className="relative rounded-2xl bg-zinc-800/60 p-6 h-full">
                <span className="absolute top-4 right-4 font-display text-4xl font-extrabold text-zinc-700/80 group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">03</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/25 to-teal-500/20 flex items-center justify-center mb-4 ring-1 ring-emerald-500/30">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-display text-lg font-bold text-zinc-50 mb-2">Entrevistas más rápido</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Un CV que encaja con la oferta llama más la atención. Menos rechazos silenciosos y más oportunidades de hablar con reclutadores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Charts */}
      <StatsCharts />

      {/* CTA + Tool */}
      <section className="relative container mx-auto px-4 py-14 md:py-20">
        <div className="text-center mb-12">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] mb-3 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
            Empieza ya
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            <span className="text-zinc-50">Valida y adapta </span>
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">tu CV</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Sube tu CV y la descripción del puesto. Comprueba que tu perfil encaja y evita quedar fuera por filtros automáticos.
          </p>
        </div>
        <CVValidator />
      </section>

      {/* Footer */}
      <footer className="relative mt-auto">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" aria-hidden />
        <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500/30 to-teal-500/20 flex items-center justify-center ring-1 ring-emerald-500/20">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-display font-bold text-zinc-500 text-sm">CV Adapter</span>
          </div>
          <p className="text-sm text-zinc-600 font-medium italic">
            Pasa los filtros. Consigue entrevistas.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home
