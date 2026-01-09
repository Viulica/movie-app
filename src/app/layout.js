import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { Toaster } from "@/components/ui/sonner";
import { AccessibilityProvider } from "@/hooks/useAccessibility";
import { ThemeApplier } from "@/components/ThemeApplier";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Filmovi app",
  description: "Aplikacija za dohvat i upravljanje filmovima",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AccessibilityProvider>
          <ThemeApplier />
          <SessionProvider>{children}</SessionProvider>
          <Toaster />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
