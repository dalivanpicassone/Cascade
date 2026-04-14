import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { AppHeader } from "@/components/shared/AppHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cascade",
  description: "Управление партнёрами, проектами и договорами",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-1 flex-col w-full min-w-0">
            <AppHeader />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
