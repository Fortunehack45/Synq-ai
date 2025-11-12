
"use client";

import { useEffect, useState } from "react";
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
import { Eye, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function LoginPageContent() {
  const router = useRouter();
  const { connectWallet, address, error, clearError, loading, startDemoMode } = useWallet();
  const { toast } = useToast();

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

  const handleConnect = async (walletType: 'metaMask' | 'walletConnect') => {
    await connectWallet();
  };

  const handleDemo = () => {
    startDemoMode();
  }

  // Show a loading indicator on the login page while the initial check is running
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
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
            <Button className="w-full relative" size="lg" onClick={() => handleConnect('metaMask')} disabled={loading}>
              <span className="flex items-center justify-center flex-1">
                <Icons.metaMask className="mr-2 h-6 w-6" /> Connect with MetaMask
              </span>
            </Button>
            <Button
              variant="secondary"
              className="w-full relative"
              size="lg"
              disabled
            >
              <span className="flex items-center justify-center flex-1">
                <Icons.walletConnect className="mr-2 h-6 w-6" />
                Connect with WalletConnect
              </span>
              <Badge variant="outline" className="bg-background/50 border-border absolute right-2">Coming Soon</Badge>
            </Button>
             <div className="relative">
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
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms
            </Link>{" "}
            &{" "}
            <Link
              href="/privacy"
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
