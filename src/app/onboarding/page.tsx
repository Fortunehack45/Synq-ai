
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/use-wallet';

export default function OnboardingPage() {
  const router = useRouter();
  const { address, loading } = useWallet();

  useEffect(() => {
    // This page is a router. If loading is done, figure out where to go.
    if (!loading) {
      if (!address) {
        // No address, should be at login.
        router.push('/login');
      } else {
        // Has address, check if onboarding is complete.
        const onboardingComplete = localStorage.getItem(`onboarding_complete_${address}`);
        if (onboardingComplete) {
          // Already onboarded, go to dashboard.
          router.push('/dashboard');
        } else {
          // Not onboarded, start the flow.
          router.push('/onboarding/profile');
        }
      }
    }
  }, [address, loading, router]);

  // Render a loader while the logic runs.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
