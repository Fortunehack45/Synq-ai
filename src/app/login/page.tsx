import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Logo } from "@/components/logo"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="text-3xl font-bold">SynqAI</CardTitle>
          <CardDescription>Your Secure AI Crypto Wallet Assistant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Connect your wallet to continue.
              <br />
              We will never ask for your private keys.
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href="/dashboard">
                <Icons.metaMask className="mr-2 h-6 w-6" />
                Connect with MetaMask
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full" size="lg">
               <Link href="/dashboard">
                <Icons.walletConnect className="mr-2 h-6 w-6" />
                Connect with WalletConnect
              </Link>
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
  )
}
