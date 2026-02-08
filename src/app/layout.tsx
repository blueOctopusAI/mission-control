import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import LiveRefresh from "@/components/layout/LiveRefresh";

export const metadata: Metadata = {
  title: "Mission Control — Blue Octopus Technology",
  description: "Project command center and intelligence dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-auto bg-grid bg-glow">
            {children}
          </main>
        </div>
        <LiveRefresh />
      </body>
    </html>
  );
}
