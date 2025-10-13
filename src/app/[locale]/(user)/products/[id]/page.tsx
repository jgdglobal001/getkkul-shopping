import Container from "@/components/Container";
import { ProductType } from "../../../../../../type";
import AddToCartButton from "@/components/AddToCartButton";
import { getData } from "../../../../(user)/helpers";
import ProductImages from "@/components/ProductImages";
import PriceFormat from "@/components/PriceFormat";
import { FaRegEye } from "react-icons/fa";
import { paymentImage } from "@/assets";
import { MdStar } from "react-icons/md";
import ProductPrice from "@/components/ProductPrice";
import ProductFeatures from "@/components/ProductFeatures";
import ProductSpecifications from "@/components/ProductSpecifications";
import RelatedProducts from "@/components/RelatedProducts";
import { getTranslations } from 'next-intl/server';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// 정적 빌드를 위한 generateStaticParams 함수
export async function generateStaticParams() {
  try {
    // 모든 제품 ID를 가져와서 정적 페이지 생성
    const endpoint = "https://dummyjson.com/products?limit=100";
    const data = await getData(endpoint);
    const products: ProductType[] = data.products || [];

    return products.map((product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
}

const SingleProductPage = async ({ params }: Props) => {
  const { id } = await params;
  const t = await getTranslations();
  const endpoint = `https://dummyjson.com/products/${id}`;
  const product: ProductType = await getData(endpoint);

  // Fetch related products for the same category
  const allProductsEndpoint = "https://dummyjson.com/products?limit=0";
  const allProductsData = await getData(allProductsEndpoint);
  const allProducts: ProductType[] = allProductsData.products || [];

  const regularPrice = product?.price;
  const discountedPrice = product?.price + product?.discountPercentage / 100;

  // Helper function to get category key for translations
  const getCategoryKey = (slug: string): string => {
    const keyMap: { [key: string]: string } = {
      'beauty': 'beauty',
      'fragrances': 'fragrances',
      'furniture': 'furniture',
      'groceries': 'groceries',
      'home-decoration': 'homeDecoration',
      'kitchen-accessories': 'kitchenAccessories',
      'laptops': 'laptops',
      'mens-shirts': 'mensShirts',
      'mens-shoes': 'mensShoes',
      'mens-watches': 'mensWatches',
      'mobile-accessories': 'mobileAccessories',
      'motorcycle': 'motorcycle',
      'skin-care': 'skincare',
      'smartphones': 'smartphones',
      'sports-accessories': 'sportsAccessories',
      'sunglasses': 'sunglasses',
      'tablets': 'tablets',
      'tops': 'tops',
      'vehicle': 'vehicle',
      'womens-bags': 'womensBags',
      'womens-dresses': 'womensDresses',
      'womens-jewellery': 'womensJewellery',
      'womens-shoes': 'womensShoes',
      'womens-watches': 'womensWatches',
    };
    return keyMap[slug] || slug;
  };

  return (
    <div>
      <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10">
        {/* Product Image */}
        <ProductImages images={product?.images} />
        {/* Product Details */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">{product?.title}</h2>
          <div className="flex items-center justify-between">
            <ProductPrice
              regularPrice={regularPrice}
              discountedPrice={discountedPrice}
              product={product}
            />

            <div className="flex items-center gap-1">
              <div className="text-base text-light-text flex items-center">
                {Array.from({ length: 5 }).map((_, index) => {
                  const filled = index + 1 <= Math.floor(product?.rating);
                  return (
                    <MdStar
                      key={index}
                      className={`${
                        filled ? "text-orange-500" : "text-gray-300"
                      }`}
                    />
                  );
                })}
              </div>
              <p className="text-base font-semibold">{`(${product?.rating?.toFixed(
                1
              )} reviews)`}</p>
            </div>
          </div>
          <p className="flex items-center">
            <FaRegEye className="mr-1" />{" "}
            <span className="font-semibold mr-1">250+</span> 명이 지금 이 상품을 보고 있습니다
          </p>
          <p>
            구매 시{" "}
            <span className="text-base font-semibold text-green-500">
              <PriceFormat amount={product?.discountPercentage / 100} />
            </span>{" "}
            를 절약하실 수 있습니다
          </p>
          <div>
            <p className="text-sm tracking-wide">{product?.description}</p>
            <p className="text-base">{product?.warrantyInformation}</p>
          </div>
          <p>
            {t('product.brand')}: <span className="font-medium">{product?.brand}</span>
          </p>
          <p>
            {t('common.categories')}:{" "}
            <span className="font-medium capitalize">
              {t(`categories.${getCategoryKey(product?.category)}`) || product?.category}
            </span>
          </p>
          <p>
            {t('product.tags')}:{" "}
            {product?.tags?.map((item, index) => (
              <span key={index.toString()} className="font-medium capitalize">
                {item}
                {index < product?.tags?.length - 1 && ", "}
              </span>
            ))}
          </p>

          <AddToCartButton
            product={product}
            className=" rounded-md uppercase font-semibold"
          />

          <div className="bg-[#f7f7f7] p-5 rounded-md flex flex-col items-center justify-center gap-2">
            <img
              src={paymentImage.src}
              alt="payment"
              className="w-auto object-cover"
            />
            <p className="font-semibold">안전하고 보안된 결제를 보장합니다</p>
          </div>
        </div>
      </Container>

      {/* Product Features */}
      <Container>
        <ProductFeatures />
      </Container>

      {/* Product Specifications */}
      <Container className="pb-10">
        <ProductSpecifications product={product} />
      </Container>

      {/* Related Products */}
      <Container className="pb-16">
        <RelatedProducts 
          allProducts={allProducts} 
          currentProduct={product} 
        />
      </Container>
    </div>
  );
};

export default SingleProductPage;
