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
import { AlertCircle, FileText, ScanLine, Sparkles, AlertTriangle, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getContractAnalysis, type CoinScanState } from "../actions";
import { cn } from "@/lib/utils";

const initialState: CoinScanState = {
  success: false,
  data: undefined,
  error: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Analyzing..." : <><Sparkles className="mr-2 h-4 w-4"/>Analyze Contract</>}
    </Button>
  );
}

const riskColorMap = {
  Low: "bg-green-500",
  Medium: "bg-yellow-500",
  High: "bg-red-500",
};

export function CoinScanInterface() {
  const [state, formAction] = useActionState(getContractAnalysis, initialState);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-start">
      <div className="md:col-span-1">
        <Card className="glass sticky top-20">
          <CardHeader>
            <CardTitle>Smart Contract Analysis</CardTitle>
            <CardDescription>
              Enter a contract address to get an AI-powered security summary.
            </CardDescription>
          </CardHeader>
          <form action={formAction}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contractAddress">Contract Address</Label>
                <Input
                  id="contractAddress"
                  name="contractAddress"
                  placeholder="0x..."
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
                <ScanLine className="h-16 w-16 mb-4 text-primary/50" />
                <p className="text-lg">Your analysis will appear here.</p>
                <p className="text-sm">Enter a contract address to get started.</p>
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
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg flex items-center mb-2"><FileText className="w-5 h-5 mr-2 text-primary"/>Contract Summary</h3>
                     <Badge className={cn("text-white", riskColorMap[state.data.riskAssessment])}>
                        {state.data.riskAssessment} Risk
                     </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{state.data.summary}</p>
                
                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-green-500"/>Owner-Only Functions</h3>
                  <p className="text-sm text-muted-foreground">{state.data.ownerOnlyFunctions}</p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-green-500"/>Mint/Burn Permissions</h3>
                   <p className="text-sm text-muted-foreground">{state.data.mintBurnPermissions}</p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-yellow-500"/>Transfer Restrictions</h3>
                  <p className="text-sm text-muted-foreground">{state.data.transferRestrictions}</p>
                </div>

              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
