

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Copy, Image as ImageIcon, Sparkles, User, MessageSquare, Repeat, Heart, MessageCircle, BarChart2, Pencil, PlusSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";


const mockAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

const mockPosts = [
  {
    id: 1,
    author: "Vitalik Buterin",
    handle: "@VitalikButerin",
    content: "Just published a new blog post on the future of Ethereum's scalability. We're exploring some exciting paths with sharding and layer 2 solutions. The goal is to make the network accessible to everyone. #Ethereum #Scaling",
    timestamp: "2h ago",
    stats: {
      likes: "12.1K",
      replies: "1.2K",
      reposts: "2.8K",
    },
  },
  {
    id: 2,
    author: "Vitalik Buterin",
    handle: "@VitalikButerin",
    content: "The transition to Proof-of-Stake was a massive undertaking, but the energy savings and security benefits are already proving to be game-changing for Ethereum. A huge thank you to the entire community for their support.",
    timestamp: "1d ago",
    stats: {
      likes: "25.6K",
      replies: "2.3K",
      reposts: "6.1K",
    },
  },
  {
    id: 3,
    author: "Vitalik Buterin",
    handle: "@VitalikButerin",
    content: "Thinking about the importance of decentralized identity. Self-sovereign identity solutions built on Ethereum could give users back control over their personal data. It's a complex problem but one worth solving.",
    timestamp: "3d ago",
    stats: {
      likes: "9.8K",
      replies: "876",
      reposts: "1.9K",
    },
  },
];


function PostCard({ post, authorName, authorHandle }: { post: typeof mockPosts[0], authorName: string, authorHandle: string }) {
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");
  return (
    <Card className="glass">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 border-2 border-primary/50">
            {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint}/>}
            <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
          </Avatar>
          <div className="w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold">{authorName}</p>
              <p className="text-sm text-muted-foreground">@{authorHandle}</p>
              <span className="text-sm text-muted-foreground hidden sm:inline">·</span>
              <p className="text-sm text-muted-foreground">{post.timestamp}</p>
            </div>
            <p className="mt-1 text-sm">{post.content}</p>
            <div className="flex justify-between items-center mt-4 text-muted-foreground">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>{post.stats.replies}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Repeat className="h-4 w-4" />
                <span>{post.stats.reposts}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{post.stats.likes}</span>
              </Button>
              <Button variant="ghost" size="sm">
                <BarChart2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProfilePage() {
  const { address } = useWallet();
  const router = useRouter();
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");
  const bannerImage = PlaceHolderImages.find((img) => img.id === "profile-banner");
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  
  const isDemoUser = address?.toLowerCase() === mockAddress.toLowerCase();

  useEffect(() => {
    if (address) {
      const savedName = localStorage.getItem(`profile_${address}_name`) || (isDemoUser ? "Vitalik Buterin" : "Anonymous User");
      const savedUsername = localStorage.getItem(`profile_${address}_username`) || (isDemoUser ? "VitalikButerin" : "anonuser");
      const savedBio = localStorage.getItem(`profile_${address}_bio`) || (isDemoUser ? "Co-founder of Ethereum. Building the future of the decentralized web." : "");
      setName(savedName);
      setUsername(savedUsername);
      setBio(savedBio);
    }
  }, [address, isDemoUser]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  const formatAddress = (addr: string | null) => {
    if (!addr) return "Not Connected";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Social Profile</h1>
      </div>
      <div className="grid gap-6">
        <Card className="glass overflow-hidden">
           <div className="relative">
             {bannerImage && (
                <Image 
                    src={bannerImage.imageUrl} 
                    alt="Profile Banner"
                    width={1200}
                    height={300}
                    className="h-32 sm:h-48 w-full object-cover"
                    data-ai-hint={bannerImage.imageHint}
                />
             )}
             <div className="absolute -bottom-10 sm:-bottom-12 left-4 sm:left-6">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background">
                    {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint}/>}
                    <AvatarFallback>
                    <User className="h-12 w-12"/>
                    </AvatarFallback>
                </Avatar>
             </div>
           </div>
          <CardHeader className="pt-16 sm:pt-20 pb-4 px-4 sm:px-6">
            <div className="flex justify-end">
                <Button onClick={() => router.push('/dashboard/settings?tab=profile')}><Pencil className="mr-2 h-4 w-4"/>Edit Profile</Button>
            </div>
            <div className="mt-2">
                <h2 className="text-2xl font-bold font-headline">{name}</h2>
                <p className="text-sm text-muted-foreground">@{username}</p>
                 <div className="flex items-center gap-2 mt-1">
                  <p className="text-muted-foreground font-mono text-sm">
                    {formatAddress(address)}
                  </p>
                  {address && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyAddress}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy Address</span>
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground pt-2 max-w-xl">{bio}</p>
            </div>
             <div className="flex gap-4 sm:gap-6 pt-4">
                <div>
                  <p className="font-bold">{isDemoUser ? '1,234' : '0'}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                <div>
                  <p className="font-bold">{isDemoUser ? '5,678' : '0'}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                 <div>
                  <p className="font-bold">{isDemoUser ? mockPosts.length : '0'}</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
              </div>
          </CardHeader>
        </Card>
        
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="replies">Replies</TabsTrigger>
            <TabsTrigger value="highlights">Highlights</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button disabled>
                  <PlusSquare className="mr-2 h-4 w-4" />
                  New Post
                </Button>
              </div>
              {isDemoUser ? (
                <div className="space-y-4">
                  {mockPosts.map((post) => (
                    <PostCard key={post.id} post={post} authorName={name} authorHandle={username} />
                  ))}
                </div>
              ) : (
                <Card className="glass mt-4">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center h-48 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-lg font-semibold">No Posts Yet</p>
                      <p className="text-sm text-muted-foreground">When this user makes a post, it'll show up here.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
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
      </div>
    </>
  );
}
