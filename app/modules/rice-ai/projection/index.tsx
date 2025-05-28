"use client"

import { useState } from "react"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { fetchProjectionData } from "../../../services/api"
import { ProjectionResponse } from "../../../types/rice-classification"
import { RICE_COLORS } from "../../../constants/rice-classification"

export default function ProjectionTab() {
  const [projectionMethod, setProjectionMethod] = useState<string>("pca")
  const [projectionData, setProjectionData] = useState<ProjectionResponse[] | null>(null)
  const [projectionLoading, setProjectionLoading] = useState<boolean>(false)
  const [projectionError, setProjectionError] = useState<string | null>(null)

  const handleFetchProjection = async () => {
    setProjectionLoading(true)
    setProjectionError(null)

    try {
      const data = await fetchProjectionData(projectionMethod)
      setProjectionData(data)
    } catch (err) {
      setProjectionError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setProjectionLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Rice Variety Projection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Visualize high-dimensional rice data in 2D space using advanced dimensionality reduction techniques
          </p>
        </div>

        {/* Method Selection and Info Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Method Selection Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Configuration
              </h2>
              <p className="text-blue-100 mt-1">Select reduction method</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Dimensionality Reduction Method</label>
                <div className="space-y-2">
                  {[
                    { value: "pca", label: "PCA", desc: "Linear reduction preserving variance" },
                    { value: "tsne", label: "t-SNE", desc: "Non-linear reduction preserving local structure" },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        projectionMethod === method.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="projectionMethod"
                        value={method.value}
                        checked={projectionMethod === method.value}
                        onChange={(e) => setProjectionMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{method.label}</div>
                        <div className="text-sm text-gray-500">{method.desc}</div>
                      </div>
                      {projectionMethod === method.value && (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleFetchProjection}
                disabled={projectionLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {projectionLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Generate Projection
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Method Info Cards */}
          <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
                <h3 className="font-semibold text-white">Principal Component Analysis</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Linear dimensionality reduction
                </div>
                <p className="text-sm text-gray-700">
                  Preserves global variance structure and is computationally efficient. Best for understanding overall
                  data distribution.
                </p>
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Fast & Interpretable
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3">
                <h3 className="font-semibold text-white">t-Distributed Stochastic Neighbor Embedding</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Non-linear dimensionality reduction
                </div>
                <p className="text-sm text-gray-700">
                  Preserves local neighborhood structure and reveals clusters. Better for discovering hidden patterns
                  and groupings.
                </p>
                <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Reveals Clusters
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {projectionError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-700 font-medium">{projectionError}</span>
          </div>
        )}

        {/* Visualization */}
        {projectionData && (
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Statistics Panel */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-3">
                  <h3 className="font-semibold text-white">Data Statistics</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{projectionData.length}</div>
                    <div className="text-sm text-gray-600">Total Samples</div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-800 text-sm">Rice Varieties</h4>
                    {Object.entries(RICE_COLORS).map(([variety, color]) => {
                      const count = projectionData.filter((p) => p.label === variety).length
                      const percentage = ((count / projectionData.length) * 100).toFixed(1)
                      return (
                        <div key={variety} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                            <span className="text-sm text-gray-700">{variety}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {count} ({percentage}%)
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3">
                  <h3 className="font-semibold text-white">Method Info</h3>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium text-gray-800">{projectionMethod.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="font-medium text-gray-800">2D</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Features:</span>
                    <span className="font-medium text-gray-800">All</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Visualization */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  2D Projection Visualization
                </h2>
                <p className="text-blue-100 mt-1">
                  {projectionMethod.toUpperCase()} projection of rice varieties in two-dimensional space
                </p>
              </div>
              <div className="p-6">
                <div className="h-[600px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="Component 1"
                        tick={{ fontSize: 12, fill: "#666" }}
                        tickLine={false}
                        axisLine={false}
                        label={{
                          value: "Component 1",
                          position: "insideBottom",
                          offset: -10,
                          style: { textAnchor: "middle", fill: "#666" },
                        }}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        name="Component 2"
                        tick={{ fontSize: 12, fill: "#666" }}
                        tickLine={false}
                        axisLine={false}
                        label={{
                          value: "Component 2",
                          angle: -90,
                          position: "insideLeft",
                          style: { textAnchor: "middle", fill: "#666" },
                        }}
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value, name) => [typeof value === "number" ? value.toFixed(3) : value, name]}
                        labelFormatter={(label) => `Rice Variety: ${label}`}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ paddingTop: "20px" }}
                      />
                      {Object.keys(RICE_COLORS).map((riceType) => (
                        <Scatter
                          key={riceType}
                          name={riceType}
                          data={projectionData.filter((point) => point.label === riceType)}
                          fill={RICE_COLORS[riceType as keyof typeof RICE_COLORS]}
                          fillOpacity={0.8}
                          strokeWidth={1}
                          stroke="#fff"
                        />
                      ))}
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
