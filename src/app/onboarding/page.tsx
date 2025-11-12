
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/use-wallet';

export default function OnboardingPage() {
  const router = useRouter();
  const { address, loading } = useWallet();

  useEffect(() => {
    if (!loading) {
      if (!address) {
        router.push('/login');
      } else {
        const onboardingComplete = localStorage.getItem(`onboarding_complete_${address}`);
        if (onboardingComplete) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding/profile');
        }
      }
    }
  }, [address, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
