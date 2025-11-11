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
import { nfts, tokens as staticTokens } from "@/lib/data"
import Image from "next/image"
import { useWallet } from "@/hooks/use-wallet";

export function AssetsTabs() {
  const { balance } = useWallet();
  const ethPrice = 3150; // Static price

  const tokens = balance ? [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      balance: parseFloat(balance).toFixed(4),
      value: (parseFloat(balance) * ethPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: staticTokens[0].icon,
      change: '+2.5%', // Static for now
      changeType: 'positive',
    },
    // Other tokens would be fetched and listed here
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
                    <p className={`text-sm ${token.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{token.change}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center pt-4">No tokens found in this wallet.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="nfts">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 pt-4">
              {nfts.map((nft) => (
                <div key={nft.name} className="space-y-2 group">
                  {nft.image && 
                    <div className="overflow-hidden rounded-md">
                      <Image
                        src={nft.image.imageUrl}
                        alt={nft.name}
                        width={150}
                        height={150}
                        className="rounded-md object-cover aspect-square w-full h-auto transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={nft.image.imageHint}
                      />
                    </div>
                  }
                  <div>
                    <p className="text-sm font-medium leading-none">{nft.name}</p>
                    <p className="text-xs text-muted-foreground">{nft.collection}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
