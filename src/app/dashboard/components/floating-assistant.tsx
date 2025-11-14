
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BotMessageSquare } from "lucide-react";
import { ChatInterface } from "@/app/dashboard/assistant/components/chat-interface";

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
          size="icon"
        >
          <BotMessageSquare className="h-8 w-8" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-full sm:max-w-4xl p-0 glass" side="right">
        <SheetHeader>
            <SheetTitle className="sr-only">AI Assistant</SheetTitle>
        </SheetHeader>
        <ChatInterface />
      </SheetContent>
    </Sheet>
  );
}
