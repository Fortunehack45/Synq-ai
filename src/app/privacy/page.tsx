import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)]"></div>
       <div className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-blob h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-3xl filter" />
      </div>
      <Card className="w-full max-w-4xl glass shadow-2xl">
        <CardHeader className="text-center">
           <Link href="/login" className="mx-auto flex items-center gap-2 font-semibold w-fit mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-headline text-2xl tracking-tight">SynqAI</span>
          </Link>
          <CardTitle className="text-3xl font-bold tracking-tight">Privacy Policy</CardTitle>
          <CardDescription>
            Last Updated: {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
          <p>
            Your privacy is important to us. It is SynqAI's policy to respect
            your privacy regarding any information we may collect from you
            across our website.
          </p>
          
          <h4 className="font-semibold text-foreground">1. Information We Collect</h4>
          <p>
            We only ask for personal information when we truly need it to provide a service to you. The only personal information we store is your connected wallet address, which is necessary for the application to function. We do not collect names, emails, or other contact information.
          </p>

          <h4 className="font-semibold text-foreground">2. How We Use Information</h4>
          <p>
            We use your wallet address solely to fetch on-chain data and provide the analysis services offered by SynqAI. We do not sell or share your wallet address with third parties. All AI analysis queries are processed anonymously.
          </p>

          <h4 className="font-semibold text-foreground">3. Security</h4>
          <p>
            We are committed to protecting the information we collect. While no method of transmission over the Internet or electronic storage is 100% secure, we use commercially acceptable means to protect your information. Your wallet's security is your responsibility; we never have access to your private keys.
          </p>

          <h4 className="font-semibold text-foreground">4. Cookies</h4>
          <p>
            We use cookies to store your session information, such as keeping you logged in. These are functional cookies necessary for the site's operation and are not used for tracking purposes.
          </p>
          
          <div className="text-center pt-4">
            <Link href="/login" className="text-sm text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
