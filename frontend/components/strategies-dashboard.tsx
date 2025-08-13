"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Shield,
  Zap,
  Target,
  DollarSign,
  Settings,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface Strategy {
  id: string
  name: string
  description: string
  type: "conservative" | "moderate" | "aggressive"
  apy: string
  tvl: string
  risk: "Low" | "Medium" | "High"
  status: "active" | "paused" | "inactive"
  allocation: string
  returns24h: string
  returns7d: string
  returns30d: string
  isPositive24h: boolean
  isPositive7d: boolean
  isPositive30d: boolean
  protocols: string[]
  minDeposit: string
  lockPeriod: string
  autoCompound: boolean
}

const mockStrategies: Strategy[] = [
  {
    id: "1",
    name: "Core Stable Yield",
    description: "Conservative strategy focusing on stable yields through blue-chip DeFi protocols",
    type: "conservative",
    apy: "12.5%",
    tvl: "$2,450,000",
    risk: "Low",
    status: "active",
    allocation: "$5,240",
    returns24h: "+$12.45",
    returns7d: "+$89.32",
    returns30d: "+$342.18",
    isPositive24h: true,
    isPositive7d: true,
    isPositive30d: true,
    protocols: ["Compound", "Aave", "Curve"],
    minDeposit: "$100",
    lockPeriod: "None",
    autoCompound: true,
  },
  {
    id: "2",
    name: "Balanced Growth",
    description: "Moderate risk strategy balancing yield farming and liquidity provision",
    type: "moderate",
    apy: "24.8%",
    tvl: "$1,850,000",
    risk: "Medium",
    status: "active",
    allocation: "$2,100",
    returns24h: "+$8.92",
    returns7d: "+$156.78",
    returns30d: "+$489.45",
    isPositive24h: true,
    isPositive7d: true,
    isPositive30d: true,
    protocols: ["Uniswap", "SushiSwap", "Yearn"],
    minDeposit: "$500",
    lockPeriod: "7 days",
    autoCompound: true,
  },
  {
    id: "3",
    name: "High Yield Farming",
    description: "Aggressive strategy targeting maximum yields through emerging protocols",
    type: "aggressive",
    apy: "45.2%",
    tvl: "$890,000",
    risk: "High",
    status: "paused",
    allocation: "$0",
    returns24h: "-$2.34",
    returns7d: "+$45.67",
    returns30d: "+$234.89",
    isPositive24h: false,
    isPositive7d: true,
    isPositive30d: true,
    protocols: ["PancakeSwap", "TraderJoe", "Convex"],
    minDeposit: "$1,000",
    lockPeriod: "30 days",
    autoCompound: false,
  },
  {
    id: "4",
    name: "BTC Yield Optimizer",
    description: "Bitcoin-focused strategy maximizing yields on wrapped BTC",
    type: "moderate",
    apy: "18.7%",
    tvl: "$3,200,000",
    risk: "Medium",
    status: "inactive",
    allocation: "$0",
    returns24h: "+$0.00",
    returns7d: "+$0.00",
    returns30d: "+$0.00",
    isPositive24h: true,
    isPositive7d: true,
    isPositive30d: true,
    protocols: ["Badger", "Convex", "Curve"],
    minDeposit: "$250",
    lockPeriod: "14 days",
    autoCompound: true,
  },
]

