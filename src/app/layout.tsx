import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Getkkul - Multipurpose eCommerce website",
  description: "Test application for education purpose",
  icons: {
    icon: '/getkkul-logo-left-right.png',
    shortcut: '/getkkul-logo-left-right.png',
    apple: '/getkkul-logo-left-right.png',
  },
};

// This layout only handles non-localized routes
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
