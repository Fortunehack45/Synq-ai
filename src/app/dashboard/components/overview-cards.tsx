"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowDown, ArrowUp, Wallet, Image as ImageIcon } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet";
import { cn } from "@/lib/utils";

export function OverviewCards() {
  const { balance, nfts, portfolioChange } = useWallet();

  const totalBalance = balance ? parseFloat(balance).toFixed(4) : "0.00";
  const ethPrice = 3150; // Using a static price for now
  const totalValue = balance ? (parseFloat(balance) * ethPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00';

  const isChangePositive = portfolioChange >= 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Balance
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalValue}</div>
          <p className="text-xs text-muted-foreground">
            {totalBalance} ETH
          </p>
        </CardContent>
      </Card>
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            NFTs
          </CardTitle>
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{nfts.length > 0 ? nfts.length : "0"}</div>
           <p className="text-xs text-muted-foreground">
            {nfts.length > 0 ? "unique items" : "No NFTs found"}
          </p>
        </CardContent>
      </Card>
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Portfolio Change (24h)
          </CardTitle>
           {isChangePositive ? <ArrowUp className="h-4 w-4 text-green-500" /> : <ArrowDown className="h-4 w-4 text-red-500" />}
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", isChangePositive ? "text-green-500" : "text-red-500")}>
            {portfolioChange > 0 ? "+" : ""}{portfolioChange.toFixed(2)}%
            </div>
          <p className="text-xs text-muted-foreground">
            Based on mock data
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
