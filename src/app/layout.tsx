
import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
});

const APP_NAME = "SynqAI";
const APP_DEFAULT_TITLE = "SynqAI: Your Secure AI Crypto Wallet Assistant";
const APP_DESCRIPTION = "Analyze crypto wallets, assess risks, and gain actionable insights with our AI-powered dashboard. Secure, intuitive, and insightful on-chain analysis.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: "%s | SynqAI",
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: "%s | SynqAI",
    },
    description: APP_DESCRIPTION,
    url: new URL('https://synq.ai'), // Replace with your production URL
    images: [
      {
        url: '/og-image.png', // Replace with your Open Graph image URL
        width: 1200,
        height: 630,
        alt: 'SynqAI Banner',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: "%s | SynqAI",
    },
    description: APP_DESCRIPTION,
    images: ['/og-image.png'], // Replace with your Twitter image URL
  },
  metadataBase: new URL('https://synq.ai'), // Replace with your production URL
  keywords: ['crypto', 'wallet', 'ai', 'analysis', 'security', 'ethereum', 'web3', 'blockchain', 'nft', 'defi'],
  robots: {
    index: true,
    follow: true,
  },
   alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  }
};

export const viewport: Viewport = {
  themeColor: "#6750A4",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, spaceGrotesk.variable, "font-body antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
