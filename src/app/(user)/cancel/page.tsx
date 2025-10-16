import Container from "@/components/Container";
import Title from "@/components/Title";
import Button from "@/components/ui/Button";
import React from "react";
import { getLocale, getTranslations } from 'next-intl/server';

export default async function CancelPage() {
  const locale = await getLocale();
  const t = await getTranslations();
  return (
    <Container className="py-10">
      <Title>{t('checkout.paymentCancelled') ?? 'Your payment has been cancelled'}</Title>
      <p className="text-base tracking-wide max-w-3xl mt-1">
        {t('checkout.paymentCancelledDesc') ?? 'Your payment was cancelled. You can continue shopping or view your cart.'}
      </p>
      <div className="mt-5 flex items-center gap-x-5">
        <Button href={`/${locale}/`} className=" rounded-md">
          {t('cart.continueShopping')}
        </Button>
        <Button href={`/${locale}/cart`} className=" rounded-md">
          {t('cart.title')}
        </Button>
      </div>
    </Container>
  );
}
