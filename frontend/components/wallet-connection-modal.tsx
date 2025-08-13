"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Eye, EyeOff, AlertCircle, CheckCircle, Loader2, ExternalLink, Plus } from "lucide-react"

interface WalletConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (walletType: string, address: string) => void
}

export function WalletConnectionModal({ isOpen, onClose, onConnect }: WalletConnectionModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"select" | "password" | "connecting" | "success">("select")
  const [walletAddress, setWalletAddress] = useState("")
  const [networkStatus, setNetworkStatus] = useState("")

  const [wallets, setWallets] = useState([
    {
      id: "metamask",
      name: "MetaMask",
      description: "Connect to Hardhat Local or Core networks",
      icon: "🦊",
      popular: true,
      installed: false,
      downloadUrl: "https://metamask.io/download/",
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      description: "Connect with 300+ wallets",
      icon: "🔗",
      popular: true,
      installed: true,
      downloadUrl: "https://walletconnect.com/",
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      description: "Secure wallet by Coinbase",
      icon: "🔵",
      popular: false,
      installed: false,
      downloadUrl: "https://wallet.coinbase.com/",
    },
    {
      id: "phantom",
      name: "Phantom",
      description: "Solana & Ethereum wallet",
      icon: "👻",
      popular: false,
      installed: false,
      downloadUrl: "https://phantom.app/",
    },
  ])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWallets((prev) =>
        prev.map((wallet) => ({
          ...wallet,
          installed: checkWalletInstalled(wallet.id),
        })),
      )
    }
  }, [isOpen])

  const checkWalletInstalled = (walletId: string): boolean => {
    if (typeof window === "undefined") return false

    const ethereum = (window as any).ethereum

    switch (walletId) {
      case "metamask":
        return !!ethereum?.isMetaMask
      case "coinbase":
        return !!ethereum?.isCoinbaseWallet
      case "phantom":
        return !!(window as any).phantom?.ethereum
      case "walletconnect":
        return true
      default:
        return false
    }
  }

  const addHardhatNetwork = async (ethereum: any) => {
    try {
      setNetworkStatus("🔄 Adding Hardhat Local network...")

      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x7A69", // Hardhat local chain ID (31337)
            chainName: "Hardhat Local",
            nativeCurrency: {
              name: "Ethereum",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["http://127.0.0.1:8545"],
            blockExplorerUrls: [], // No block explorer for local network
          },
        ],
      })

      setNetworkStatus("🔄 Switching to Hardhat Local...")

      // Switch to the Hardhat network
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7A69" }],
      })

      setNetworkStatus("✅ Connected to Hardhat Local")
      console.log("✅ Successfully added and switched to Hardhat Local network")
      return true
    } catch (hardhatError: any) {
      console.log("Hardhat network failed:", hardhatError)
      setNetworkStatus("⚠️ Hardhat Local failed, trying Core Testnet...")

      // If Hardhat fails, try to add Core Testnet as fallback
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x45B", // Core Testnet chain ID (1115)
              chainName: "Core Testnet",
              nativeCurrency: {
                name: "CORE",
                symbol: "tCORE",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.test.btcs.network"],
              blockExplorerUrls: ["https://scan.test.btcs.network"],
            },
          ],
        })

        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x45B" }],
        })

        setNetworkStatus("✅ Connected to Core Testnet")
        console.log("✅ Added Core Testnet as fallback")
        return true
      } catch (fallbackError: any) {
        console.log("Core Testnet also failed:", fallbackError)
        setNetworkStatus("⚠️ Testnet failed, trying Core Mainnet...")

        // Last resort: try Core Mainnet
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x45C", // Core Mainnet chain ID (1116)
                chainName: "Core Blockchain",
                nativeCurrency: {
                  name: "CORE",
                  symbol: "CORE",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.coredao.org"],
                blockExplorerUrls: ["https://scan.coredao.org"],
              },
            ],
          })

          setNetworkStatus("✅ Connected to Core Mainnet")
          console.log("✅ Connected to Core Mainnet")
          return true
        } catch (mainnetError) {
          setNetworkStatus("❌ All networks failed - using current network")
          return false
        }
      }
    }
  }

  const connectToWallet = async (walletId: string): Promise<string> => {
    if (typeof window === "undefined") {
      throw new Error("Wallet connection not available in this environment")
    }

    const ethereum = (window as any).ethereum

    switch (walletId) {
      case "metamask":
        if (!ethereum?.isMetaMask) {
          throw new Error("MetaMask is not installed")
        }

        try {
          setNetworkStatus("🔄 Requesting account access...")

          // Request account access
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          })

          if (!accounts || accounts.length === 0) {
            throw new Error("No accounts found. Please unlock MetaMask.")
          }

          // Add and switch to appropriate network
          const networkAdded = await addHardhatNetwork(ethereum)
          if (!networkAdded) {
            console.warn("Network setup failed, but continuing with current network")
          }

          return accounts[0]
        } catch (error: any) {
          if (error.code === 4001) {
            throw new Error("Connection rejected by user")
          }
          throw new Error(`MetaMask connection failed: ${error.message}`)
        }

      case "coinbase":
        if (!ethereum?.isCoinbaseWallet) {
          throw new Error("Coinbase Wallet is not installed")
        }

        try {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          })

          if (!accounts || accounts.length === 0) {
            throw new Error("No accounts found")
          }

          // Try to add networks for Coinbase Wallet too
          await addHardhatNetwork(ethereum)

          return accounts[0]
        } catch (error: any) {
          throw new Error(`Coinbase Wallet connection failed: ${error.message}`)
        }

      case "phantom":
        const phantom = (window as any).phantom?.ethereum
        if (!phantom) {
          throw new Error("Phantom Wallet is not installed")
        }

        try {
          const accounts = await phantom.request({
            method: "eth_requestAccounts",
          })

          if (!accounts || accounts.length === 0) {
            throw new Error("No accounts found")
          }

          return accounts[0]
        } catch (error: any) {
          throw new Error(`Phantom Wallet connection failed: ${error.message}`)
        }

      case "walletconnect":
        throw new Error(
          "WalletConnect integration requires additional setup. Please use MetaMask, Coinbase, or Phantom for now.",
        )

      default:
        throw new Error("Unsupported wallet")
    }
  }

  const handleConnect = async () => {
    if (!selectedWallet) {
      setError("Please select a wallet")
      return
    }

    const wallet = wallets.find((w) => w.id === selectedWallet)
    if (wallet?.installed && selectedWallet !== "walletconnect") {
      setIsConnecting(true)
      setStep("connecting")
      setError("")
      setNetworkStatus("")

      try {
        const address = await connectToWallet(selectedWallet)
        setWalletAddress(address)
        setStep("success")

        // Wait a moment to show success, then complete
        await new Promise((resolve) => setTimeout(resolve, 2000))

        onConnect(selectedWallet, address)
        handleClose()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to connect wallet")
        setStep("select")
      } finally {
        setIsConnecting(false)
        setNetworkStatus("")
      }
      return
    }

    if (!password) {
      setError("Please enter your password")
      return
    }

    setIsConnecting(true)
    setStep("connecting")
    setError("")

    try {
      // Enhanced password validation
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long")
      }

      if (password.toLowerCase().includes("password") || password === "123456" || password === "12345678") {
        throw new Error("Please use a stronger password")
      }

      // Check for common weak passwords
      const weakPasswords = ["qwerty", "abc123", "password123", "admin", "user"]
      if (weakPasswords.some((weak) => password.toLowerCase().includes(weak))) {
        throw new Error("Password is too weak. Please use a stronger password")
      }

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (!wallet?.installed && selectedWallet !== "walletconnect") {
        throw new Error(`${wallet?.name} is not installed. Please install it first.`)
      }

      // For WalletConnect or non-installed wallets, simulate connection
      const simulatedAddress = `0x${Math.random().toString(16).substr(2, 40)}`
      setWalletAddress(simulatedAddress)
      setStep("success")

      await new Promise((resolve) => setTimeout(resolve, 1000))

      onConnect(selectedWallet, simulatedAddress)
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
      setStep(selectedWallet === "walletconnect" ? "password" : "select")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleClose = () => {
    onClose()
    // Reset state after modal closes
    setTimeout(() => {
      setSelectedWallet(null)
      setPassword("")
      setError("")
      setIsConnecting(false)
      setStep("select")
      setWalletAddress("")
      setNetworkStatus("")
    }, 300)
  }

  const handleWalletSelect = (walletId: string) => {
    const wallet = wallets.find((w) => w.id === walletId)
    setSelectedWallet(walletId)

    if (wallet?.installed && walletId !== "walletconnect") {
      handleConnect()
    } else {
      setStep("password")
    }
    setError("")
  }

  const handleBack = () => {
    if (step === "password") {
      setStep("select")
      setSelectedWallet(null)
    }
    setError("")
  }

  // Manual network addition button
  const addNetworkManually = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      setError("MetaMask not found. Please install MetaMask first.")
      return
    }

    try {
      setNetworkStatus("🔄 Adding networks...")
      await addHardhatNetwork((window as any).ethereum)
      setError("")
    } catch (error) {
      setError("Failed to add network. Please add manually.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] w-[90vw] max-w-md mx-auto bg-slate-900 border-slate-700 text-white max-h-[85vh] overflow-y-auto shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-orange-400" />
            <span>Connect Wallet</span>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {step === "select" && "Choose your preferred wallet to connect"}
            {step === "password" && "Enter your wallet password to connect"}
            {step === "connecting" && "Connecting to your wallet..."}
            {step === "success" && "Successfully connected!"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-1">
          {/* Manual Network Addition Button */}
          {step === "select" && (
            <div className="mb-4">
              <Button
                onClick={addNetworkManually}
                variant="outline"
                className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 bg-transparent flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hardhat Network to MetaMask</span>
              </Button>
              <p className="text-xs text-slate-500 mt-1 text-center">
                Adds Hardhat Local (dev) → Core Testnet → Core Mainnet
              </p>
              {networkStatus && (
                <p className="text-xs text-orange-400 mt-2 bg-orange-500/10 border border-orange-500/20 rounded p-2 text-center">
                  {networkStatus}
                </p>
              )}
            </div>
          )}

          {step === "select" && (
            <div className="grid gap-3 max-h-[40vh] overflow-y-auto pr-2">
              {wallets.map((wallet) => (
                <Card
                  key={wallet.id}
                  className={`cursor-pointer bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-200 hover:scale-[1.02] ${!wallet.installed && wallet.id !== "walletconnect" ? "opacity-60" : ""
                    }`}
                  onClick={() =>
                    wallet.installed || wallet.id === "walletconnect"
                      ? handleWalletSelect(wallet.id)
                      : window.open(wallet.downloadUrl, "_blank")
                  }
                >
                  <CardHeader className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{wallet.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <CardTitle className="text-sm text-white truncate">{wallet.name}</CardTitle>
                            {wallet.installed ? (
                              <Badge
                                variant="outline"
                                className="text-xs border-green-500/30 text-green-400 bg-green-500/10 flex-shrink-0"
                              >
                                Installed
                              </Badge>
                            ) : wallet.id === "walletconnect" ? (
                              <Badge
                                variant="outline"
                                className="text-xs border-blue-500/30 text-blue-400 bg-blue-500/10 flex-shrink-0"
                              >
                                Available
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-xs border-slate-500/30 text-slate-400 bg-slate-500/10 flex-shrink-0"
                              >
                                Not Installed
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-xs text-slate-400 mt-1">
                            {wallet.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1 flex-shrink-0 ml-2">
                        {wallet.popular && (
                          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full whitespace-nowrap">
                            Popular
                          </span>
                        )}
                        {!wallet.installed && wallet.id !== "walletconnect" && (
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {step === "password" && selectedWallet && (
            <div className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="p-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{wallets.find((w) => w.id === selectedWallet)?.icon}</span>
                    <div>
                      <CardTitle className="text-sm text-white">
                        {wallets.find((w) => w.id === selectedWallet)?.name}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-400">Selected wallet</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-slate-300">
                  Wallet Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your wallet password"
                    className="bg-slate-800 border-slate-600 text-white pr-10 h-10"
                    onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-slate-500">Minimum 8 characters required</p>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words text-xs">{error}</span>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent h-10"
                  disabled={isConnecting}
                >
                  Back
                </Button>
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting || !password}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 h-10"
                >
                  {isConnecting ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Connecting...</span>
                    </div>
                  ) : (
                    "Connect Wallet"
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "connecting" && (
            <div className="flex flex-col items-center space-y-4 py-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <Loader2 className="w-5 h-5 text-orange-400 animate-spin absolute -top-1 -right-1" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-semibold text-white">
                  Connecting to {wallets.find((w) => w.id === selectedWallet)?.name}
                </h3>
                <p className="text-sm text-slate-400 mt-1">Please confirm the connection in your wallet</p>
                {networkStatus && (
                  <p className="text-xs text-orange-400 mt-2 bg-orange-500/10 border border-orange-500/20 rounded p-2">
                    {networkStatus}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center space-y-4 py-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-semibold text-white">Successfully Connected!</h3>
                <p className="text-sm text-slate-400 mt-1">Your wallet is now connected to Core Yield</p>
                {walletAddress && (
                  <p className="text-xs text-slate-500 mt-2 font-mono">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                )}
                {networkStatus && (
                  <p className="text-xs text-green-400 mt-1">
                    {networkStatus}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}