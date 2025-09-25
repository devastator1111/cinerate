import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CineRate",
  description: "A movie rating application",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`min-h-screen antialiased ${geistSans.variable} ${geistMono.variable}`} style={{background: 'var(--bg)', color: 'var(--foreground, #e6eef8)'}}>
        <Navbar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}