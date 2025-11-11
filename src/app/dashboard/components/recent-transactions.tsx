import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { transactions } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          An overview of your latest wallet activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((tx, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                 <div className="flex-1">
                    <p className="text-sm font-medium">{tx.type}</p>
                    <p className="text-sm text-muted-foreground">{tx.description}</p>
                 </div>
              </div>
              <div className="text-right sm:text-right w-full sm:w-auto">
                <p className="text-sm font-medium">{tx.amount}</p>
                <p className="text-sm text-muted-foreground">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
