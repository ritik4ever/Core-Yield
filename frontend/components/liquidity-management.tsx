"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Minus, TrendingUp, DollarSign, Droplets, ArrowUpDown, Info, Zap, Target, Users } from "lucide-react"

interface LiquidityPool {
  id: string
  tokenA: string
  tokenB: string
  tokenAIcon: string
  tokenBIcon: string
  tvl: string
  apr: string
  volume24h: string
  fees24h: string
  myLiquidity: string
  myShare: string
  isStaked: boolean
}

const mockPools: LiquidityPool[] = [
  {
    id: "1",
    tokenA: "CORE",
    tokenB: "USDT",
    tokenAIcon: "🔥",
    tokenBIcon: "💵",
    tvl: "$2,450,000",
    apr: "24.5%",
    volume24h: "$125,000",
    fees24h: "$375",
    myLiquidity: "$5,240",
    myShare: "0.21%",
    isStaked: true,
  },
  {
    id: "2",
    tokenA: "CORE",
    tokenB: "WBTC",
    tokenAIcon: "🔥",
    tokenBIcon: "₿",
    tvl: "$1,850,000",
    apr: "18.2%",
    volume24h: "$89,000",
    fees24h: "$267",
    myLiquidity: "$0",
    myShare: "0%",
    isStaked: false,
  },
  {
    id: "3",
    tokenA: "USDT",
    tokenB: "USDC",
    tokenAIcon: "💵",
    tokenBIcon: "💰",
    tvl: "$3,200,000",
    apr: "12.8%",
    volume24h: "$245,000",
    fees24h: "$735",
    myLiquidity: "$1,850",
    myShare: "0.06%",
    isStaked: false,
  },
]

export function LiquidityManagement() {
  const [selectedPool, setSelectedPool] = useState<LiquidityPool | null>(null)
  const [action, setAction] = useState<"add" | "remove">("add")
  const [tokenAAmount, setTokenAAmount] = useState("")
  const [tokenBAmount, setTokenBAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handlePoolAction = async () => {
    if (!selectedPool) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log(`${action === "add" ? "Adding" : "Removing"} liquidity:`, {
      pool: selectedPool.id,
      tokenA: tokenAAmount,
      tokenB: tokenBAmount,
    })

    setIsLoading(false)
    setTokenAAmount("")
    setTokenBAmount("")
    setSelectedPool(null)
  }

  const totalLiquidity = mockPools.reduce((sum, pool) => {
    return sum + Number.parseFloat(pool.myLiquidity.replace("$", "").replace(",", ""))
  }, 0)

  const totalFees = mockPools.reduce((sum, pool) => {
    const myShare = Number.parseFloat(pool.myShare.replace("%", "")) / 100
    const fees = Number.parseFloat(pool.fees24h.replace("$", ""))
    return sum + fees * myShare
  }, 0)

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Liquidity Pools</h1>
            <p className="text-xl text-slate-300">Provide liquidity and earn fees from trading pairs</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <Droplets className="w-5 h-5 text-blue-400" />
                <span className="text-slate-400 text-sm">My Total Liquidity</span>
              </div>
              <div className="text-2xl font-bold text-white">${totalLiquidity.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-slate-400 text-sm">24h Fees Earned</span>
              </div>
              <div className="text-2xl font-bold text-green-400">${totalFees.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Pool List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Available Pools</h2>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Pool
            </Button>
          </div>

          <div className="space-y-4">
            {mockPools.map((pool) => (
              <Card
                key={pool.id}
                className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl hover:bg-slate-800/50 transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center -space-x-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-xl border-2 border-slate-900">
                          {pool.tokenAIcon}
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl border-2 border-slate-900">
                          {pool.tokenBIcon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {pool.tokenA}/{pool.tokenB}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {pool.isStaked && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <Zap className="w-3 h-3 mr-1" />
                              Staked
                            </Badge>
                          )}
                          {Number.parseFloat(pool.myLiquidity.replace("$", "").replace(",", "")) > 0 && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              <Users className="w-3 h-3 mr-1" />
                              Participating
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                      <div>
                        <div className="text-slate-400 text-sm">TVL</div>
                        <div className="text-white font-semibold">{pool.tvl}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">APR</div>
                        <div className="text-green-400 font-semibold flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {pool.apr}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">24h Volume</div>
                        <div className="text-white font-semibold">{pool.volume24h}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">My Liquidity</div>
                        <div className="text-white font-semibold">{pool.myLiquidity}</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          setSelectedPool(pool)
                          setAction("add")
                        }}
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                      {Number.parseFloat(pool.myLiquidity.replace("$", "").replace(",", "")) > 0 && (
                        <Button
                          onClick={() => {
                            setSelectedPool(pool)
                            setAction("remove")
                          }}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                        >
                          <Minus className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          {selectedPool ? (
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="flex items-center -space-x-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-sm border border-slate-700">
                      {selectedPool.tokenAIcon}
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-sm border border-slate-700">
                      {selectedPool.tokenBIcon}
                    </div>
                  </div>
                  <span className="text-white">{action === "add" ? "Add" : "Remove"} Liquidity</span>
                </CardTitle>
                <CardDescription>
                  {selectedPool.tokenA}/{selectedPool.tokenB} Pool
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">{selectedPool.tokenA} Amount</label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={tokenAAmount}
                        onChange={(e) => setTokenAAmount(e.target.value)}
                        className="bg-slate-800/50 border-slate-700 text-white pr-16"
                      />
                      <Button
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-2 bg-slate-700 hover:bg-slate-600 text-xs"
                      >
                        MAX
                      </Button>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Balance: 125.45 {selectedPool.tokenA}</div>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                      <ArrowUpDown className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">{selectedPool.tokenB} Amount</label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={tokenBAmount}
                        onChange={(e) => setTokenBAmount(e.target.value)}
                        className="bg-slate-800/50 border-slate-700 text-white pr-16"
                      />
                      <Button
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-2 bg-slate-700 hover:bg-slate-600 text-xs"
                      >
                        MAX
                      </Button>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Balance: 2,450.00 {selectedPool.tokenB}</div>
                  </div>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Pool Share</span>
                    <span className="text-white">0.15%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">LP Tokens</span>
                    <span className="text-white">1,245.67</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Est. APR</span>
                    <span className="text-green-400">{selectedPool.apr}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePoolAction}
                  disabled={isLoading || !tokenAAmount || !tokenBAmount}
                  className={`w-full ${
                    action === "add"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  } text-white font-semibold`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `${action === "add" ? "Add" : "Remove"} Liquidity`
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Select a Pool</h3>
                <p className="text-slate-400">Choose a liquidity pool to add or remove liquidity</p>
              </CardContent>
            </Card>
          )}

          {/* Pool Stats */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-blue-400" />
                <span>Pool Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Pools</span>
                  <span className="text-white font-semibold">{mockPools.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Positions</span>
                  <span className="text-white font-semibold">
                    {
                      mockPools.filter((p) => Number.parseFloat(p.myLiquidity.replace("$", "").replace(",", "")) > 0)
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Staked Positions</span>
                  <span className="text-white font-semibold">{mockPools.filter((p) => p.isStaked).length}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Portfolio Health</span>
                  <span className="text-green-400 text-sm">Excellent</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
