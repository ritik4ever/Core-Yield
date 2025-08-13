"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown, Settings, Info, Zap, TrendingUp, DollarSign, Clock, AlertTriangle } from "lucide-react"
import { TokenSelector } from "./token-selector"

interface Token {
  symbol: string
  name: string
  icon: string
  balance: string
  price: number
}

const availableTokens: Token[] = [
  { symbol: "CORE", name: "Core Token", icon: "🔥", balance: "125.45", price: 1.85 },
  { symbol: "AVAX", name: "Avalanche", icon: "🔺", balance: "12.5847", price: 23.13 },
  { symbol: "WAIFU", name: "Waifu Token", icon: "💎", balance: "0.00", price: 0.85 },
  { symbol: "USDT", name: "Tether USD", icon: "💵", balance: "2,450.00", price: 1.0 },
  { symbol: "WBTC", name: "Wrapped Bitcoin", icon: "₿", balance: "0.0234", price: 43250.0 },
  { symbol: "ETH", name: "Ethereum", icon: "⟠", balance: "1.2456", price: 2340.5 },
]

export function SwapInterface() {
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [fromToken, setFromToken] = useState(availableTokens[1]) // AVAX
  const [toToken, setToToken] = useState(availableTokens[2]) // WAIFU
  const [slippage, setSlippage] = useState("0.5")
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const calculateToAmount = (amount: string, from: Token, to: Token) => {
    if (!amount || Number.parseFloat(amount) === 0) return ""
    const rate = from.price / to.price
    const result = Number.parseFloat(amount) * rate * 0.997 // 0.3% fee
    return result.toFixed(6)
  }

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    setToAmount(calculateToAmount(value, fromToken, toToken))
  }

  const handleToAmountChange = (value: string) => {
    setToAmount(value)
    if (value) {
      const reverseRate = toToken.price / fromToken.price
      const result = Number.parseFloat(value) * reverseRate * 1.003 // Reverse calculation with fee
      setFromAmount(result.toFixed(6))
    } else {
      setFromAmount("")
    }
  }

  const handleSwapTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleMaxClick = () => {
    const maxAmount = fromToken.balance
    setFromAmount(maxAmount)
    setToAmount(calculateToAmount(maxAmount, fromToken, toToken))
  }

  const handleSwap = async () => {
    if (!fromAmount || !toAmount) return

    setIsLoading(true)
    // Simulate swap transaction
    await new Promise((resolve) => setTimeout(resolve, 3000))

    console.log("Swap executed:", {
      from: `${fromAmount} ${fromToken.symbol}`,
      to: `${toAmount} ${toToken.symbol}`,
      slippage: `${slippage}%`,
    })

    setIsLoading(false)
    setFromAmount("")
    setToAmount("")
  }

  const priceImpact = fromAmount ? Math.min(Number.parseFloat(fromAmount) / 10000, 5) : 0
  const networkFee = 0.12
  const totalUsdValue = fromAmount ? Number.parseFloat(fromAmount) * fromToken.price : 0

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Swap Tokens</h1>
            <p className="text-xl text-slate-300">Exchange your tokens with the best rates on Core blockchain</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-slate-400 text-sm">24h Volume</span>
              </div>
              <div className="text-2xl font-bold text-white">$2.4M</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <span className="text-slate-400 text-sm">Total Liquidity</span>
              </div>
              <div className="text-2xl font-bold text-white">$12.8M</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span className="text-slate-400 text-sm">Avg Settlement</span>
              </div>
              <div className="text-2xl font-bold text-white">~3s</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Swap Interface */}
        <div className="xl:col-span-2">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Swap
              </h2>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/10">
                  <Zap className="w-3 h-3 mr-1" />
                  Instant
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-slate-400 hover:text-white"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* From Token */}
            <div className="space-y-6">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-400">From</span>
                  <span className="text-sm text-slate-400">
                    Balance: <span className="text-white font-medium">{fromToken.balance}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={fromAmount}
                      onChange={(e) => handleFromAmountChange(e.target.value)}
                      className="bg-transparent border-none text-3xl font-semibold text-white placeholder:text-slate-500 p-0 h-auto focus-visible:ring-0"
                    />
                    <div className="text-sm text-slate-400 mt-2">≈ ${totalUsdValue.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMaxClick}
                      className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 bg-transparent"
                    >
                      MAX
                    </Button>
                    <TokenSelector token={fromToken} onSelect={setFromToken} tokens={availableTokens} />
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSwapTokens}
                  className="w-14 h-14 p-0 rounded-full bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-200 hover:scale-105"
                >
                  <ArrowUpDown className="w-6 h-6 text-slate-300" />
                </Button>
              </div>

              {/* To Token */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-400">To</span>
                  <span className="text-sm text-slate-400">
                    Balance: <span className="text-white font-medium">{toToken.balance}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={toAmount}
                      onChange={(e) => handleToAmountChange(e.target.value)}
                      className="bg-transparent border-none text-3xl font-semibold text-white placeholder:text-slate-500 p-0 h-auto focus-visible:ring-0"
                    />
                    <div className="text-sm text-slate-400 mt-2">
                      ≈ ${toAmount ? (Number.parseFloat(toAmount) * toToken.price).toFixed(2) : "0.00"}
                    </div>
                  </div>
                  <TokenSelector token={toToken} onSelect={setToToken} tokens={availableTokens} />
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="mt-6 p-6 bg-slate-800/20 border border-slate-700/30 rounded-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">Advanced Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Slippage Tolerance</label>
                    <div className="flex space-x-2">
                      {["0.1", "0.5", "1.0"].map((value) => (
                        <Button
                          key={value}
                          variant={slippage === value ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => setSlippage(value)}
                          className={`${
                            slippage === value
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : "border-slate-600 text-slate-300"
                          }`}
                        >
                          {value}%
                        </Button>
                      ))}
                      <Input
                        type="number"
                        placeholder="Custom"
                        value={slippage}
                        onChange={(e) => setSlippage(e.target.value)}
                        className="w-20 bg-slate-800 border-slate-600 text-white text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Transaction Deadline</label>
                    <div className="flex items-center space-x-2">
                      <Input type="number" placeholder="20" className="bg-slate-800 border-slate-600 text-white" />
                      <span className="text-slate-400 text-sm">minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Swap Details */}
            {fromAmount && toAmount && (
              <div className="mt-6 p-6 bg-slate-800/20 border border-slate-700/30 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Info className="w-4 h-4" />
                    <span>Exchange Rate</span>
                  </div>
                  <span className="text-white font-medium">
                    1 {fromToken.symbol} = {(Number.parseFloat(toAmount) / Number.parseFloat(fromAmount)).toFixed(6)}{" "}
                    {toToken.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Price Impact</span>
                  <span className={`font-medium ${priceImpact > 3 ? "text-red-400" : "text-green-400"}`}>
                    {priceImpact.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Slippage Tolerance</span>
                  <span className="text-white font-medium">{slippage}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Network Fee</span>
                  <span className="text-white font-medium">${networkFee.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Minimum Received</span>
                  <span className="text-white font-medium">
                    {(Number.parseFloat(toAmount) * (1 - Number.parseFloat(slippage) / 100)).toFixed(6)}{" "}
                    {toToken.symbol}
                  </span>
                </div>
              </div>
            )}

            {/* Price Impact Warning */}
            {priceImpact > 3 && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <div className="text-red-400 font-medium text-sm">High Price Impact</div>
                  <div className="text-red-300 text-xs">This trade will significantly affect the token price</div>
                </div>
              </div>
            )}

            {/* Swap Button */}
            <Button
              onClick={handleSwap}
              disabled={!fromAmount || !toAmount || isLoading}
              className="w-full mt-8 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-6 rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Swapping...</span>
                </div>
              ) : fromAmount && toAmount ? (
                "Swap Tokens"
              ) : (
                "Enter Amount"
              )}
            </Button>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Recent Transactions */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Recent Swaps</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { from: "AVAX", to: "CORE", amount: "2.5", time: "2m ago" },
                { from: "USDT", to: "WBTC", amount: "1,200", time: "5m ago" },
                { from: "ETH", to: "AVAX", amount: "0.8", time: "8m ago" },
              ].map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center -space-x-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-xs">
                        {availableTokens.find((t) => t.symbol === tx.from)?.icon}
                      </div>
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xs">
                        {availableTokens.find((t) => t.symbol === tx.to)?.icon}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {tx.from} → {tx.to}
                      </div>
                      <div className="text-xs text-slate-400">
                        {tx.amount} {tx.from}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">{tx.time}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Token Prices */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span>Token Prices</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableTokens.slice(0, 4).map((token, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      {token.icon}
                    </div>
                    <div>
                      <div className="font-medium text-white">{token.symbol}</div>
                      <div className="text-xs text-slate-400">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">${token.price.toFixed(2)}</div>
                    <div className="text-xs text-green-400">+2.4%</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
