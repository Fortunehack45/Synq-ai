"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Image from "next/image"
import { useWallet } from "@/hooks/use-wallet";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function AssetsTabs() {
  const { balance } = useWallet();
  const ethPrice = 3150; // Static price for now

  const ethLogo = PlaceHolderImages.find(img => img.id === 'eth-logo');

  const tokens = balance ? [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      balance: parseFloat(balance).toFixed(4),
      value: (parseFloat(balance) * ethPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: ethLogo,
      change: '', // Real-time change requires an oracle or API
      changeType: 'positive',
    },
    // Other token balances would be fetched from an API
  ] : [];

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Assets</CardTitle>
        <CardDescription>Your tokens and NFTs.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tokens">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
          </TabsList>
          <TabsContent value="tokens">
            <div className="space-y-4 pt-4">
              {tokens.length > 0 ? tokens.map((token) => (
                <div key={token.symbol} className="flex items-center">
                  {token.icon && <Image src={token.icon.imageUrl} alt={`${token.name} logo`} width={40} height={40} className="h-10 w-10 rounded-full" data-ai-hint={token.icon.imageHint}/>}
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium leading-none">{token.name}</p>
                    <p className="text-sm text-muted-foreground">{token.balance} {token.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{token.value}</p>
                    {token.change && <p className={`text-sm ${token.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{token.change}</p>}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center pt-4">No tokens found. Only ETH balance is currently displayed.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="nfts">
             <div className="flex items-center justify-center h-48">
                <p className="text-sm text-muted-foreground text-center">NFT fetching is not yet implemented.</p>
             </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
