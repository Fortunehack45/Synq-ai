
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScanLine } from "lucide-react";

export default function CoinScanPage() {
  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Coin Scan</h1>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle>AI-Powered Token Scanner</CardTitle>
          <CardDescription>
            Analyze any smart contract for risks before you invest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground">
            <ScanLine className="h-24 w-24 mb-6 text-primary/50" />
            <h2 className="text-2xl font-semibold text-foreground">
              Smart Contract Analyzer Coming Soon!
            </h2>
            <p className="max-w-md mt-2">
              Get ready to deep-dive into any token. Our AI will analyze contracts for potential scams,
              rug pulls, and other vulnerabilities, giving you a clear risk score.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
