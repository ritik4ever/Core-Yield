"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search } from "lucide-react"

interface Token {
  symbol: string
  name: string
  icon: string
  balance: string
  price?: number
}

interface TokenSelectorProps {
  token: Token
  onSelect: (token: Token) => void
  tokens?: Token[]
}

export function TokenSelector({ token, onSelect, tokens }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const defaultTokens: Token[] = [
    { symbol: "CORE", name: "Core Token", icon: "🔥", balance: "125.45", price: 1.85 },
    { symbol: "AVAX", name: "Avalanche", icon: "🔺", balance: "12.5847", price: 23.13 },
    { symbol: "WAIFU", name: "Waifu Token", icon: "💎", balance: "0.00", price: 0.85 },
    { symbol: "USDT", name: "Tether USD", icon: "💵", balance: "2,450.00", price: 1.0 },
    { symbol: "WBTC", name: "Wrapped Bitcoin", icon: "₿", balance: "0.0234", price: 43250.0 },
    { symbol: "ETH", name: "Ethereum", icon: "⟠", balance: "1.2456", price: 2340.5 },
    { symbol: "USDC", name: "USD Coin", icon: "💰", balance: "1,234.56", price: 1.0 },
  ]

  const availableTokens = tokens || defaultTokens

  const filteredTokens = availableTokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 text-white px-4 py-2 h-12 rounded-xl transition-all duration-200"
      >
        <span className="text-lg mr-2">{token.icon}</span>
        <span className="font-semibold">{token.symbol}</span>
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 right-0 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-semibold text-white mb-3">Select Token</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredTokens.length > 0 ? (
                filteredTokens.map((t) => (
                  <button
                    key={t.symbol}
                    onClick={() => {
                      onSelect(t)
                      setIsOpen(false)
                      setSearchQuery("")
                    }}
                    className="w-full p-4 hover:bg-slate-700/50 transition-colors flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg">
                        {t.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {t.symbol}
                        </div>
                        <div className="text-sm text-slate-400">{t.name}</div>
                        {t.price && <div className="text-xs text-slate-500">${t.price.toFixed(2)}</div>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-300 font-medium">{t.balance}</div>
                      {t.price && (
                        <div className="text-xs text-slate-400">
                          ${(Number.parseFloat(t.balance.replace(",", "")) * t.price).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400">
                  <div className="text-sm">No tokens found</div>
                  <div className="text-xs mt-1">Try a different search term</div>
                </div>
              )}
            </div>
            <div className="p-3 border-t border-slate-700 bg-slate-800/50">
              <div className="text-xs text-slate-400 text-center">
                Can't find your token?{" "}
                <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Import custom token</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
