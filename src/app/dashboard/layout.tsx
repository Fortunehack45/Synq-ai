
"use client";

import Link from "next/link";
import {
  Bell,
  CreditCard,
  Dog,
  Home,
  Menu,
  Package,
  Repeat,
  ScanLine,
  Settings,
  User,
  MessageSquare,
  WifiOff,
  X,
  Bot,
  BotMessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { WalletProvider } from "@/context/wallet-provider";
import { useWallet } from "@/hooks/use-wallet";
import { useEffect, useState, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatInterface } from "@/app/dashboard/assistant/components/chat-interface";


const FloatingAssistant = dynamic(() => Promise.resolve(function FloatingAssistant() {
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
        <div className="h-full overflow-y-auto">
          <ChatInterface />
        </div>
      </SheetContent>
    </Sheet>
  );
}), { ssr: false });


const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/transactions", icon: Package, label: "Transactions" },
  { href: "/dashboard/trade", icon: Repeat, label: "Trade" },
  { href: "/dashboard/assistant", icon: Bot, label: "AI Assistant" },
  { href: "/dashboard/coin-scan", icon: ScanLine, label: "Coin Scan" },
  { href: "/dashboard/meme-coins", icon: Dog, label: "Meme Coins" },
  { href: "/dashboard/social/fyp", icon: MessageSquare, label: "Social" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

function LoadingSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center text-center">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Logo className="h-16 w-16 mb-2 animate-pulse" />
        <h2 className="text-lg font-semibold text-foreground">Connecting to Wallet...</h2>
        <p className="max-w-xs">Please wait while we sync your on-chain data.</p>
        <Skeleton className="h-4 w-48 mt-2" />
      </div>
    </div>
  )
}

function SlowLoadMessage() {
  return (
      <div className="flex h-screen w-full items-center justify-center text-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
             <WifiOff className="h-12 w-12" />
             <h2 className="text-lg font-semibold text-foreground">Still Connecting...</h2>
             <p className="max-w-xs">
                This is taking longer than expected. Please check your internet connection and ensure your API keys in Settings are correct.
             </p>
          </div>
      </div>
  )
}


function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { disconnectWallet, address, loading } = useWallet();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showSlowLoadMessage, setShowSlowLoadMessage] = useState(false);
  const [isUpgradeCardVisible, setIsUpgradeCardVisible] = useState(false);

  useEffect(() => {
    // Check if the card was dismissed previously
    const isCardDismissed = localStorage.getItem("upgradeCardDismissed");
    if (isCardDismissed !== "true") {
      setIsUpgradeCardVisible(true);
    }
  }, []);

  const handleDismissUpgradeCard = () => {
    // Hide the card and save the state to localStorage
    setIsUpgradeCardVisible(false);
    localStorage.setItem("upgradeCardDismissed", "true");
  };


  useEffect(() => {
    // This effect handles route protection for the dashboard.
    if (!loading) {
      if (!address) {
        // If not logged in, redirect to login page.
        router.push('/login');
        return;
      }
      
      const onboardingComplete = localStorage.getItem(`onboarding_complete_${address}`);
      if (!onboardingComplete) {
        // If logged in but onboarding is not complete, redirect to onboarding.
        router.push('/onboarding');
      }
    }
  }, [address, loading, router]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        // Prevent default browser behavior for these shortcuts
        if (["a", "l", "b", "s"].includes(event.key.toLowerCase())) {
          event.preventDefault();
        }

        switch (event.key.toLowerCase()) {
          case "a":
            router.push("/dashboard/profile");
            break;
          case "l":
            disconnectWallet();
            break;
          case "b":
            router.push("/dashboard/billing");
            break;
          case "s":
            router.push("/dashboard/settings");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, disconnectWallet]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setShowSlowLoadMessage(true);
      }, 15000); // 15 seconds
    } else {
      setShowSlowLoadMessage(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  // While loading or if the user is not properly authenticated/onboarded, show a loader.
  // The useEffect hook above will handle the redirection.
  if (loading || !address || !localStorage.getItem(`onboarding_complete_${address}`)) {
    return showSlowLoadMessage ? <SlowLoadMessage /> : <LoadingSkeleton />;
  }

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    if (href === '/dashboard/social/fyp') {
      return pathname.startsWith('/dashboard/social');
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/20 md:block glass sticky top-0 h-screen">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold" prefetch={false}>
              <Logo className="h-6 w-6" />
              <span className="font-headline text-lg tracking-tight">SynqAI</span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all active:scale-95",
                     isLinkActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          {isUpgradeCardVisible && (
            <div className="mt-auto p-4 relative animate-in fade-in-50 slide-in-from-bottom-2">
              <Card className="bg-transparent">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={handleDismissUpgradeCard}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss</span>
                </Button>
                <CardHeader className="p-2 pt-0 md:p-4">
                  <CardTitle>Upgrade to Pro</CardTitle>
                  <CardDescription>
                    Unlock all features and get unlimited access to our support
                    team.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                  <Button size="sm" className="w-full" onClick={() => router.push('/dashboard/billing')}>
                    Upgrade
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/20 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30 glass">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col glass p-0">
               <SheetHeader className="p-6 pb-0">
                 <SheetTitle>
                   <Link
                    href="#"
                    prefetch={false}
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                  >
                    <Logo className="h-6 w-6" />
                    <span>SynqAI</span>
                  </Link>
                 </SheetTitle>
               </SheetHeader>
              <nav className="grid gap-2 text-lg font-medium p-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    onClick={() => setIsSheetOpen(false)}
                    className={cn(
                      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all active:scale-95",
                       isLinkActive(item.href)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add a search here if needed */}
          </div>
          <ThemeToggle />
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-x-hidden">
          <Suspense>
            {children}
          </Suspense>
        </main>
        <FloatingAssistant />
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </WalletProvider>
  )
}
