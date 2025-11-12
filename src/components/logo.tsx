import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-16 w-16 bg-primary text-primary-foreground rounded-2xl",
        className
      )}
    >
      <svg
        className="h-9 w-9"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.5 7.75C8.5 5.12665 10.5193 3 12.9999 3C15.4805 3 17.4999 5.12665 17.4999 7.75V8.25"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.5 16.25C15.5 18.8734 13.4807 21 11.0001 21C8.51953 21 6.50006 18.8734 6.50006 16.25V15.75"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.5 8C17.5 10.6234 15.4807 12.75 13 12.75H11C8.51929 12.75 6.5 10.6234 6.5 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
