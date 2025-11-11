"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Wallet } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FormattedTokenBalance } from "@/context/wallet-provider"


interface TokenSelectProps {
    selectedToken: FormattedTokenBalance | null;
    onSelectToken: (token: FormattedTokenBalance) => void;
    tokens: FormattedTokenBalance[];
}

export function TokenSelect({ selectedToken, onSelectToken, tokens }: TokenSelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[150px] justify-between"
        >
          {selectedToken ? (
            <>
            <div className="flex items-center gap-2">
               {selectedToken.iconUrl ? (
                <Image src={selectedToken.iconUrl} alt={selectedToken.name} width={24} height={24} className="rounded-full"/>
               ) : (
                <Wallet className="h-5 w-5 text-muted-foreground"/>
               )}
              {selectedToken.symbol}
            </div>
            </>
          ) : (
            "Select token"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search token..." />
          <CommandList>
            <CommandEmpty>No token found.</CommandEmpty>
            <CommandGroup>
              {tokens.map((token) => (
                <CommandItem
                  key={token.contractAddress}
                  value={`${token.symbol} ${token.name}`}
                  onSelect={() => {
                    onSelectToken(token)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedToken?.contractAddress === token.contractAddress ? "opacity-100" : "opacity-0"
                    )}
                  />
                   <div className="flex items-center gap-2">
                       {token.iconUrl ? (
                        <Image src={token.iconUrl} alt={token.name} width={24} height={24} className="rounded-full"/>
                       ) : (
                        <Wallet className="h-5 w-5 text-muted-foreground"/>
                       )}
                      {token.symbol}
                    </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
