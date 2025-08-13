"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Wallet,
  DollarSign,
  Shield,
  Zap,
  BarChart3,
  PieChart,
  RefreshCw,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react"

export function Dashboard() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isCompounding, setIsCompounding] = useState(false)
  const [autoCompoundEnabled, setAutoCompoundEnabled] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [realTimeData, setRealTimeData] = useState({
    totalBalance: 2.45,
    yieldEarned: 0.127,
    apy: 18.5,
    monthlyChange: 12.5,
    weeklyChange: 8.2,
  })
  const [currentTime, setCurrentTime] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Set initial time after mount to prevent hydration mismatch
    const timer = setTimeout(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 100)

    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        totalBalance: prev.totalBalance + (Math.random() - 0.5) * 0.0005,
        yieldEarned: prev.yieldEarned + Math.random() * 0.00005,
        apy: prev.apy + (Math.random() - 0.5) * 0.05,
      }))
      setCurrentTime(new Date().toLocaleTimeString())
    }, 30000) // Reduced frequency to prevent too many updates

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  const handleOptimize = async () => {
    setIsOptimizing(true)
    setOptimizationProgress(0)

    const progressInterval = setInterval(() => {
      setOptimizationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 10 + Math.random() * 5
      })
    }, 200)

    setTimeout(() => {
      setIsOptimizing(false)
      setOptimizationProgress(0)
      setRealTimeData((prev) => ({
        ...prev,
        apy: prev.apy + Math.random() * 1,
        totalBalance: prev.totalBalance * 1.0005,
      }))
    }, 3000)
  }

  const handleCompound = async () => {
    setIsCompounding(true)

    setTimeout(() => {
      setIsCompounding(false)
      setAutoCompoundEnabled(!autoCompoundEnabled)
      if (!autoCompoundEnabled) {
        setRealTimeData((prev) => ({
          ...prev,
          yieldEarned: prev.yieldEarned * 1.01,
        }))
      }
    }, 2000)
  }

  const handleViewStrategies = () => {
    console.log("Navigating to strategies...")
  }

  if (!mounted) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 space-y-6">
        <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-3">Welcome to Core Yield Protocol</h1>
          <p className="text-lg text-slate-300 mb-3">
            Optimize your Bitcoin holdings with advanced yield farming strategies on Core blockchain
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400">Core Network</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 space-y-6">
      {/* Welcome Section - More compact */}
      <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-3">Welcome to Core Yield Protocol</h1>
        <p className="text-lg text-slate-300 mb-3">
          Optimize your Bitcoin holdings with advanced yield farming strategies on Core blockchain
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400">Core Network Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400">Last updated: {currentTime || "Loading..."}</span>
          </div>
        </div>
      </div>

      {/* Metrics Cards - Better responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-white">{realTimeData.totalBalance.toFixed(3)} BTC</div>
            <div className="flex items-center space-x-1 text-sm">
              <ArrowUpRight className="h-3 w-3 text-green-400" />
              <span className="text-green-400">+{realTimeData.monthlyChange.toFixed(1)}% from last month</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">≈ ${(realTimeData.totalBalance * 45000).toLocaleString()}</div>
          </CardContent>
        </Card>

        {/* Total Yield Earned */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Yield Earned</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-white">{realTimeData.yieldEarned.toFixed(4)} BTC</div>
            <div className="flex items-center space-x-1 text-sm">
              <ArrowUpRight className="h-3 w-3 text-green-400" />
              <span className="text-green-400">+{realTimeData.weeklyChange.toFixed(1)}% this week</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">≈ ${(realTimeData.yieldEarned * 45000).toLocaleString()}</div>
          </CardContent>
        </Card>

        {/* Current APY */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Current APY</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-white">{realTimeData.apy.toFixed(1)}%</div>
            <p className="text-sm text-slate-400">Optimized across 3 strategies</p>
            <div className="mt-2">
              <Progress value={75} className="h-1" />
              <div className="text-xs text-slate-500 mt-1">75% of max potential</div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Level */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Risk Level</CardTitle>
            <Shield className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-2">Low Risk</Badge>
            <p className="text-sm text-slate-400 mb-2">Conservative strategy active</p>
            <div className="flex items-center space-x-2 text-xs">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-green-400">Diversified across 5 pools</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - More compact */}
      <div className="space-y-4">
        <h2 className="text-xl lg:text-2xl font-bold text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Optimize Portfolio */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-red-500/30 transition-all duration-200 cursor-pointer group shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                  <RefreshCw className={`w-5 h-5 text-red-400 ${isOptimizing ? "animate-spin" : ""}`} />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Optimize Portfolio</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-slate-300 mb-3 text-sm">
                Rebalance your holdings for maximum yield
              </CardDescription>
              {isOptimizing && (
                <div className="mb-3">
                  <Progress value={optimizationProgress} className="h-2" />
                  <div className="text-xs text-slate-400 mt-1">Optimizing... {Math.round(optimizationProgress)}%</div>
                </div>
              )}
              <Button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50 py-2"
                variant="outline"
              >
                {isOptimizing ? "Optimizing..." : "Optimize Now"}
              </Button>
            </CardContent>
          </Card>

          {/* View Strategies */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-blue-500/30 transition-all duration-200 cursor-pointer group shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <PieChart className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">View Strategies</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-slate-300 mb-3 text-sm">
                Explore available yield farming options
              </CardDescription>
              <div className="space-y-1 mb-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Strategies:</span>
                  <span className="text-white">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Best Performing:</span>
                  <span className="text-green-400">Core Staking (22.1%)</span>
                </div>
              </div>
              <Button
                onClick={handleViewStrategies}
                className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 hover:border-blue-500/50 py-2"
                variant="outline"
              >
                View All Strategies
              </Button>
            </CardContent>
          </Card>

          {/* Auto-Compound */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-green-500/30 transition-all duration-200 cursor-pointer group shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <Zap className={`w-5 h-5 text-green-400 ${isCompounding ? "animate-pulse" : ""}`} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-white text-lg">Auto-Compound</CardTitle>
                  {autoCompoundEnabled && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs mt-1">Active</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-slate-300 mb-3 text-sm">
                {autoCompoundEnabled ? "Automatic compounding is active" : "Enable automatic yield compounding"}
              </CardDescription>
              {autoCompoundEnabled && (
                <div className="space-y-1 mb-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Next Compound:</span>
                    <span className="text-white">2h 34m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Compound Rate:</span>
                    <span className="text-green-400">Every 6 hours</span>
                  </div>
                </div>
              )}
              <Button
                onClick={handleCompound}
                disabled={isCompounding}
                className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 hover:border-green-500/50 py-2"
                variant="outline"
              >
                {isCompounding
                  ? "Processing..."
                  : autoCompoundEnabled
                    ? "Disable Auto-Compound"
                    : "Enable Auto-Compound"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