export function StrategiesDashboard() {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)
  const [depositAmount, setDepositAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleStrategyAction = async (action: "deposit" | "withdraw" | "activate" | "pause") => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log(`${action} action:`, { strategy: selectedStrategy?.id, amount: depositAmount })

    setIsLoading(false)
    setDepositAmount("")
  }

  const totalAllocated = mockStrategies.reduce((sum, strategy) => {
    return sum + Number.parseFloat(strategy.allocation.replace("$", "").replace(",", ""))
  }, 0)

  const totalReturns30d = mockStrategies.reduce((sum, strategy) => {
    return sum + Number.parseFloat(strategy.returns30d.replace("+$", "").replace("-$", "").replace(",", ""))
  }, 0)

  const activeStrategies = mockStrategies.filter((s) => s.status === "active").length

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-400 bg-green-500/20 border-green-500/30"
      case "Medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
      case "High":
        return "text-red-400 bg-red-500/20 border-red-500/30"
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-500/20 border-green-500/30"
      case "paused":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
      case "inactive":
        return "text-slate-400 bg-slate-500/20 border-slate-500/30"
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500/30"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "conservative":
        return <Shield className="w-4 h-4" />
      case "moderate":
        return <Target className="w-4 h-4" />
      case "aggressive":
        return <Zap className="w-4 h-4" />
      default:
        return <PieChart className="w-4 h-4" />
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Yield Strategies</h1>
            <p className="text-xl text-slate-300">Explore and manage your yield farming strategies</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <span className="text-slate-400 text-sm">Total Allocated</span>
              </div>
              <div className="text-2xl font-bold text-white">${totalAllocated.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-slate-400 text-sm">30d Returns</span>
              </div>
              <div className="text-2xl font-bold text-green-400">+${totalReturns30d.toFixed(2)}</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-purple-400" />
                <span className="text-slate-400 text-sm">Active Strategies</span>
              </div>
              <div className="text-2xl font-bold text-white">{activeStrategies}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Strategies List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Available Strategies</h2>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              <Settings className="w-4 h-4 mr-2" />
              Create Strategy
            </Button>
          </div>

          <div className="space-y-4">
            {mockStrategies.map((strategy) => (
              <Card
                key={strategy.id}
                className={`bg-slate-900/50 border-slate-700/50 backdrop-blur-xl hover:bg-slate-800/50 transition-all duration-200 cursor-pointer ${
                  selectedStrategy?.id === strategy.id ? "ring-2 ring-blue-500/50" : ""
                }`}
                onClick={() => setSelectedStrategy(strategy)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        {getTypeIcon(strategy.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{strategy.name}</h3>
                          <Badge className={getRiskColor(strategy.risk)}>{strategy.risk} Risk</Badge>
                          <Badge className={getStatusColor(strategy.status)}>
                            {strategy.status === "active" && <CheckCircle className="w-3 h-3 mr-1" />}
                            {strategy.status === "paused" && <Pause className="w-3 h-3 mr-1" />}
                            {strategy.status === "inactive" && <Clock className="w-3 h-3 mr-1" />}
                            {strategy.status.charAt(0).toUpperCase() + strategy.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{strategy.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {strategy.protocols.map((protocol) => (
                            <Badge key={protocol} variant="outline" className="text-xs border-slate-600 text-slate-300">
                              {protocol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:min-w-[400px]">
                      <div>
                        <div className="text-slate-400 text-sm">APY</div>
                        <div className="text-green-400 font-semibold flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {strategy.apy}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">TVL</div>
                        <div className="text-white font-semibold">{strategy.tvl}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">My Allocation</div>
                        <div className="text-white font-semibold">{strategy.allocation}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">30d Returns</div>
                        <div
                          className={`font-semibold flex items-center ${
                            strategy.isPositive30d ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {strategy.isPositive30d ? (
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 mr-1" />
                          )}
                          {strategy.returns30d}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Chart */}
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">24h</span>
                        <span className={strategy.isPositive24h ? "text-green-400" : "text-red-400"}>
                          {strategy.returns24h}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">7d</span>
                        <span className={strategy.isPositive7d ? "text-green-400" : "text-red-400"}>
                          {strategy.returns7d}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">30d</span>
                        <span className={strategy.isPositive30d ? "text-green-400" : "text-red-400"}>
                          {strategy.returns30d}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Strategy Details Panel */}
        <div className="space-y-6">
          {selectedStrategy ? (
            <>
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      {getTypeIcon(selectedStrategy.type)}
                    </div>
                    <span className="text-white">{selectedStrategy.name}</span>
                  </CardTitle>
                  <CardDescription>{selectedStrategy.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Min Deposit</span>
                      <div className="text-white font-semibold">{selectedStrategy.minDeposit}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Lock Period</span>
                      <div className="text-white font-semibold">{selectedStrategy.lockPeriod}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Auto Compound</span>
                      <div
                        className={`font-semibold ${selectedStrategy.autoCompound ? "text-green-400" : "text-red-400"}`}
                      >
                        {selectedStrategy.autoCompound ? "Enabled" : "Disabled"}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Status</span>
                      <Badge className={getStatusColor(selectedStrategy.status)}>
                        {selectedStrategy.status.charAt(0).toUpperCase() + selectedStrategy.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {selectedStrategy.status === "active" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Allocation Progress</span>
                        <span className="text-white text-sm">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {selectedStrategy.status === "inactive" ? (
                      <Button
                        onClick={() => handleStrategyAction("activate")}
                        disabled={isLoading}
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Activate
                      </Button>
                    ) : selectedStrategy.status === "paused" ? (
                      <Button
                        onClick={() => handleStrategyAction("activate")}
                        disabled={isLoading}
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleStrategyAction("pause")}
                        disabled={isLoading}
                        className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {selectedStrategy.status === "active" && (
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Manage Position</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">Amount (USD)</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white pr-16"
                        />
                        <Button
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-2 bg-slate-700 hover:bg-slate-600 text-xs"
                        >
                          MAX
                        </Button>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Available: $12,450.00</div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleStrategyAction("deposit")}
                        disabled={isLoading || !depositAmount}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          "Deposit"
                        )}
                      </Button>
                      <Button
                        onClick={() => handleStrategyAction("withdraw")}
                        disabled={
                          isLoading ||
                          Number.parseFloat(selectedStrategy.allocation.replace("$", "").replace(",", "")) === 0
                        }
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                      >
                        Withdraw
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-8 text-center">
                <PieChart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Select a Strategy</h3>
                <p className="text-slate-400">Choose a yield strategy to view details and manage your position</p>
              </CardContent>
            </Card>
          )}

          {/* Risk Warning */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span>Risk Disclaimer</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-400">
              <p>• All yield farming strategies involve smart contract risks</p>
              <p>• Past performance does not guarantee future results</p>
              <p>• Higher APY strategies typically carry higher risks</p>
              <p>• Always do your own research before investing</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
