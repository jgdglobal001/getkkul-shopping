import Container from "./Container";
import { logo } from "@/assets";
import SocialLink from "./SocialLink";
import Title from "./Title";
import { FaFacebook } from "react-icons/fa";
import { infoNavigationKeys } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { BsEnvelopeAt } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { useTranslations, useLocale } from 'next-intl';

const Footer = () => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="bg-light-bg py-10 lg:py-20">
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="flex flex-col items-start gap-y-5">
          <Link href={`/${locale}`}>
            <Image src={logo} alt="logo" width={224} height={80} />
          </Link>
          <p>
            {t('footer.description')}
          </p>
          <SocialLink />
        </div>
        <div>
          <Title>{t('footer.myAccount')}</Title>
          <div className="mt-3 flex flex-col gap-y-2">
            {infoNavigationKeys?.map((item: any) => (
              <Link
                key={item?.key}
                href={`/${locale}${item?.href}`}
                className="flex items-center gap-x-2 text-gray-700 hover:text-theme-color duration-200 font-medium"
              >
                <GoDotFill size={10} />
                {t(`common.${item?.key}`)}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <Title>{t('footer.information')}</Title>
          <div className="mt-3 flex flex-col gap-y-2">
            {infoNavigationKeys?.map((item: any) => (
              <Link
                key={item?.key}
                href={`/${locale}${item?.href}`}
                className="flex items-center gap-x-2 text-gray-700 hover:text-theme-color duration-200 font-medium"
              >
                <GoDotFill size={10} />
                {t(`common.${item?.key}`)}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <Title>{t('footer.followUs')}</Title>
          <div className="mt-3 flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2">
              <GrLocation className="text-theme-color" />
              <span className="text-gray-700">
                {t('footer.address')}
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <BsEnvelopeAt className="text-theme-color" />
              <span className="text-gray-700">{t('footer.email')}</span>
            </div>
            <div className="flex items-center gap-x-2">
              <FaFacebook className="text-theme-color" />
              <span className="text-gray-700">{t('footer.social')}</span>
            </div>
          </div>
          <div className="mt-5">
            <h4 className="font-semibold text-gray-900 mb-3">
              {t('footer.newsletter')}
            </h4>
            <div className="flex">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-theme-color focus:border-transparent"
              />
              <button className="px-4 py-2 bg-theme-color text-white rounded-r-md hover:bg-theme-color/90 transition-colors">
                {t('footer.subscribe')}
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {t('footer.newsletterDesc')}
            </p>
          </div>
        </div>
      </Container>
      <Container className="mt-10 pt-5 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            {t('footer.copyright')}
          </p>
          <div className="flex gap-4 text-sm text-gray-600">
            <Link href={`/${locale}/privacy`} className="hover:text-theme-color">
              {t('footer.privacy')}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-theme-color">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
