"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getWalletAnalysis, type WalletAnalysisState } from "../actions";
import { AlertCircle, BotMessageSquare, CheckCircle2, ChevronRight, Shield, Sparkles, TrendingUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const initialState: WalletAnalysisState = {
  success: false,
  data: undefined,
  error: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Analyzing..." : <> <Sparkles className="mr-2 h-4 w-4"/>Analyze Wallet</>}
    </Button>
  );
}

export function ChatInterface() {
  const [state, formAction] = useActionState(getWalletAnalysis, initialState);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-start">
      <div className="md:col-span-1">
        <Card className="glass sticky top-20">
          <CardHeader>
            <CardTitle>Wallet Analysis</CardTitle>
            <CardDescription>
              Enter a wallet address and your query to get AI-powered insights.
            </CardDescription>
          </CardHeader>
          <form action={formAction}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input
                  id="walletAddress"
                  name="walletAddress"
                  placeholder="0x..."
                  defaultValue="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userQuery">Your Query</Label>
                <Textarea
                  id="userQuery"
                  name="userQuery"
                  placeholder="e.g., Is this wallet safe? What are the main holdings?"
                  defaultValue="What is the risk profile of this wallet?"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="min-h-[600px] glass">
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            {!state.data && !state.error && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-96">
                <BotMessageSquare className="h-16 w-16 mb-4 text-primary/50" />
                <p className="text-lg">Your analysis will appear here.</p>
                <p className="text-sm">Submit a query to get started.</p>
              </div>
            )}
            {state.error && (
              <div className="text-red-500 flex flex-col items-center justify-center text-center h-96">
                <AlertCircle className="h-16 w-16 mb-4"/>
                <p className="text-lg font-semibold">An Error Occurred</p>
                <p className="text-sm">{state.error}</p>
              </div>
            )}
            {state.success && state.data && (
              <div className="space-y-6 animate-in fade-in-50">
                <div>
                  <h3 className="font-semibold text-lg flex items-center mb-2"><Shield className="w-5 h-5 mr-2 text-primary"/>Risk Score</h3>
                  <div className="flex items-center gap-4">
                    <Progress value={state.data.riskScore} className="w-full h-3" />
                    <span className="font-bold text-xl">{state.data.riskScore}/100</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{state.data.overallSummary}</p>
                </div>
                
                <Separator />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center"><AlertCircle className="w-5 h-5 mr-2 text-primary"/>Reasons</h3>
                    <ul className="space-y-2">
                      {state.data.reasons.map((reason: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="h-4 w-4 mr-2 mt-1 shrink-0 text-muted-foreground" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center"><CheckCircle2 className="w-5 h-5 mr-2 text-primary"/>Suggested Actions</h3>
                    <ul className="space-y-2">
                      {state.data.suggestedActions.map((action: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="h-4 w-4 mr-2 mt-1 shrink-0 text-muted-foreground" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg flex items-center mb-2"><TrendingUp className="w-5 h-5 mr-2 text-primary"/>On-chain Citations</h3>
                  <div className="space-y-2 text-sm text-muted-foreground font-mono">
                    {state.data.citations.map((citation: string, index: number) => (
                      <p key={index} className="truncate">{citation}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
