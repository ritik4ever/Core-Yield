"use client"

import { useState } from "react"
import { Dashboard } from "@/components/dashboard"
import { Header } from "@/components/header"
import { BackgroundPattern } from "@/components/background-pattern"
import { LiquidityManagement } from "@/components/liquidity-management"
import { StrategiesDashboard } from "@/components/strategies-dashboard"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { SwapInterface } from "@/components/swap-interface"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("Dashboard")

  const handleNavigation = (page: string) => {
    setCurrentPage(page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "Dashboard":
        return <Dashboard />
      case "Swap":
        return <SwapInterface />
      case "Liquidity":
        return <LiquidityManagement />
      case "Strategies":
        return <StrategiesDashboard />
      case "Analytics":
        return <AnalyticsDashboard />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <BackgroundPattern />
      <Header onNavigate={handleNavigation} />
      <main className="relative z-10 py-8 px-4">{renderPage()}</main>
    </div>
  )
}
