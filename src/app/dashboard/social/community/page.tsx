
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MessageSquare, Plus, Users, Eye } from "lucide-react";

const mockThreads = [
  {
    id: 1,
    title: "What are your top 3 low-cap gems for this cycle?",
    author: "CryptoGigaChad",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&h=500&fit=crop",
    category: "Speculation",
    replies: 128,
    views: "12.1K",
    lastReply: "2h ago",
  },
  {
    id: 2,
    title: "Security Best Practices: How I protect my assets",
    author: "DeFiShield",
    authorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500&h=500&fit=crop",
    category: "Security",
    replies: 42,
    views: "8.9K",
    lastReply: "1d ago",
  },
  {
    id: 3,
    title: "New Airdrop Farming Strategy for LayerZero",
    author: "AirdropHunter",
    authorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&fit=crop",
    category: "Airdrops",
    replies: 256,
    views: "25.3K",
    lastReply: "3d ago",
  },
   {
    id: 4,
    title: "Rate my NFT portfolio - any suggestions?",
    author: "NFTCollector123",
    authorAvatar: "https://images.unsplash.com/photo-1628157588553-5ee30a6c26e3?w=500&h=500&fit=crop",
    category: "NFTs",
    replies: 78,
    views: "5.6K",
    lastReply: "5d ago",
  },
];

const mockAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

export default function CommunityPage() {
  const { address } = useWallet();
  const isDemoUser = address?.toLowerCase() === mockAddress.toLowerCase();
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

  return (
    <Card className="glass">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle>Community Discussions</CardTitle>
          <CardDescription>
            Connect with other users, share insights, and get support.
          </CardDescription>
        </div>
        {isDemoUser && (
            <Button disabled className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4"/>
                New Discussion
            </Button>
        )}
      </CardHeader>
      <CardContent>
        {!isDemoUser ? (
          <div className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground">
            <Users className="h-24 w-24 mb-6 text-primary/50" />
            <h2 className="text-2xl font-semibold text-foreground">
              Community Hub Coming Soon!
            </h2>
            <p className="max-w-md mt-2">
              We're building a space for you to connect with fellow crypto
              enthusiasts. Stay tuned for forums, chat channels, and
              exclusive events.
            </p>
          </div>
        ) : (
           <div className="space-y-4">
            {mockThreads.map((thread) => (
              <Card key={thread.id} className="glass hover:bg-muted/50 cursor-pointer">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={thread.authorAvatar} alt={thread.author}/>
                      <AvatarFallback>{thread.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 sm:hidden">
                       <p className="font-semibold text-base">{thread.title}</p>
                        <p className="text-sm text-muted-foreground">
                          by {thread.author}
                        </p>
                    </div>
                  </div>
                  <div className="flex-1 hidden sm:block">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-base">{thread.title}</p>
                      <Badge variant="outline">{thread.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      by {thread.author} • last reply {thread.lastReply}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-muted-foreground text-sm self-start sm:self-center shrink-0 pt-2 sm:pt-0">
                      <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4"/>
                          <span>{thread.replies}</span>
                      </div>
                       <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4"/>
                          <span>{thread.views}</span>
                      </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
