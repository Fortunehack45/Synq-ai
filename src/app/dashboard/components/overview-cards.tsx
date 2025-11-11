"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowUp, Wallet, Image as ImageIcon } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet";

export function OverviewCards() {
  const { balance } = useWallet();

  const totalBalance = balance ? parseFloat(balance).toFixed(4) : "0.00";
  const ethPrice = 3150; // Using a static price for now
  const totalValue = balance ? (parseFloat(balance) * ethPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="text-2xl font-bold">4</div>
          <p className="text-xs text-muted-foreground">
            Valued at ~$2,350.87
          </p>
        </CardContent>
      </Card>
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Portfolio Change (24h)
          </CardTitle>
          <ArrowUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">+1.2%</div>
          <p className="text-xs text-muted-foreground">
            +$463.45 from yesterday
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
