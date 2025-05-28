import { PredictionResponse, ProjectionResponse, MetricsResponse } from '../types/rice-classification'

const API_BASE_URL = 'http://localhost:8000'

export const predictRiceVariety = async (formData: Record<string, number>, modelName: string): Promise<PredictionResponse> => {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ features: formData, model_name: modelName }),
  })

  if (!response.ok) {
    throw new Error('Failed to predict rice variety')
  }

  return response.json()
}

export const fetchProjectionData = async (method: string): Promise<ProjectionResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/projection?method=${method}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch projection data')
  }

  return response.json()
}

export const fetchMetricsData = async (modelName: string): Promise<MetricsResponse> => {
  const response = await fetch(`${API_BASE_URL}/metrics/${modelName}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch metrics data')
  }

  return response.json()
} 