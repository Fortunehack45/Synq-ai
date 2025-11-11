"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useWallet } from "@/hooks/use-wallet";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function RecentTransactions() {
  const { transactions, address } = useWallet();

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Your latest wallet activity. For a full history, use a block explorer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length > 0 ? transactions.slice(0, 5).map((tx, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                 <div className="flex-1">
                    <p className="text-sm font-medium truncate w-60 sm:w-auto">{tx.hash}</p>
                    <p className="text-sm text-muted-foreground">To: {tx.to ? `${tx.to.substring(0,10)}...${tx.to.substring(tx.to.length-8)}`: 'Contract Creation'}</p>
                 </div>
              </div>
              <div className="text-right sm:text-right w-full sm:w-auto">
                <p className="text-sm font-medium">{parseFloat(tx.value).toFixed(5)} ETH</p>
                {tx.timeStamp && <p className="text-sm text-muted-foreground">{new Date(tx.timeStamp * 1000).toLocaleDateString()}</p>}
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground text-center pt-4">No recent transactions found.</p>
          )}
        </div>
        {address && (
          <div className="flex justify-center pt-6">
            <Button variant="link" asChild>
              <Link href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer">
                View all on Etherscan
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
