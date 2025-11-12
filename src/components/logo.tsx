import { cn } from "@/lib/utils"
import Image from "next/image"

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-16 w-16",
        className
      )}
    >
      <Image src="/icon.svg" alt="SynqAI Logo" width={64} height={64} />
    </div>
  )
}
