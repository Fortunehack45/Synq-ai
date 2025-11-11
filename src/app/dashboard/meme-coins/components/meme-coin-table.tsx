"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const mockMemeCoins = [
  {
    name: "Dogecoin",
    symbol: "DOGE",
    price: 0.158,
    change24h: 5.2,
    volume24h: 2_500_000_000,
    icon: "https://static.alchemyapi.io/images/assets/74.png",
  },
  {
    name: "Shiba Inu",
    symbol: "SHIB",
    price: 0.000025,
    change24h: -2.1,
    volume24h: 1_800_000_000,
    icon: "https://static.alchemyapi.io/images/assets/5994.png",
  },
  {
    name: "Pepe",
    symbol: "PEPE",
    price: 0.000012,
    change24h: 15.8,
    volume24h: 1_200_000_000,
    icon: "https://static.alchemyapi.io/images/assets/13953.png",
  },
  {
    name: "Dogwifhat",
    symbol: "WIF",
    price: 3.5,
    change24h: 22.3,
    volume24h: 950_000_000,
    icon: "https://static.alchemyapi.io/images/assets/15053.png",
  },
  {
    name: "Floki",
    symbol: "FLOKI",
    price: 0.00022,
    change24h: -5.5,
    volume24h: 600_000_000,
    icon: "https://static.alchemyapi.io/images/assets/10804.png",
  },
    {
    name: "Bonk",
    symbol: "BONK",
    price: 0.00003,
    change24h: 8.1,
    volume24h: 450_000_000,
    icon: "https://static.alchemyapi.io/images/assets/12999.png",
  },
];


export function MemeCoinTable() {
  return (
    <Card className="glass">
        <CardHeader>
          <CardTitle>Meme Coin Screener</CardTitle>
          <CardDescription>
            Find the next 100x coin before it moons. (Demo Data)
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Coin</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead className="text-right">24h Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMemeCoins.map((coin) => (
                  <TableRow key={coin.symbol}>
                    <TableCell>
                       <div className="flex items-center gap-4">
                        {coin.icon && <Image src={coin.icon} alt={coin.name} width={32} height={32} className="rounded-full"/>}
                        <div>
                          <p className="font-medium">{coin.name}</p>
                          <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                        </div>
                       </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: coin.price < 0.01 ? 8 : 4 })}</TableCell>
                    <TableCell className={cn("text-right font-medium", coin.change24h > 0 ? 'text-green-500' : 'text-red-500')}>
                      <div className="flex items-center justify-end gap-1">
                        {coin.change24h > 0 ? <ArrowUp className="h-4 w-4"/> : <ArrowDown className="h-4 w-4"/>}
                        {coin.change24h.toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">${coin.volume24h.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
  )
}
