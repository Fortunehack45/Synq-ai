
"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useWallet } from "@/hooks/use-wallet"
import { BarChart, LineChart as LineChartIcon } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

export function PortfolioChart() {
  const { portfolioHistory, address } = useWallet();
  const isDemo = address?.toLowerCase() === "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045".toLowerCase() && localStorage.getItem('walletAddress')?.toLowerCase() === "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045".toLowerCase();


  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--primary))",
    },
  }
  
  const chartData = portfolioHistory;

  if (chartData.length === 0) {
    return (
      <Card className="glass h-full">
        <CardHeader>
          <CardTitle>Portfolio Value</CardTitle>
          <CardDescription>Your portfolio value over time.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
            <BarChart className="h-16 w-16 mb-4 text-primary/50" />
            <p className="text-lg">Historical data is not available.</p>
            <p className="text-sm">Real historical data is only available for Ethereum Mainnet.</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="glass h-full">
      <CardHeader>
        <CardTitle>Portfolio Value</CardTitle>
        <CardDescription>
          Your portfolio's native asset value over the last 30 days {isDemo ? "(mock data)" : ""}.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[350px] p-0 pr-4">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)"/>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value) =>
                    value.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }
                />
              }
            />
            <defs>
                <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
                </linearGradient>
            </defs>
            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillValue)"
              stroke="var(--color-value)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
