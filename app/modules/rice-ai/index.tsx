"use client"

import { useState } from "react"
import PredictionTab from "./predict"
import ProjectionTab from "./projection"
import MetricsTab from "./metrics"
import Navbar from "@/app/components/navbar"

export default function RiceClassification() {
  const [activeTab, setActiveTab] = useState<string>("prediction")

  const renderActiveTab = () => {
    switch (activeTab) {
      case "prediction":
        return <PredictionTab />
      case "projection":
        return <ProjectionTab />
      case "metrics":
        return <MetricsTab />
      default:
        return <PredictionTab />
    }
  }

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderActiveTab()}
    </>
  )
}
