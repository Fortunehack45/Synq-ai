import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function TermsPage() {
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
          <CardTitle className="text-3xl font-bold tracking-tight">Terms and Conditions</CardTitle>
          <CardDescription>
            Last Updated: {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
          <p>
            Welcome to SynqAI. These terms and conditions outline the rules and
            regulations for the use of SynqAI's Website, located at this domain.
          </p>

          <p>
            By accessing this website we assume you accept these terms and
            conditions. Do not continue to use SynqAI if you do not agree to
            take all of the terms and conditions stated on this page.
          </p>
          
          <h4 className="font-semibold text-foreground">1. License</h4>
          <p>
            Unless otherwise stated, SynqAI and/or its licensors own the
            intellectual property rights for all material on SynqAI. All
            intellectual property rights are reserved. You may access this from
            SynqAI for your own personal use subjected to restrictions set in
            these terms and conditions.
          </p>

          <h4 className="font-semibold text-foreground">2. User Responsibilities</h4>
          <p>
            You are responsible for your own wallet and any activity conducted through it. SynqAI is a tool for analysis and does not provide financial advice. We are not liable for any losses or damages in connection with the use of our website. All transactions you initiate are your sole responsibility.
          </p>
          
          <h4 className="font-semibold text-foreground">3. Disclaimers</h4>
           <p>
            The information and services on SynqAI are provided "as is". While we strive for accuracy, we make no warranties regarding the completeness, reliability, or accuracy of this information. The AI-generated analysis is for informational purposes only and should not be considered a substitute for professional financial advice.
          </p>

           <h4 className="font-semibold text-foreground">4. Governing Law</h4>
          <p>
            These terms will be governed by and interpreted in accordance with the laws of the jurisdiction in which the company is based, and you submit to the non-exclusive jurisdiction of the state and federal courts located in that jurisdiction for the resolution of any disputes.
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

    