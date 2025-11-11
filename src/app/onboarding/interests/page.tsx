

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/hooks/use-wallet';

const networks = [
  { id: 'bitcoin', name: 'Bitcoin (BTC)' },
  { id: 'ethereum', name: 'Ethereum (ETH)' },
  { id: 'bnb', name: 'BNB Chain' },
  { id: 'solana', name: 'Solana (SOL)' },
  { id: 'avalanche', name: 'Avalanche (AVAX)' },
  { id: 'polygon', name: 'Polygon (MATIC)' },
  { id: 'cardano', name: 'Cardano (ADA)' },
  { id: 'polkadot', name: 'Polkadot (DOT)' },
  { id: 'near', name: 'NEAR Protocol' },
  { id: 'algorand', name: 'Algorand (ALGO)' },
  { id: 'tezos', name: 'Tezos (XTZ)' },
  { id: 'tron', name: 'Tron (TRX)' },
  { id: 'ethereum-classic', name: 'ETC' },
  { id: 'nervos', name: 'Nervos Network' },
  { id: 'ton', name: 'TON' },
  { id: 'other', name: 'Others' },
];


export default function InterestsStep() {
  const router = useRouter();
  const { address } = useWallet();
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);

  const handleCheckboxChange = (networkId: string) => {
    setSelectedNetworks((prev) => {
      if (prev.includes(networkId)) {
        return prev.filter((id) => id !== networkId);
      } else {
        if (prev.length < 2) {
          return [...prev, networkId];
        }
        return prev;
      }
    });
  };

  const handleNext = () => {
    if (address && selectedNetworks.length > 0) {
      localStorage.setItem(`profile_${address}_interests`, JSON.stringify(selectedNetworks));
      router.push('/onboarding/discovery');
    }
  };

  return (
    <Card className="w-full max-w-lg glass shadow-2xl">
      <CardHeader className="text-center">
        <Logo className="mx-auto" />
        <CardTitle className="text-2xl pt-4">Which networks interest you?</CardTitle>
        <CardDescription>Select up to two to personalize your dashboard.</CardDescription>
        <Progress value={75} className="w-full mt-4" />
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6">
        {networks.map((network) => (
          <Label
            key={network.id}
            htmlFor={network.id}
            className="flex items-center space-x-3 rounded-md border p-4 cursor-pointer hover:bg-accent has-[:checked]:border-primary"
          >
            <Checkbox
              id={network.id}
              checked={selectedNetworks.includes(network.id)}
              onCheckedChange={() => handleCheckboxChange(network.id)}
              disabled={selectedNetworks.length >= 2 && !selectedNetworks.includes(network.id)}
            />
            <span className="font-medium text-sm">{network.name}</span>
          </Label>
        ))}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleNext} disabled={selectedNetworks.length === 0}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
