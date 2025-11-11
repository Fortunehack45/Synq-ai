
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
import { Copy, History, Image as ImageIcon, Sparkles, User, AlertTriangle, Save, MessageSquare, Repeat, Heart, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { saveProfile, type ProfileState } from "./actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      const savedBio = localStorage.getItem(`profile_${address}_bio`) || "Web3 Explorer | DeFi Enthusiast | NFT Collector";
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
      if (saveState.success) {
        // Persist to localStorage on successful save
        if(address) {
          localStorage.setItem(`profile_${address}_username`, username);
          localStorage.setItem(`profile_${address}_bio`, bio);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
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
                <p className="text-muted-foreground pt-2 max-w-xl text-center md:text-left">{bio}</p>
              </div>
               <Button variant="outline"><UserPlus className="mr-2 h-4 w-4"/>Follow</Button>
            </div>
             <div className="flex gap-6 pt-4 justify-center md:justify-start">
                <div className="text-center md:text-left">
                  <p className="font-bold">1,234</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="font-bold">5,678</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                 <div className="text-center md:text-left">
                  <p className="font-bold">89</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
              </div>
          </CardHeader>
        </Card>
        
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="replies">Replies</TabsTrigger>
            <TabsTrigger value="highlights">Highlights</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <Card className="glass">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-semibold">No Posts Yet</p>
                  <p className="text-sm text-muted-foreground">When this user makes a post, it'll show up here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
           <TabsContent value="replies">
            <Card className="glass">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <Repeat className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-semibold">No Replies Yet</p>
                  <p className="text-sm text-muted-foreground">When this user replies to a post, it'll show up here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
           <TabsContent value="highlights">
            <Card className="glass">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-semibold">No Highlights Yet</p>
                  <p className="text-sm text-muted-foreground">Highlights from this user will appear here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
           <TabsContent value="media">
            <Card className="glass">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-semibold">No Media Yet</p>
                  <p className="text-sm text-muted-foreground">Images and videos posted by this user will appear here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <form action={saveAction}>
          <Card className="glass">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
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
                  placeholder="e.g., VitalikButerin" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio"
                  name="bio" 
                  placeholder="e.g., Founder of Ethereum. Building the future of the decentralized web."
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
                  <p className="text-sm text-muted-foreground">This will reset your profile customizations to the default.</p>
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
