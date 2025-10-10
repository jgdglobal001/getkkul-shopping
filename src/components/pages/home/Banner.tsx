import Container from "@/components/Container";
import Button from "@/components/ui/Button";
import { bannerKeys } from "@/constants";
import { GoArrowRight } from "react-icons/go";
import { getTranslations } from 'next-intl/server';

const Banner = async () => {
  const t = await getTranslations();

  return (
    <div className="bg-[#115061] py-20 text-theme-white">
      <Container className="flex items-center justify-between">
        <div className="flex flex-col gap-5">
          <p className="text-base font-semibold">{t(bannerKeys.priceTextKey)}</p>
          <h2 className="text-5xl font-bold max-w-[500px]">{t(bannerKeys.titleKey)}</h2>
          <p className="text-lg font-bold">
            {t(bannerKeys.textOneKey)}{" "}
            <span className="text-light-yellow mx-1">{bannerKeys.offerPrice}</span>
            {t(bannerKeys.textTwoKey)}
          </p>
          <Button
            href={bannerKeys.buttonLink}
            className="flex items-center gap-1 bg-theme-white text-black rounded-md w-32 px-0 justify-center text-sm font-semibold hover:bg-transparent hover:text-theme-white py-3 border border-transparent hover:border-white/40 duration-200"
          >
            {t(bannerKeys.buttonTextKey)} <GoArrowRight className="text-lg" />
          </Button>
        </div>
        <div>
          <img src={bannerKeys.image.src} alt="bannerImageOne" />
        </div>
      </Container>
    </div>
  );
};

export default Banner;
