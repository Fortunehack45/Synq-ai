
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { useWallet } from "@/hooks/use-wallet";
import { toast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Bell, KeyRound, Palette, ShieldCheck, Trash2, LogOut, Info } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const { address, disconnectWallet } = useWallet();

  const handleClearCache = () => {
    try {
      const walletAddress = localStorage.getItem("walletAddress");
      localStorage.clear();
      if (walletAddress) {
        localStorage.setItem("walletAddress", walletAddress);
      }
      toast({
        title: "Cache Cleared",
        description: "Application cache has been successfully cleared.",
      });
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear cache.",
      });
    }
  }

  const formatAddress = (addr: string | null) => {
    if (!addr) return "Not Connected";
    return `${addr.substring(0, 10)}...${addr.substring(addr.length - 8)}`;
  };

  return (
    <>
      <div className="flex flex-col items-start mb-8">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and application preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="general"><Palette className="mr-2 h-4 w-4"/>General</TabsTrigger>
          <TabsTrigger value="security"><ShieldCheck className="mr-2 h-4 w-4"/>Security</TabsTrigger>
          <TabsTrigger value="api"><KeyRound className="mr-2 h-4 w-4"/>API Keys</TabsTrigger>
          <TabsTrigger value="advanced"><Trash2 className="mr-2 h-4 w-4"/>Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                 <RadioGroup onValueChange={(value) => setTheme(value)} defaultValue={theme} className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <RadioGroupItem value="light" id="light" className="peer sr-only" />
                    <Label htmlFor="light" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      <SunIcon className="mb-3 h-6 w-6" />
                      Light
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                    <Label htmlFor="dark" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      <MoonIcon className="mb-3 h-6 w-6" />
                      Dark
                    </Label>
                  </div>
                   <div>
                    <RadioGroupItem value="system" id="system" className="peer sr-only" />
                    <Label htmlFor="system" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      <LaptopIcon className="mb-3 h-6 w-6" />
                      System
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your connection and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 className="text-base font-medium">Connected Wallet</h3>
                  <p className="text-sm text-muted-foreground font-mono">{formatAddress(address)}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={disconnectWallet}>
                  <LogOut className="mr-2 h-4 w-4" /> Disconnect
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card className="glass">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for third-party services. These are stored locally in your browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="etherscan-key">Etherscan API Key</Label>
                <Input id="etherscan-key" placeholder="Your Etherscan API Key" defaultValue="************_DEMO_************" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alchemy-key">Alchemy API Key</Label>
                <Input id="alchemy-key" placeholder="Your Alchemy API Key" defaultValue="************_DEMO_************" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
           <Card className="glass border-destructive">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                These actions are irreversible. Please proceed with caution.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <h3 className="text-base font-medium">Clear Local Cache</h3>
                  <p className="text-sm text-muted-foreground">This will clear all locally cached application data.</p>
                </div>
                <Button variant="outline" onClick={handleClearCache}>
                  Clear Cache
                </Button>
              </div>
               <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                <div>
                  <h3 className="text-base font-medium text-destructive">Disconnect and Log Out</h3>
                  <p className="text-sm text-muted-foreground">You will be logged out and your wallet will be disconnected.</p>
                </div>
                <Button variant="destructive" onClick={disconnectWallet}>
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

function LaptopIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55A1 1 0 0 1 20.7 20H3.3a1 1 0 0 1-.58-1.45L4 16" />
    </svg>
  )
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

    