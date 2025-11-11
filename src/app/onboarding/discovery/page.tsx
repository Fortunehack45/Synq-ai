

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useWallet } from '@/hooks/use-wallet';
import { ChevronLeft } from 'lucide-react';


const discoveryOptions = [
  'X (Twitter)',
  'Friend or Colleague',
  'Search Engine (Google, etc.)',
  'YouTube',
  'Blog or Article',
  'Other',
];

export default function DiscoveryStep() {
  const router = useRouter();
  const { address } = useWallet();
  const [source, setSource] = useState('');

  const finishOnboarding = () => {
     if (address) {
      localStorage.setItem(`onboarding_complete_${address}`, 'true');
      router.push('/dashboard');
    }
  }

  const handleFinish = () => {
    if (address && source) {
      localStorage.setItem(`profile_${address}_discovery`, source);
    }
    finishOnboarding();
  };
  
  const handleSkip = () => {
    finishOnboarding();
  }

  return (
    <Card className="w-full max-w-lg glass shadow-2xl">
      <CardHeader className="text-center">
        <Logo className="mx-auto" />
        <CardTitle className="text-2xl pt-4">One last thing...</CardTitle>
        <CardDescription>How did you hear about us? This helps us grow.</CardDescription>
        <Progress value={90} className="w-full mt-4" />
      </CardHeader>
      <CardContent className="pt-6">
        <Select onValueChange={setSource} value={source}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {discoveryOptions.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkip}>
                Skip
            </Button>
            <Button onClick={handleFinish} disabled={!source}>
              Finish Setup
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
