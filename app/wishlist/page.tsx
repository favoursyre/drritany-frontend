
///This handles the cart page

///Libraries -->
//import Cart from "@/components/cart/Cart"
import HomeCampaignB from "@/components/campaigns/homeCampaignB/homeCampaignB";
import ProductSlide from "@/components/product/productSlide/ProductSlide"
import { IProduct, ISlideTitle } from "@/config/interfaces";
import { backend, shuffleArray, sortProductByActiveStatus, getProducts } from "@/config/utils";
import { Metadata } from "next";
import dynamicImport from "next/dynamic";
const Cart = dynamicImport(() => import("@/components/cart/Cart"), { ssr: false })
import { Suspense } from "react";

///Commencing the code
export const metadata: Metadata = {
  title: 'Wishlist',
  description: `Explore your wish lists`,
  alternates: {
    canonical: `/wishlist`
  }
}

export const dynamic = "force-dynamic"

/**
 * @title Homepage
 */
export default async function CartPage() {
  //const products = sortProductByActiveStatus(shuffleArray(await getProducts()), "Active") as unknown as Array<IProduct>
  const titles1: ISlideTitle = {
    slideTitleId: 6,
    barTitleId: 3
  }
  const titles2: ISlideTitle = {
    slideTitleId: 2,
    barTitleId: 2
  }

  return (
    <main className="cart_page">
      <ProductSlide _product={undefined} title_={titles1} view_={"wishSlide1"}/>
      {/* <HomeCampaignB /> */}
      <ProductSlide _product={undefined} title_={titles2} view_={"wishSlide2"}/>
    </main>
  )
}
