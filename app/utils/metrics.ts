export const calculateMetrics = (confusionMatrix: number[][], labels: string[]) => {
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

export const generateRandomFeatures = (features: string[]): Record<string, number> => {
  return features.reduce((acc, feature) => {
    acc[feature] = Math.random()
    return acc
  }, {} as Record<string, number>)
} 