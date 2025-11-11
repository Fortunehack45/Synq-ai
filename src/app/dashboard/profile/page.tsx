
"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWallet } from "@/hooks/use-wallet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Copy, History, Image as ImageIcon, Sparkles, User, AlertTriangle, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { saveProfile, type ProfileState } from "./actions";

const initialProfileState: ProfileState = {
  success: false,
  message: "",
};

export default function ProfilePage() {
  const { address, transactions, nfts } = useWallet();
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");
  const [saveState, saveAction, isSaving] = useActionState(saveProfile, initialProfileState);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (address) {
      const savedUsername = localStorage.getItem(`profile_${address}_username`) || "AnonUser";
      const savedBio = localStorage.getItem(`profile_${address}_bio`) || "Web3 Explorer | DeFi Enthusiast";
      setUsername(savedUsername);
      setBio(savedBio);
    }
  }, [address]);

  useEffect(() => {
    if (saveState.message) {
      toast({
        title: saveState.success ? "Success" : "Error",
        description: saveState.message,
        variant: saveState.success ? "default" : "destructive",
      });
    }
  }, [saveState]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  const firstTransactionDate = () => {
    if (transactions.length === 0) return "N/A";
    const oldestTx = transactions.reduce((oldest, current) => {
      if (!current.timeStamp || !oldest.timeStamp) return oldest;
      return current.timeStamp < oldest.timeStamp ? current : oldest;
    });
    return oldestTx.timeStamp ? new Date(oldestTx.timeStamp * 1000).toLocaleDateString() : "N/A";
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Profile</h1>
      </div>
      <div className="grid gap-6">
        <Card className="glass">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <Avatar className="h-24 w-24 border-2 border-primary/50">
                {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint}/>}
                <AvatarFallback>
                  <User className="h-10 w-10"/>
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <h2 className="text-2xl font-bold font-headline">{username}</h2>
                </div>
                <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                  <p className="text-muted-foreground font-mono text-sm break-all">
                    {address}
                  </p>
                  {address && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyAddress}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy Address</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
           <Separator />
           <CardContent className="pt-6">
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-background/50 rounded-lg">
                    <History className="h-6 w-6 mx-auto mb-2 text-primary"/>
                    <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold">{transactions.length > 0 ? transactions.length : "0"}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                    <ImageIcon className="h-6 w-6 mx-auto mb-2 text-primary"/>
                    <p className="text-sm font-medium text-muted-foreground">NFTs Owned</p>
                    <p className="text-2xl font-bold">{nfts.length}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                    <Sparkles className="h-6 w-6 mx-auto mb-2 text-primary"/>
                    <p className="text-sm font-medium text-muted-foreground">First Transaction</p>
                    <p className="text-xl font-bold">{firstTransactionDate()}</p>
                </div>
             </div>
           </CardContent>
        </Card>

        <form action={saveAction}>
          <Card className="glass">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Customize your public profile information. This is stored locally in your browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  name="username"
                  placeholder="VitalikButerin" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio"
                  name="bio" 
                  placeholder="Founder of Ethereum. Building the future of the decentralized web."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4"/>Save Changes</>}
              </Button>
            </CardFooter>
          </Card>
        </form>
        
        <Card className="glass border-destructive">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                These actions may have unintended consequences.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                <div>
                  <h3 className="text-base font-medium text-destructive flex items-center gap-2"><AlertTriangle className="h-4 w-4"/>Reset Profile</h3>
                  <p className="text-sm text-muted-foreground">This will reset your profile customizations.</p>
                </div>
                <Button variant="destructive" disabled>
                  Reset Profile (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
      </div>
    </>
  );
}
