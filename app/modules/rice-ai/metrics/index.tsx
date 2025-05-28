"use client"

import { useState } from "react"
import { fetchMetricsData } from "../../../services/api"
import { MetricsResponse } from "../../../types/rice-classification"
import { MODEL_OPTIONS } from "../../../constants/rice-classification"

export default function MetricsTab() {
  const [metricsModel, setMetricsModel] = useState<string>("knn")
  const [metricsData, setMetricsData] = useState<MetricsResponse | null>(null)
  const [metricsLoading, setMetricsLoading] = useState<boolean>(false)
  const [metricsError, setMetricsError] = useState<string | null>(null)

  const handleFetchMetrics = async () => {
    setMetricsLoading(true)
    setMetricsError(null)

    try {
      const data = await fetchMetricsData(metricsModel)
      setMetricsData(data)
    } catch (err) {
      setMetricsError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setMetricsLoading(false)
    }
  }

  const calculateMetrics = (confusionMatrix: number[][], labels: string[]) => {
    return labels.map((label, index) => {
      const truePositive = confusionMatrix[index][index]
      const falsePositive = confusionMatrix.reduce((sum, row, i) => (i !== index ? sum + row[index] : sum), 0)
      const falseNegative = confusionMatrix[index].reduce((sum, cell, j) => (j !== index ? sum + cell : sum), 0)

      const precision = truePositive / (truePositive + falsePositive) || 0
      const recall = truePositive / (truePositive + falseNegative) || 0
      const f1Score = (2 * precision * recall) / (precision + recall) || 0

      return {
        label,
        precision: precision.toFixed(3),
        recall: recall.toFixed(3),
        f1Score: f1Score.toFixed(3),
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Model Performance Metrics
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive performance analysis and evaluation metrics for rice classification models
          </p>
        </div>

        {/* Model Selection */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-4">
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
              Model Evaluation
            </h2>
            <p className="text-emerald-100 mt-1">Select a model to analyze its performance metrics</p>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Machine Learning Model</label>
                <select
                  value={metricsModel}
                  onChange={(e) => setMetricsModel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900"
                >
                  {MODEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleFetchMetrics}
                disabled={metricsLoading}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                {metricsLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Analyze Performance
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {metricsError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-700 font-medium">{metricsError}</span>
          </div>
        )}

        {/* Metrics Dashboard */}
        {metricsData && (
          <div className="space-y-8">
            {/* Overall Performance Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="font-semibold text-white">Overall Accuracy</h3>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">
                    {(metricsData.accuracy * 100).toFixed(2)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${metricsData.accuracy * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {calculateMetrics(metricsData.confusion_matrix, metricsData.labels)
                .slice(0, 3)
                .map((metric, index) => (
                  <div
                    key={metric.label}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <div
                      className={`bg-gradient-to-r px-4 py-3 ${
                        index === 0
                          ? "from-blue-500 to-blue-600"
                          : index === 1
                            ? "from-purple-500 to-purple-600"
                            : "from-orange-500 to-orange-600"
                      }`}
                    >
                      <h3 className="font-semibold text-white">{metric.label}</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">F1 Score</span>
                        <span className="font-semibold text-gray-800">{metric.f1Score}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            index === 0 ? "bg-blue-500" : index === 1 ? "bg-purple-500" : "bg-orange-500"
                          }`}
                          style={{ width: `${Number.parseFloat(metric.f1Score) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Detailed Metrics and Confusion Matrix */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Class-wise Performance */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
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
                    Class-wise Performance
                  </h2>
                  <p className="text-blue-100 mt-1">Detailed metrics for each rice variety</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {calculateMetrics(metricsData.confusion_matrix, metricsData.labels).map((metric, index) => (
                      <div key={metric.label} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-800">{metric.label}</h4>
                          <span className="text-sm text-gray-500">F1: {metric.f1Score}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Precision</span>
                              <span className="font-medium text-gray-600">
                                {(Number.parseFloat(metric.precision) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${Number.parseFloat(metric.precision) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Recall</span>
                              <span className="font-medium text-gray-600">
                                {(Number.parseFloat(metric.recall) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${Number.parseFloat(metric.recall) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">F1 Score</span>
                              <span className="font-medium text-gray-600">
                                {(Number.parseFloat(metric.f1Score) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${Number.parseFloat(metric.f1Score) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {index < calculateMetrics(metricsData.confusion_matrix, metricsData.labels).length - 1 && (
                          <div className="border-b border-gray-200"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Confusion Matrix */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                      />
                    </svg>
                    Confusion Matrix
                  </h2>
                  <p className="text-emerald-100 mt-1">Predicted vs Actual Classifications</p>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <div className="mb-4 text-center">
                      <div className="text-sm text-gray-600 mb-2">Predicted →</div>
                      <div className="text-xs text-gray-500">Actual ↓</div>
                    </div>

                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-700 border-r border-gray-200">
                            Actual \ Predicted
                          </th>
                          {metricsData.labels.map((label) => (
                            <th
                              key={label}
                              className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
                            >
                              {label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {metricsData.confusion_matrix.map((row: number[], i: number) => (
                          <tr key={i} className="border-t border-gray-200">
                            <th className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-left border-r border-gray-200">
                              {metricsData.labels[i]}
                            </th>
                            {row.map((cell: number, j: number) => {
                              const maxValue = Math.max(...metricsData.confusion_matrix.flat())
                              const intensity = cell / maxValue
                              const isCorrect = i === j
                              return (
                                <td
                                  key={j}
                                  className="px-3 py-2 text-xs text-center border-r border-gray-200 last:border-r-0 relative group cursor-pointer transition-all duration-200 hover:scale-105"
                                  style={{
                                    backgroundColor: isCorrect
                                      ? `rgba(34, 197, 94, ${0.2 + intensity * 0.8})`
                                      : `rgba(239, 68, 68, ${intensity * 0.6})`,
                                    color: intensity > 0.5 ? "white" : "#374151",
                                    fontWeight: isCorrect ? "bold" : "normal",
                                  }}
                                >
                                  {cell}
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                    {isCorrect ? "Correct" : "Misclassified"}: {cell} samples
                                  </div>
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Correct Predictions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Misclassifications</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
