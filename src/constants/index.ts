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

export const banner = {
  _id: 1001,
  priceText: "Starting at $999.90",
  title: "The best tablet Collection 2024",
  textOne: "Exclusive offer",
  offerPrice: "-30%",
  textTwo: "off this week",
  buttonLink: "/products",
  image: { src: bannerImageOne },
};
