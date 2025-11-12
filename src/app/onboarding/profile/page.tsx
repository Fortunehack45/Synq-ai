
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/hooks/use-wallet';
import { Logo } from '@/components/logo';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft } from 'lucide-react';

export default function ProfileStep() {
  const router = useRouter();
  const { address } = useWallet();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (address) {
      const savedName = localStorage.getItem(`profile_${address}_name`) || '';
      const savedUsername = localStorage.getItem(`profile_${address}_username`) || '';
      setName(savedName);
      setUsername(savedUsername);
    }
  }, [address]);

  const handleNext = () => {
    if (address && name && username) {
      localStorage.setItem(`profile_${address}_name`, name);
      localStorage.setItem(`profile_${address}_username`, username);
      router.push('/onboarding/experience');
    }
  };

  return (
    <Card className="w-full max-w-lg glass shadow-2xl">
      <CardHeader className="text-center">
        <Logo className="mx-auto" />
        <CardTitle className="text-2xl pt-4">Welcome to SynqAI</CardTitle>
        <CardDescription>Let's set up your profile.</CardDescription>
        <Progress value={25} className="w-full mt-4" />
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="e.g., Vitalik Buterin" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="e.g., vitalik.eth" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={() => router.push('/login')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>
        <Button onClick={handleNext} disabled={!name || !username}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
