"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  TrendingUp,
  BarChart3,
  Activity,
  DollarSign,
  PieChart,
  Wallet,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WalletConnectionModal } from "./wallet-connection-modal"

interface HeaderProps {
  onNavigate?: (page: string) => void
}

export function Header({ onNavigate }: HeaderProps) {
  const [isDark, setIsDark] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState("Dashboard")

  const navItems = [
    { name: "Dashboard", href: "#", icon: Activity },
    { name: "Swap", href: "#", icon: TrendingUp },
    { name: "Liquidity", href: "#", icon: DollarSign },
    { name: "Strategies", href: "#", icon: PieChart },
    { name: "Analytics", href: "#", icon: BarChart3 },
  ]

  const handleWalletConnect = (walletType: string, password: string) => {
    setIsConnected(true)
    setConnectedWallet(walletType)
    console.log(`Connected to ${walletType} with password: ${password}`)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setConnectedWallet(null)
  }

  const handleNavigation = (pageName: string) => {
    setCurrentPage(pageName)
    setIsMobileMenuOpen(false)
    onNavigate?.(pageName)
  }

  return (
    <>
      <header className="relative z-20 border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/80">
        <div className="max-w-5xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="flex items-center space-x-1.5">
                <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-white">Core Yield</h1>
                </div>
              </div>

              {/* Desktop Navigation - More compact */}
              <nav className="hidden lg:flex items-center space-x-0.5">
                {navItems.map((item) => {
                  const IconComponent = item.icon
                  const isActive = currentPage === item.name
                  return (
                    <Button
                      key={item.name}
                      variant={isActive ? "secondary" : "ghost"}
                      onClick={() => handleNavigation(item.name)}
                      className={`relative px-2 py-1 text-xs font-medium transition-all duration-200 flex items-center space-x-1 ${isActive
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                        }`}
                    >
                      <IconComponent className="w-3 h-3" />
                      <span className="hidden xl:inline text-xs">{item.name}</span>
                    </Button>
                  )
                })}
              </nav>
            </div>

            {/* Market Stats - More compact and better responsive */}
            <div className="hidden xl:flex items-center space-x-2 text-xs">
              <div className="flex items-center space-x-1">
                <span className="text-slate-400 text-xs">MC</span>
                <span className="font-semibold text-white text-xs">$8.45M</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-slate-400 text-xs">TVL</span>
                <span className="font-semibold text-white text-xs">$55.0M</span>
              </div>
              <Badge
                variant="outline"
                className="border-red-500/20 text-red-400 bg-red-500/10 flex items-center space-x-1 px-1.5 py-0.5 text-xs"
              >
                <TrendingUp className="w-2 h-2" />
                <span>PHAR $337.80</span>
              </Badge>
              <Badge
                variant="outline"
                className="border-green-500/20 text-green-400 bg-green-500/10 flex items-center space-x-1 px-1.5 py-0.5 text-xs"
              >
                <TrendingUp className="w-2 h-2" />
                <span>AVAX $23.13</span>
              </Badge>
            </div>

            {/* Actions - More compact */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDark(!isDark)}
                className="hidden sm:flex w-7 h-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex w-7 h-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Settings className="w-3.5 h-3.5" />
              </Button>

              {isConnected ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-semibold px-2 py-1 rounded-lg transition-all duration-200 flex items-center space-x-1 text-xs h-8">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="hidden sm:inline">Connected</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-slate-900 border-slate-700 text-white">
                    <DropdownMenuItem className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Wallet: {connectedWallet}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2">
                      <Wallet className="w-4 h-4" />
                      <span>0x1234...5678</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem
                      onClick={handleDisconnect}
                      className="flex items-center space-x-2 text-red-400 hover:text-red-300"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-2.5 py-1 rounded-lg shadow-lg hover:shadow-orange-500/25 transition-all duration-200 flex items-center space-x-1 text-xs h-8 whitespace-nowrap"
                >
                  <Wallet className="w-3 h-3" />
                  <span>Connect Wallet</span>
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden w-7 h-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-3 border-t border-slate-800/50">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => {
                  const IconComponent = item.icon
                  const isActive = currentPage === item.name
                  return (
                    <Button
                      key={item.name}
                      variant={isActive ? "secondary" : "ghost"}
                      onClick={() => handleNavigation(item.name)}
                      className={`justify-start flex items-center space-x-2 py-2 ${isActive ? "bg-red-500/20 text-red-400" : "text-slate-300"
                        }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Button>
                  )
                })}
              </nav>

              {/* Mobile Market Stats */}
              <div className="mt-3 pt-3 border-t border-slate-800/50">
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Market Cap:</span>
                    <span className="text-white">$8.45M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">TVL:</span>
                    <span className="text-white">$55.0M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PHAR:</span>
                    <span className="text-red-400">$337.80</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">AVAX:</span>
                    <span className="text-green-400">$23.13</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/50">
                {isConnected ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 text-sm">Connected to {connectedWallet}</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleDisconnect}
                      variant="outline"
                      className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent py-2"
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsWalletModalOpen(true)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold flex items-center justify-center space-x-2 py-2"
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="hidden sm:inline">Connect</span>
                    <span className="sm:hidden">Wallet</span>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <WalletConnectionModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleWalletConnect}
      />
    </>
  )
}
