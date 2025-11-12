
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Rocket, Sparkles } from 'lucide-react';

interface ComingSoonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function ComingSoonDialog({ open, onOpenChange, onContinue }: ComingSoonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Rocket className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-headline">Connection Successful!</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Live wallet data importation is coming soon. For now, you can explore the full power of SynqAI with a feature-rich demo account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={onContinue} className="w-full" size="lg">
            <Sparkles className="mr-2 h-4 w-4" />
            Explore the Demo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
