
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
import { ImageIcon, Wallet } from "lucide-react";

export function AssetsTabs() {
  const { tokens, nfts } = useWallet();

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
                <div key={token.contractAddress} className="flex items-center">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted">
                    {token.iconUrl ? (
                      <Image src={token.iconUrl} alt={`${token.name} logo`} width={40} height={40} className="h-10 w-10 rounded-full" data-ai-hint={token.iconHint || ''}/>
                    ) : (
                      <Wallet className="h-5 w-5 text-muted-foreground"/>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium leading-none">{token.name}</p>
                    <p className="text-sm text-muted-foreground">{token.balance} {token.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{token.value}</p>
                  </div>
                </div>
              )) : (
                 <div className="flex flex-col items-center justify-center h-48 text-center">
                  <Wallet className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-muted-foreground">No token balances found.</p>
                   <p className="text-xs text-muted-foreground mt-1">Connect a wallet with tokens to see them here.</p>
                 </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="nfts">
            {nfts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                {nfts.slice(0, 8).map((nft, index) => (
                  <div key={index} className="group relative aspect-square overflow-hidden rounded-lg">
                    <Image 
                      src={nft.image?.cachedUrl ?? "https://picsum.photos/seed/1/300/300"} 
                      alt={nft.name ?? 'NFT Image'}
                      width={150}
                      height={150}
                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      data-ai-hint="abstract art"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                       <p className="text-white text-xs font-bold truncate">{nft.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
             <div className="flex flex-col items-center justify-center h-48">
                <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground text-center">No NFTs found or could not be fetched.</p>
             </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
