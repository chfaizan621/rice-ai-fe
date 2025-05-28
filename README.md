# Rice Classification Frontend

This is a Next.js frontend application for rice variety classification using machine learning models. The application provides three main features:
- Rice Variety Prediction using multiple features
- Data Visualization with PCA and t-SNE projections
- Model Performance Analysis with detailed metrics

## Prerequisites

Before running this project, make sure you have:
- Node.js 18+ installed
- The backend server running on http://localhost:8000
- Python backend environment set up with required ML models

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd rice-ai-fe
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Make sure the backend server is running on http://localhost:8000

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Features

### 1. Prediction Interface
- Input 88 rice grain features
- Support for multiple ML models (KNN, SVM, Naive Bayes)
- Real-time prediction with confidence scores
- Feature randomization for testing

### 2. Projection Analysis
- PCA and t-SNE visualization
- Interactive 2D scatter plots
- Color-coded rice varieties
- Real-time data updates

### 3. Metrics Dashboard
- Model performance analysis
- Confusion matrix visualization
- Class-wise metrics (Precision, Recall, F1-Score)
- Overall accuracy statistics

## Project Structure

```
my-app/
├── app/
│   ├── components/     # Reusable UI components
│   ├── modules/        # Main feature modules
│   ├── services/       # API services
│   ├── types/         # TypeScript interfaces
│   ├── constants/     # Shared constants
│   └── utils/         # Utility functions
```

## API Integration

The frontend communicates with the following backend endpoints:
- POST /predict - Rice variety prediction
- GET /projection - Dimensionality reduction data
- GET /metrics - Model performance metrics

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Recharts for data visualization
- React Hooks for state management

## Development

To modify the application:
1. Feature groups and model options are in `constants/rice-classification.ts`
2. API endpoints are configured in `services/api.ts`
3. Type definitions are in `types/rice-classification.ts`
4. Utility functions are in `utils/metrics.ts`
