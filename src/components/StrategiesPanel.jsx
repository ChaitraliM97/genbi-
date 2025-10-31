import React, { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function StrategiesPanel({ strategies, summary, isAnalyzed }) {
  const pdfRef = useRef(null)

  const downloadPDF = async () => {
    if (!pdfRef.current) return
    const element = pdfRef.current
    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgProps = pdf.getImageProperties(imgData)
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width

    let y = 10
    if (imgHeight < pageHeight) {
      pdf.addImage(imgData, 'PNG', 10, y, pageWidth - 20, imgHeight)
    } else {
      // Split if too long
      let position = 0
      while (position < imgHeight) {
        pdf.addImage(imgData, 'PNG', 10, 10 - position, pageWidth - 20, imgHeight)
        position += pageHeight - 20
        if (position < imgHeight) pdf.addPage()
      }
    }
    pdf.save('business-report.pdf')
  }

  // ✅ Default strategies (shown only after Analyze)
  const defaultStrategies = [
    "🎯 Focus marketing on high-rated (⭐ 4.5+) and high-selling products to boost trust and conversion.",
    "📊 Implement dynamic pricing to align discounts with seasonal or demand-based trends.",
    "💡 Use sentiment analysis of reviews to identify product improvement opportunities.",
    "🚀 Promote underperforming products through combo deals or social media influencer campaigns.",
    "🤝 Introduce loyalty rewards or early-access benefits to improve long-term customer retention."
  ]

  // 👇 Show nothing before Analyze is clicked
  if (!isAnalyzed) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Strategies</h2>
        <div className="text-slate-500 text-sm">Upload your dataset and click “Analyze” to view strategies.</div>
      </div>
    )
  }

  // If no dynamic strategies, show the defaults
  const activeStrategies = strategies?.length ? strategies : defaultStrategies

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Strategies</h2>
        <button
          onClick={downloadPDF}
          disabled={!activeStrategies && !summary}
          className="px-3 py-2 rounded-md bg-primary-600 text-white disabled:opacity-50"
        >
          Download PDF
        </button>
      </div>

      <div ref={pdfRef} className="space-y-4">
        {summary && (
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600">Executive Summary</div>
            <div className="mt-1">{summary}</div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm text-slate-600 mb-2">Top 5 Business Strategies</div>
          <ol className="list-decimal list-inside space-y-1">
            {activeStrategies.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
