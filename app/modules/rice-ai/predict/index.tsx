"use client"

import type React from "react"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { predictRiceVariety } from "../../../services/api"
import { PredictionResponse, PredictAllResponse } from "../../../types/rice-classification"
import { FEATURE_GROUPS, MODEL_OPTIONS, RICE_COLORS } from "../../../constants/rice-classification"
import { generateRandomFeatures } from "../../../utils/metrics"

export default function PredictionTab() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictAllResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<{ [key: string]: number }>(() => {
    const initialData: { [key: string]: number } = {}
    Object.values(FEATURE_GROUPS)
      .flat()
      .forEach((feature) => {
        initialData[feature] = 0
      })
    return initialData
  })

  const handleInputChange = (feature: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [feature]: Number.parseFloat(value) || 0,
    }))
  }

  const randomizeValues = () => {
    const features = Object.values(FEATURE_GROUPS).flat()
    setFormData(generateRandomFeatures(features))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await predictRiceVariety(formData)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Rice Classification System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Advanced machine learning models for accurate rice variety classification based on morphological and color
            features
          </p>
        </div>

        {/* Randomize Button */}
        <div className="bg-transparent rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={randomizeValues}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Randomize Values
              </button>
            </div>
          </div>
        </div>

        {/* Feature Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            {Object.entries(FEATURE_GROUPS).map(([groupName, features]) => (
              <div key={groupName} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-black">{groupName} Features</h3>
                      <p className="text-sm text-black">
                        {features.length} parameters for {groupName.toLowerCase()} analysis
                      </p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 rounded-full">
                      {features.length} fields
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {features.map((feature) => (
                      <div key={feature} className="space-y-2">
                        <label className="block text-xs font-medium text-black uppercase tracking-wide">
                          {feature}
                        </label>
                        <input
                          type="number"
                          step="0.001"
                          value={formData[feature]}
                          onChange={(e) => handleInputChange(feature, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm text-black"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center gap-3 text-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Predict Rice Variety
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="grid gap-6">
            {Object.entries(result).map(([modelName, modelResult]) => (
              <div key={modelName} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    {MODEL_OPTIONS.find((m) => m.value === modelName)?.label || modelName.toUpperCase()} Results
                  </h2>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Prediction Summary */}
                  <div className="space-y-6">
                    <div className="text-center space-y-3">
                      <p className="text-sm text-black uppercase tracking-wide">Predicted Rice Variety</p>
                      <div className="text-4xl font-bold text-emerald-600">{modelResult.predicted_class}</div>
                      <div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                        Confidence: {(Math.max(...Object.values(modelResult.probabilities).map(v => v as number)) * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-semibold text-black mb-4">Class Probabilities</h4>
                      <div className="space-y-3">
                        {Object.entries(modelResult.probabilities)
                          .sort(([, a], [, b]) => (b as number) - (a as number))
                          .map(([className, prob]) => (
                            <div key={className} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span
                                  className={`font-medium ${
                                    className === modelResult.predicted_class ? "text-emerald-600" : "text-gray-700"
                                  }`}
                                >
                                  {className}
                                </span>
                                <span className="text-gray-600">{((prob as number) * 100).toFixed(1)}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-700 ${
                                    className === modelResult.predicted_class ? "bg-emerald-500" : "bg-gray-400"
                                  }`}
                                  style={{ width: `${(prob as number) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="space-y-8">
                    {/* Bar Chart */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-black">Bar Chart</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={Object.entries(modelResult.probabilities).map(([name, value]) => ({
                              name,
                              value: (value as number) * 100,
                              fill: name === modelResult.predicted_class ? "#10b981" : "#6b7280",
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#666" }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: "#666" }} tickLine={false} axisLine={false} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              }}
                              formatter={(value: any) => [`${value}%`, "Probability"]}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-black">Distribution Chart</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={Object.entries(modelResult.probabilities).map(([name, value], index) => ({
                                name,
                                value: (value as number) * 100,
                                fill: Object.values(RICE_COLORS)[index % Object.values(RICE_COLORS).length],
                              }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {Object.entries(modelResult.probabilities).map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={Object.values(RICE_COLORS)[index % Object.values(RICE_COLORS).length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              }}
                              formatter={(value: any, name: any) => [`${value.toFixed(1)}%`, name]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
