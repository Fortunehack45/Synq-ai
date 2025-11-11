

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/hooks/use-wallet';

const experiences = [
  { id: 'beginner', title: 'Beginner', description: 'Just starting out in the crypto world.' },
  { id: 'intermediate', title: 'Intermediate', description: 'I know my way around a blockchain.' },
  { id: 'professional', title: 'Professional', description: 'I build, trade, or analyze for a living.' },
];

export default function ExperienceStep() {
  const router = useRouter();
  const { address } = useWallet();
  const [selectedExperience, setSelectedExperience] = useState('');

  const handleNext = () => {
    if (address && selectedExperience) {
      localStorage.setItem(`profile_${address}_experience`, selectedExperience);
      router.push('/onboarding/interests');
    }
  };

  return (
    <Card className="w-full max-w-lg glass shadow-2xl">
      <CardHeader className="text-center">
        <Logo className="mx-auto" />
        <CardTitle className="text-2xl pt-4">What's your experience level?</CardTitle>
        <CardDescription>This helps us tailor your experience.</CardDescription>
        <Progress value={50} className="w-full mt-4" />
      </CardHeader>
      <CardContent className="pt-6">
        <RadioGroup value={selectedExperience} onValueChange={setSelectedExperience} className="space-y-4">
          {experiences.map((exp) => (
            <Label
              key={exp.id}
              htmlFor={exp.id}
              className="flex items-center space-x-4 rounded-md border p-4 cursor-pointer hover:bg-accent has-[:checked]:border-primary"
            >
              <RadioGroupItem value={exp.id} id={exp.id} />
              <div className="grid gap-1.5">
                <p className="font-semibold">{exp.title}</p>
                <p className="text-sm text-muted-foreground">{exp.description}</p>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleNext} disabled={!selectedExperience}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
