"use client";

import { useSelector } from "react-redux";
import { StateType } from "../../../type";
import Link from "next/link";
import { BiShoppingBag } from "react-icons/bi";
import { useState, useEffect } from "react";
import { useLocale } from 'next-intl';

const CartIcon = () => {
  const [isClient, setIsClient] = useState(false);
  const { cart } = useSelector((state: StateType) => state?.getkkul);
  const locale = useLocale();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return static version for SSR
    return (
      <Link href={`/${locale}/cart`} className="text-2xl relative">
        <BiShoppingBag />
        <span className="absolute -top-1 -right-1 text-[10px] font-medium w-4 h-4 bg-theme-color text-white rounded-full flex items-center justify-center">
          0
        </span>
      </Link>
    );
  }

  return (
    <Link href={`/${locale}/cart`} className="text-2xl relative">
      <BiShoppingBag />
      <span className="absolute -top-1 -right-1 text-[10px] font-medium w-4 h-4 bg-theme-color text-white rounded-full flex items-center justify-center">
        {cart?.length > 0 ? cart?.length : "0"}
      </span>
    </Link>
  );
};

export default CartIcon;
