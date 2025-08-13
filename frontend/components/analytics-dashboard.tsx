"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  PieChartIcon,
  BarChart3,
  Activity,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
} from "lucide-react"

const portfolioData = [
  { date: "Jan", value: 10000, pnl: 0 },
  { date: "Feb", value: 12500, pnl: 2500 },
  { date: "Mar", value: 11800, pnl: 1800 },
  { date: "Apr", value: 15200, pnl: 5200 },
  { date: "May", value: 18900, pnl: 8900 },
  { date: "Jun", value: 22400, pnl: 12400 },
]

const yieldData = [
  { date: "Jan", conservative: 120, moderate: 180, aggressive: 280 },
  { date: "Feb", conservative: 145, moderate: 220, aggressive: 350 },
  { date: "Mar", conservative: 138, moderate: 195, aggressive: 320 },
  { date: "Apr", conservative: 162, moderate: 285, aggressive: 420 },
  { date: "May", conservative: 189, moderate: 340, aggressive: 520 },
  { date: "Jun", conservative: 205, moderate: 380, aggressive: 580 },
]

const allocationData = [
  { name: "Conservative", value: 35, color: "#10b981" },
  { name: "Moderate", value: 45, color: "#f59e0b" },
  { name: "Aggressive", value: 20, color: "#ef4444" },
]

const protocolData = [
  { protocol: "Compound", tvl: 2450000, apy: 12.5, allocation: 25 },
  { protocol: "Aave", tvl: 1850000, apy: 18.2, allocation: 20 },
  { protocol: "Curve", tvl: 3200000, apy: 15.8, allocation: 18 },
  { protocol: "Uniswap", tvl: 1200000, apy: 24.5, allocation: 15 },
  { protocol: "Yearn", tvl: 890000, apy: 32.1, allocation: 12 },
  { protocol: "Convex", tvl: 650000, apy: 28.7, allocation: 10 },
]

const performanceMetrics = [
  { metric: "Total Return", value: "+$12,400", change: "+24.8%", isPositive: true },
  { metric: "30d Return", value: "+$2,340", change: "+4.7%", isPositive: true },
  { metric: "7d Return", value: "+$456", change: "+0.9%", isPositive: true },
  { metric: "24h Return", value: "-$89", change: "-0.2%", isPositive: false },
]

export function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState("6M")
  const [selectedMetric, setSelectedMetric] = useState("portfolio")

  const timeframes = ["24H", "7D", "1M", "3M", "6M", "1Y", "ALL"]

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Analytics Dashboard</h1>
            <p className="text-xl text-slate-300">Track your performance and market insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
              {timeframes.map((tf) => (
                <Button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  variant={timeframe === tf ? "secondary" : "ghost"}
                  size="sm"
                  className={`px-3 py-1 text-xs ${
                    timeframe === tf ? "bg-blue-500/20 text-blue-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tf}
                </Button>
              ))}
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">{metric.metric}</span>
                {metric.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className={`text-sm font-medium ${metric.isPositive ? "text-green-400" : "text-red-400"}`}>
                {metric.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span>Portfolio Performance</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setSelectedMetric("portfolio")}
                    variant={selectedMetric === "portfolio" ? "secondary" : "ghost"}
                    size="sm"
                    className={selectedMetric === "portfolio" ? "bg-blue-500/20 text-blue-400" : "text-slate-400"}
                  >
                    Portfolio
                  </Button>
                  <Button
                    onClick={() => setSelectedMetric("yield")}
                    variant={selectedMetric === "yield" ? "secondary" : "ghost"}
                    size="sm"
                    className={selectedMetric === "yield" ? "bg-blue-500/20 text-blue-400" : "text-slate-400"}
                  >
                    Yield
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedMetric === "portfolio" ? (
                    <AreaChart data={portfolioData}>
                      <defs>
                        <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#portfolioGradient)"
                      />
                    </AreaChart>
                  ) : (
                    <LineChart data={yieldData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="conservative" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="moderate" stroke="#f59e0b" strokeWidth={2} />
                      <Line type="monotone" dataKey="aggressive" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Protocol Performance */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <span>Protocol Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {protocolData.map((protocol, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{protocol.protocol}</div>
                        <div className="text-sm text-slate-400">TVL: ${protocol.tvl.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-green-400 font-semibold">{protocol.apy}% APY</div>
                        <div className="text-sm text-slate-400">{protocol.allocation}% allocation</div>
                      </div>
                      <div className="w-20">
                        <Progress value={protocol.allocation * 4} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Allocation Chart */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChartIcon className="w-5 h-5 text-green-400" />
                <span>Strategy Allocation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {allocationData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Metrics */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Risk Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sharpe Ratio</span>
                  <span className="text-white font-semibold">1.85</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Drawdown</span>
                  <span className="text-red-400 font-semibold">-8.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Volatility</span>
                  <span className="text-white font-semibold">12.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Beta</span>
                  <span className="text-white font-semibold">0.76</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Risk Score</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Low Risk</Badge>
                </div>
                <Progress value={25} className="h-2" />
                <div className="text-xs text-slate-400 mt-1">Conservative portfolio allocation</div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Active Strategies</span>
                <span className="text-white font-semibold">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Protocols</span>
                <span className="text-white font-semibold">6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg APY</span>
                <span className="text-green-400 font-semibold">18.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Days Active</span>
                <span className="text-white font-semibold">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Best Month</span>
                <span className="text-green-400 font-semibold">+$3,240</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
