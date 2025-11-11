
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CommunityPage() {
  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Community</h1>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle>Join the SynqAI Community</CardTitle>
          <CardDescription>
            Connect with other users, share insights, and get support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground">
            <Users className="h-24 w-24 mb-6 text-primary/50" />
            <h2 className="text-2xl font-semibold text-foreground">
              Community Hub Coming Soon!
            </h2>
            <p className="max-w-md mt-2">
              We're building a space for you to connect with fellow crypto enthusiasts.
              Stay tuned for forums, chat channels, and exclusive events.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
