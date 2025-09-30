import BottomHeader from "./BottomHeader";
import MiddleHeader from "./MiddleHeader";
import TopHeader from "./TopHeader";
import { auth } from "@/lib/auth/better-auth";
import { headers } from "next/headers";

const Header = async () => {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: Object.fromEntries(headersList.entries()) });
  const freeShippingThreshold =
    process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "1000";
  return (
    <header className="w-full bg-theme-white sticky top-0 z-50">
      {/* TopHeader */}
      <TopHeader freeShippingThreshold={freeShippingThreshold} />
      <div>
        {/* Middle Header */}
        <MiddleHeader session={session} />
        {/* BottomHeader */}
        <BottomHeader session={session} />
      </div>
    </header>
  );
};

export default Header;
