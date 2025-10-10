import { bannerImageOne } from "@/assets";

// Navigation data - will be translated by components using useTranslations
export const navigationKeys = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "categories", href: "/categories" },
  { key: "offers", href: "/offers" },
];

export const infoNavigationKeys = [
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
  { key: "inquiry", href: "/inquiry" },
  { key: "faqs", href: "/faqs" },
];

// Banner data - keys for translation
export const bannerKeys = {
  _id: 1001,
  priceTextKey: "banner.priceText",
  titleKey: "banner.title",
  textOneKey: "banner.textOne",
  offerPrice: "-30%",
  textTwoKey: "banner.textTwo",
  buttonTextKey: "banner.buttonText",
  buttonLink: "/products",
  image: { src: bannerImageOne },
};
