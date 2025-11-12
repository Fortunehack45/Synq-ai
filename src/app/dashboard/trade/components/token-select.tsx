
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Wallet } from "lucide-react"
import Image from "next/image"
import { ethers } from "ethers"
import { Alchemy, Network } from "alchemy-sdk"

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
import { type FormattedTokenBalance } from "@/context/wallet-provider"


interface TokenSelectProps {
    selectedToken: FormattedTokenBalance | null;
    onSelectToken: (token: FormattedTokenBalance) => void;
    tokens: FormattedTokenBalance[];
}

const getAlchemy = () => {
  const userKey = typeof window !== 'undefined' ? localStorage.getItem('alchemyApiKey') : null;
  const envKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
  const apiKey = userKey || envKey;
  
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey.length < 30) {
    if (!userKey) {
      console.warn("Alchemy API key not found. Token search by address will be limited.");
    }
    return null;
  }

  // For now, let's assume we are on Mainnet for token lookups.
  // A more advanced implementation might get the chainId from the wallet context.
  return new Alchemy({ apiKey, network: Network.ETH_MAINNET });
};


export function TokenSelect({ selectedToken, onSelectToken, tokens }: TokenSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [localTokens, setLocalTokens] = React.useState(tokens);
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    setLocalTokens(tokens);
  }, [tokens]);

  const handleSearchChange = async (search: string) => {
    setSearchValue(search);
    if (ethers.isAddress(search)) {
      const alchemy = getAlchemy();
      if (!alchemy) return;

      try {
        const metadata = await alchemy.core.getTokenMetadata(search);
        if (metadata.name && metadata.symbol && metadata.decimals) {
           const existingToken = localTokens.find(t => t.contractAddress.toLowerCase() === search.toLowerCase());
           if (!existingToken) {
             const newToken: FormattedTokenBalance = {
                contractAddress: search,
                name: metadata.name,
                symbol: metadata.symbol,
                balance: '0',
                value: '$0.00',
                iconUrl: metadata.logo,
                iconHint: `${metadata.name} logo`,
             };
             const newTokens = [newToken, ...localTokens];
             setLocalTokens(newTokens);
             onSelectToken(newToken);
             setSearchValue(""); // Clear search after selection
             setOpen(false); // Close popover
           }
        }
      } catch (error) {
        console.error("Failed to fetch token metadata for address:", search, error);
      }
    }
  }


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
          <CommandInput 
            placeholder="Search or paste address..." 
            value={searchValue}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            <CommandEmpty>No token found.</CommandEmpty>
            <CommandGroup>
              {localTokens.map((token) => (
                <CommandItem
                  key={token.contractAddress}
                  value={`${token.symbol} ${token.name} ${token.contractAddress}`}
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
