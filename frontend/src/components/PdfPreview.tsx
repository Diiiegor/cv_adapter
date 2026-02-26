interface PdfPreviewProps {
  blobUrl: string
  fileName?: string
}

const PdfPreview = ({ blobUrl, fileName = 'cv_adaptado.pdf' }: PdfPreviewProps) => {
  return (
    <div className="rounded-xl bg-zinc-800/60 border border-zinc-600/60 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-600/60 bg-zinc-800/80">
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="font-medium truncate">{fileName}</span>
        </div>
        <a
          href={blobUrl}
          download={fileName}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descargar
        </a>
      </div>
      <object
        data={blobUrl}
        type="application/pdf"
        className="w-full"
        style={{ height: '300px' }}
      >
        <div className="flex flex-col items-center justify-center h-[300px] text-zinc-400 text-sm gap-2">
          <p>Tu navegador no soporta la vista previa de PDF.</p>
          <a
            href={blobUrl}
            download={fileName}
            className="text-emerald-400 underline hover:text-emerald-300"
          >
            Descargar PDF
          </a>
        </div>
      </object>
    </div>
  )
}

export default PdfPreview
