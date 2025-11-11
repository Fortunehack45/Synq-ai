"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TransactionsPage() {
  const { transactions, address } = useWallet();

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Transactions</h1>
      </div>
      <Card className="glass w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>A record of your recent wallet activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {transactions.length > 0 ? transactions.map((tx, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-2">
                <div className="grid gap-1 overflow-hidden w-full sm:w-auto min-w-0">
                  <p className="text-sm font-medium truncate">{tx.hash}</p>
                   <p className="text-sm text-muted-foreground truncate">
                    From: {tx.from}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    To: {tx.to ? tx.to : 'Contract Creation'}
                  </p>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                  <p className="text-sm font-semibold">{parseFloat(tx.value).toFixed(5)} ETH</p>
                   {tx.timeStamp && <p className="text-sm text-muted-foreground">{new Date(tx.timeStamp * 1000).toLocaleString()}</p>}
                </div>
              </div>
            )) : (
              <p className="text-center text-muted-foreground pt-4">No transactions found.</p>
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
    </>
  );
}
