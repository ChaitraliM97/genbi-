import React, { useMemo, useState } from 'react'
import UploadCard from './components/UploadCard'
import ChartsPanel from './components/ChartsPanel'
import InsightsPanel from './components/InsightsPanel'
import StrategiesPanel from './components/StrategiesPanel'
import Sidebar from './components/Sidebar'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [isAnalyzed, setIsAnalyzed] = useState(false)

  const handleResult = (result) => {
    setData(result)
  }

  const sections = useMemo(() => ([
    { id: 'upload', label: 'Upload' },
    { id: 'eda', label: 'EDA & Charts' },
    { id: 'insights', label: 'Business Insights' },
    { id: 'strategies', label: 'Strategies' },
  ]), [])

  return (
    <div className="min-h-screen flex">
      <Sidebar sections={sections} />
      <main className="flex-1 p-6 md:p-10 space-y-6">
        <header className="max-w-5xl">
          <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Upload your dataset to unlock instant business insights
          </h1>
          <p className="text-slate-600 mt-2">
            CSV or Excel. We'll clean, analyze, visualize, and summarize.
          </p>
        </header>

        {/* Upload Section */}
        <section id="upload" className="max-w-5xl space-y-4">
          <UploadCard
            loading={loading}
            setLoading={setLoading}
            onResult={handleResult}
            onError={setError}
          />
          {error && <p className="text-red-600 mt-2">{error}</p>}

          {/* Analyze Button */}
          <button
            onClick={() => setIsAnalyzed(true)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            Analyze Data
          </button>
        </section>

        {/* EDA Charts */}
        <section id="eda" className="max-w-6xl">
          <ChartsPanel
            loading={loading}
            charts={data?.charts}
            plotlyCharts={data?.plotlyCharts}
            stats={data?.stats}
          />
        </section>

        {/* Show Insights & Strategies only after Analyze */}
        {isAnalyzed && (
          <>
            <section id="insights" className="max-w-5xl animate-fadeIn">
              <InsightsPanel
                insights={data?.insights}
                summary={data?.report_summary}
                isAnalyzed={isAnalyzed}
              />
            </section>

            <section id="strategies" className="max-w-5xl animate-fadeIn">
              <StrategiesPanel
                strategies={data?.strategies}
                summary={data?.report_summary}
                isAnalyzed={isAnalyzed}
              />
            </section>
          </>
        )}
      </main>
    </div>
  )
}
