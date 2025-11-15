
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function MessagesPage() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
        <CardDescription>
          Your private and secure conversations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground">
          <Mail className="h-24 w-24 mb-6 text-primary/50" />
          <h2 className="text-2xl font-semibold text-foreground">
            Direct Messaging Coming Soon!
          </h2>
          <p className="max-w-md mt-2">
            Securely message other users on the platform. Wallet-to-wallet
            communication is on our roadmap.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
