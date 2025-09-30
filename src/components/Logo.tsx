import { logo } from "@/assets";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"}>
      <Image src={logo} alt="logo" width={224} height={80} className="w-40 md:w-56" />
    </Link>
  );
};

export default Logo;
