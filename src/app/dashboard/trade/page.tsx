
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Repeat } from "lucide-react";

export default function TradePage() {
  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Trade</h1>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle>Decentralized Swaps</CardTitle>
          <CardDescription>
            Securely trade tokens directly from your wallet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground">
            <Repeat className="h-24 w-24 mb-6 text-primary/50" />
            <h2 className="text-2xl font-semibold text-foreground">
              Integrated Trading Coming Soon!
            </h2>
            <p className="max-w-md mt-2">
              Our secure, AI-assisted trading terminal is under construction. 
              Soon you'll be able to swap assets with confidence, powered by on-chain insights.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
