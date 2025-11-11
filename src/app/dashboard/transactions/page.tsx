import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { transactions } from "@/lib/data";

export default function TransactionsPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Transactions</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>A complete record of your wallet activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {transactions.map((tx, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-2">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">{tx.type}</p>
                  <p className="text-sm text-muted-foreground">{tx.description}</p>
                </div>
                <div className="text-right sm:text-right w-full sm:w-auto">
                  <p className="text-sm font-semibold">{tx.amount}</p>
                  <p className="text-sm text-muted-foreground">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
