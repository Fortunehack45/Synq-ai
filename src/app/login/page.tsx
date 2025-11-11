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

function LoginPageContent() {
  const router = useRouter();
  const { connectWallet, address, error, clearError } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    if (address) {
      router.push("/dashboard");
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

  const handleConnect = async (walletType: 'metaMask' | 'walletConnect') => {
    if (walletType === 'walletConnect') {
      toast({
        title: "Coming Soon",
        description: "WalletConnect support is not yet implemented.",
      });
      return;
    }
    await connectWallet();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="text-3xl font-bold">SynqAI</CardTitle>
          <CardDescription>
            Your Secure AI Crypto Wallet Assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Connect your wallet to continue.
              <br />
              We will never ask for your private keys.
            </p>
            <Button className="w-full" size="lg" onClick={() => handleConnect('metaMask')}>
              <Icons.metaMask className="mr-2 h-6 w-6" />
              Connect with MetaMask
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              size="lg"
              onClick={() => handleConnect('walletConnect')}
            >
              <Icons.walletConnect className="mr-2 h-6 w-6" />
              Connect with WalletConnect
            </Button>
          </div>
          <p className="mt-6 px-8 text-center text-xs text-muted-foreground">
            By connecting your wallet, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
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
