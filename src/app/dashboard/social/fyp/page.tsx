
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function FypPage() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>For You</CardTitle>
        <CardDescription>
          A curated feed of content tailored to your interests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground">
          <Sparkles className="h-24 w-24 mb-6 text-primary/50" />
          <h2 className="text-2xl font-semibold text-foreground">
            "For You" Feed Coming Soon!
          </h2>
          <p className="max-w-md mt-2">
            We're working on a personalized content feed based on your interests
            and wallet activity. Stay tuned!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
