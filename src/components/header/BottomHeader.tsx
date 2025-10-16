"use client";
import Container from "../Container";
import Link from "next/link";
import { navigationKeys } from "@/constants";
import { useAppSession as useSession } from "@/hooks/useAppSession";
import SignOutButton from "./SignOutButton";
import { useTranslations, useLocale } from 'next-intl';

const BottomHeader = () => {
  const { data: session } = useSession();
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="border-b border-b-gray-400">
      <Container className="flex items-center justify-between py-1">
        <div className="text-xs md:text-sm font-medium flex items-center gap-5">
          {navigationKeys?.map((item) => (
            <Link key={item?.key} href={`/${locale}${item?.href}`}>
              {t(`common.${item?.key}`)}
            </Link>
          ))}
          <SignOutButton session={session} />
        </div>
        <p className="text-xs text-gray-400 font-medium hidden md:inline-flex">
          {t('common.contact')}: <span className="text-black">+88 01012345678</span>
        </p>
      </Container>
    </div>
  );
};

export default BottomHeader;
