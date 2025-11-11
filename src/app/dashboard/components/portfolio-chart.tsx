"use client"
import { BarChart } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function PortfolioChart() {
  return (
    <Card className="glass h-full">
      <CardHeader>
        <CardTitle>Portfolio Value</CardTitle>
        <CardDescription>Your portfolio value over time.</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
          <BarChart className="h-16 w-16 mb-4 text-primary/50" />
          <p className="text-lg">Historical data is not yet available.</p>
          <p className="text-sm">This feature is coming soon.</p>
        </div>
      </CardContent>
    </Card>
  )
}
