
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Logo } from "@/components/logo";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import Link from "next/link";
import { WalletProvider } from "@/context/wallet-provider";
import { Eye, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function LoginPageContent() {
  const router = useRouter();
  const { connectWallet, address, error, clearError, loading, startDemoMode } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    if (address) {
      const onboardingComplete = localStorage.getItem(`onboarding_complete_${address}`);
      if (onboardingComplete) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    }
  }, [address, router]);


  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error,
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleConnect = async () => {
    await connectWallet();
  };
  
  const handleDemo = () => {
    startDemoMode();
  }

  const handleComingSoon = () => {
    toast({
      title: "Coming Soon!",
      description: "This connection method is currently in development.",
    });
  }

  // Show a loading indicator on the login page while the initial check is running
  if (loading && !error) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Logo className="h-16 w-16 mb-2 animate-pulse" />
          <h2 className="text-lg font-semibold text-foreground">Loading SynqAI...</h2>
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)]"></div>
       <div className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-blob h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-3xl filter" />
      </div>
      <Card className="w-full max-w-md glass shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">SynqAI</CardTitle>
          <CardDescription>
            Your Secure AI Crypto Wallet Assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button className="w-full relative" size="lg" onClick={handleConnect} disabled={loading}>
              <span className="flex items-center justify-center flex-1">
                <Icons.metaMask className="mr-2 h-6 w-6" /> Connect with MetaMask
              </span>
            </Button>
            <Button
              variant="secondary"
              className="w-full relative"
              size="lg"
              onClick={handleComingSoon}
            >
              <span className="flex items-center justify-center flex-1">
                <Icons.walletConnect className="mr-2 h-6 w-6" />
                Connect with WalletConnect
              </span>
            </Button>
             <Button
              variant="secondary"
              className="w-full relative"
              size="lg"
              onClick={handleComingSoon}
            >
              <span className="flex items-center justify-center flex-1">
                <Wallet className="mr-2 h-5 w-5" />
                Connect Other Wallets
              </span>
            </Button>
             <div className="relative pt-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground text-[0.7rem]">
                  OR
                </span>
              </div>
            </div>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={handleDemo}
              >
                <Eye className="mr-2 h-5 w-5" />
                Continue with Demo
              </Button>
            

          </div>
          <p className="mt-6 px-8 text-center text-xs text-muted-foreground">
            By connecting, you agree to our{" "}
            <Link
              href="/terms"
              prefetch={false}
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms
            </Link>{" "}
            &{" "}
            <Link
              href="/privacy"
              prefetch={false}
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <p className="mt-4 px-8 text-center text-xs text-muted-foreground">
            Made by{" "}
            <a
              href="https://x.com/Diform_io?t=egikhcsUlvjmIIxESdD6Wg&s=09"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-primary"
            >
              Diform
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <WalletProvider>
      <LoginPageContent />
    </WalletProvider>
  )
}
