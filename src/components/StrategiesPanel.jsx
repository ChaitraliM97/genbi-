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
      let position = 0
      while (position < imgHeight) {
        pdf.addImage(imgData, 'PNG', 10, 10 - position, pageWidth - 20, imgHeight)
        position += pageHeight - 20
        if (position < imgHeight) pdf.addPage()
      }
    }
    pdf.save('business-report.pdf')
  }

  // Default strategies to show only after Analyze
  const defaultSummary =
    "Based on product insights, key opportunities have been identified to enhance customer satisfaction, strengthen sales performance, and optimize pricing impact."

  const defaultStrategies = [
    "🎯 Focus marketing on high-rated (⭐ 4.5+) and high-selling products to boost trust and conversion.",
    "📊 Implement dynamic pricing to align discounts with seasonal or demand-based trends.",
    "💡 Use sentiment analysis of reviews to identify product improvement opportunities.",
    "🚀 Promote underperforming products through combo deals or social media influencer campaigns.",
    "🤝 Introduce loyalty rewards or early-access benefits to improve long-term customer retention."
  ]

  // Show only after user clicks “Analyze”
  if (!isAnalyzed) {
    return null
  }

  const activeSummary = summary || defaultSummary
  const activeStrategies = strategies?.length ? strategies : defaultStrategies

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Business Strategies</h2>
        <button
          onClick={downloadPDF}
          disabled={!activeStrategies && !activeSummary}
          className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
        >
          Download PDF
        </button>
      </div>

      <div ref={pdfRef} className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-sm text-slate-600">Executive Summary</div>
          <div className="mt-1 text-slate-800 leading-relaxed">{activeSummary}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-sm text-slate-600 mb-2">Top Actionable Strategies</div>
          <ol className="list-decimal list-inside space-y-2 text-slate-800">
            {activeStrategies.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
