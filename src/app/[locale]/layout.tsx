import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { UserSyncProvider } from "@/components/UserSyncProvider";
import Head from "next/head";
import PurchaseWidget from "@/components/PurchaseWidget";
import StateProvider from "@/components/auth/StateProvider";

import ClientOnly from "@/components/common/ClientOnly";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Getkkul - Multipurpose eCommerce website",
  description: "Test application for education purpose",
  icons: {
    icon: '/getkkul-logo-left-right.png',
    shortcut: '/getkkul-logo-left-right.png',
    apple: '/getkkul-logo-left-right.png',
  },
};

// 정적 빌드를 위한 generateStaticParams 함수
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ko' },
    { locale: 'zh' }
  ];
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Await params for Next.js 15 compatibility
  const { locale } = await params;

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <ErrorBoundary>
          <NextIntlClientProvider messages={messages}>
            <StateProvider>
              <AuthProvider>
                <UserSyncProvider>
                  <CurrencyProvider>{children}</CurrencyProvider>
                  <PurchaseWidget />
                </UserSyncProvider>
              </AuthProvider>
            </StateProvider>
          </NextIntlClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
