
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const socialNavItems = [
  { href: "/dashboard/social/fyp", label: "For You" },
  { href: "/dashboard/social/community", label: "Community" },
  { href: "/dashboard/social/messages", label: "Messages" },
];

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Social</h1>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {socialNavItems.map((item) => (
                <Button 
                    key={item.href}
                    variant={pathname === item.href ? "default" : "ghost"}
                    asChild
                    className="shrink-0"
                >
                    <Link href={item.href}>{item.label}</Link>
                </Button>
            ))}
        </div>
        <Separator />
        <div>
            {children}
        </div>
      </div>
    </>
  );
}
