
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dog } from "lucide-react";

export default function MemeCoinsPage() {
  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Meme Coins</h1>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle>Meme Coin Screener</CardTitle>
          <CardDescription>
            Find the next 100x coin before it moons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground">
            <Dog className="h-24 w-24 mb-6 text-primary/50" />
            <h2 className="text-2xl font-semibold text-foreground">
              Meme Coin Desk Screener Coming Soon!
            </h2>
            <p className="max-w-md mt-2">
              Get ready to track the hottest new meme coins in real-time. Our screener
              will provide live charts, social sentiment analysis, and on-chain metrics.
              (This feature will likely require a data provider API key).
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
