"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDown, Repeat } from "lucide-react";
import { TokenSelect } from "./token-select";
import { useWallet } from "@/hooks/use-wallet";
import { FormattedTokenBalance } from "@/context/wallet-provider";
import { useToast } from "@/hooks/use-toast";

export function SwapCard() {
  const { tokens, balance } = useWallet();
  const { toast } = useToast();
  
  const [fromToken, setFromToken] = useState<FormattedTokenBalance | null>(null);
  const [toToken, setToToken] = useState<FormattedTokenBalance | null>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    // Set default tokens on mount
    if (tokens.length > 0) {
      const ethToken = tokens.find(t => t.symbol === 'ETH');
      const otherToken = tokens.find(t => t.symbol !== 'ETH');
      
      setFromToken(ethToken || tokens[0]);
      if (tokens.length > 1) {
        setToToken(otherToken || tokens[1]);
      }
    }
  }, [tokens]);

  useEffect(() => {
    // Simulate fetching a quote when fromAmount or tokens change
    if (parseFloat(fromAmount) > 0 && fromToken && toToken) {
      const simulatedPrice = (fromToken.symbol === 'ETH' ? 3150 : 1) / (toToken.symbol === 'ETH' ? 3150 : (toToken.symbol === 'USDC' ? 1 : 20));
      const calculatedToAmount = parseFloat(fromAmount) * simulatedPrice;
      setToAmount(calculatedToAmount.toFixed(5));
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromToken, toToken]);

  const handleFlip = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
  };

  const handleMax = () => {
    if (fromToken) {
      setFromAmount(fromToken.balance);
    }
  };

  const handleSwap = () => {
    toast({
        title: "Swapping Disabled",
        description: "Executing real trades is not enabled in this demo.",
        variant: "destructive",
    })
  }
  
  const selectedFromBalance = fromToken?.symbol === 'ETH' ? balance : fromToken?.balance;

  return (
    <Card className="w-full max-w-md glass">
      <CardHeader>
        <CardTitle>Trade</CardTitle>
        <CardDescription>Instantly swap tokens from your wallet.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-lg bg-muted/50 space-y-2 relative">
          <Label htmlFor="from-amount">From</Label>
          <div className="flex">
            <Input
              id="from-amount"
              type="number"
              placeholder="0.0"
              className="text-2xl font-mono border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent p-0 h-auto"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
            />
            <TokenSelect
              selectedToken={fromToken}
              onSelectToken={setFromToken}
              tokens={tokens}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
             <span>Balance: {selectedFromBalance ? parseFloat(selectedFromBalance).toFixed(4) : '0.00'}</span>
             <Button variant="link" size="sm" className="h-auto p-0" onClick={handleMax}>Max</Button>
          </div>
          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
            <Button variant="ghost" size="icon" className="rounded-full bg-background border" onClick={handleFlip}>
                <ArrowDown className="h-4 w-4"/>
            </Button>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-muted/50 space-y-2">
          <Label htmlFor="to-amount">To</Label>
          <div className="flex">
            <Input
              id="to-amount"
              type="number"
              placeholder="0.0"
              className="text-2xl font-mono border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent p-0 h-auto"
              value={toAmount}
              readOnly
            />
            <TokenSelect
              selectedToken={toToken}
              onSelectToken={setToToken}
              tokens={tokens}
            />
          </div>
           <div className="flex justify-between items-center text-xs text-muted-foreground">
             <span>Balance: {toToken?.balance ? parseFloat(toToken.balance).toFixed(4) : '0.00'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg" onClick={handleSwap}>
          <Repeat className="mr-2 h-4 w-4"/> Swap
        </Button>
      </CardFooter>
    </Card>
  );
}
