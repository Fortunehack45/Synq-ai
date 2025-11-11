import { cn } from "@/lib/utils"
import { BotMessageSquare } from "lucide-react"

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-16 w-16 bg-primary text-primary-foreground rounded-2xl",
        className
      )}
    >
      <BotMessageSquare className="h-8 w-8" />
    </div>
  )
}
