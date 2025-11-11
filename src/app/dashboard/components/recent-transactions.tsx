"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useWallet } from "@/hooks/use-wallet";

export function RecentTransactions() {
  const { transactions } = useWallet();

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          An overview of your latest wallet activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length > 0 ? transactions.slice(0, 5).map((tx, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                 <div className="flex-1">
                    <p className="text-sm font-medium">{tx.hash.substring(0,10)}...{tx.hash.substring(tx.hash.length-8)}</p>
                    <p className="text-sm text-muted-foreground">To: {tx.to.substring(0,10)}...{tx.to.substring(tx.to.length-8)}</p>
                 </div>
              </div>
              <div className="text-right sm:text-right w-full sm:w-auto">
                <p className="text-sm font-medium">{parseFloat(tx.value).toFixed(5)} ETH</p>
                {tx.timeStamp && <p className="text-sm text-muted-foreground">{new Date(tx.timeStamp * 1000).toLocaleDateString()}</p>}
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground text-center pt-4">No transactions to display. Fetching full transaction history typically requires a dedicated API like Etherscan.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
