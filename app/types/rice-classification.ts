export interface PredictionResponse {
  predicted_class: string
  probabilities: {
    [key: string]: number
  }
}

export interface PredictAllResponse {
  knn: PredictionResponse
  svm: PredictionResponse
  nb: PredictionResponse
}

export interface ProjectionResponse {
  x: number
  y: number
  label: string
}

export interface MetricsResponse {
  accuracy: number
  confusion_matrix: number[][]
  labels: string[]
}

export interface RiceFeatureGroups {
  [key: string]: string[]
}

export interface ModelOption {
  value: string
  label: string
}

export interface RiceColors {
  [key: string]: string
} 