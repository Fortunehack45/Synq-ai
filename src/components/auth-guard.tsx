
'use client';

import { useWallet } from '@/hooks/use-wallet';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from './logo';
import { Skeleton } from './ui/skeleton';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { address, loading } = useWallet();
  const router = useRouter();

  useEffect(() => {
    // This hook only runs when loading or address state changes.
    // It will not run on simple navigation.
    if (!loading) {
      if (!address) {
        router.push('/login');
      } else {
        const onboardingComplete = localStorage.getItem(`onboarding_complete_${address}`);
        if (!onboardingComplete) {
          router.push('/onboarding');
        }
      }
    }
  }, [address, loading, router]);

  // While loading, show a full-screen loader.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Logo className="h-16 w-16 mb-2 animate-pulse" />
          <h2 className="text-lg font-semibold text-foreground">Verifying Session...</h2>
          <p className="max-w-xs">Please wait while we sync your on-chain data.</p>
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
      </div>
    );
  }

  // If we are done loading and have an address that has completed onboarding, show the children.
  if (address && localStorage.getItem(`onboarding_complete_${address}`)) {
    return <>{children}</>;
  }

  // Otherwise, render a loader while the redirect from the useEffect is in progress.
  return (
     <div className="flex h-screen w-full items-center justify-center text-center">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Logo className="h-16 w-16 mb-2 animate-pulse" />
        <h2 className="text-lg font-semibold text-foreground">Redirecting...</h2>
      </div>
    </div>
  );
}
