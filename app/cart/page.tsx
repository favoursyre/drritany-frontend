
///This handles the cart page

///Libraries -->
//import Cart from "@/components/cart/Cart"
import ProductSlide from "@/components/product/productSlide/ProductSlide"
import { IProduct, ISlideTitle } from "@/config/interfaces";
import { backend, shuffleArray, sortProductByActiveStatus, getProducts } from "@/config/utils";
import { Metadata } from "next";
import dynamicImport from "next/dynamic";
//const Cart = dynamicImport(() => import("@/components/cart/Cart"), { ssr: false })
import { Suspense } from "react";
import Cart from "@/components/cart/Cart";
import Loading from "@/components/loadingCircle/Circle";

///Commencing the code
export const metadata: Metadata = {
  title: 'Cart',
  description: `Add products to your cart and checkout.`,
  alternates: {
    canonical: `/cart`
  }
}
 
// This component passed as fallback to the Suspense boundary
// will be rendered in place of the search bar in the initial HTML.
// When the value is available during React hydration the fallback
// will be replaced with the `<SearchBar>` component.
function Fallback() {
  return <Loading width="20px" height="20px" />
}

//export const dynamic = "force-dynamic"

/**
 * @title Homepage
 */
export default async function CartPage() {
  //const products = sortProductByActiveStatus(shuffleArray(await getProducts()), "Active") as unknown as Array<IProduct>
  const titles1: ISlideTitle = {
    slideTitleId: 2,
    barTitleId: 2
  }

  return (
    <main className="cart_page">
      <Suspense fallback={<Fallback />}>
          <Cart />
      </Suspense>
      <ProductSlide _product={undefined} title_={titles1} view_={"cartSlide1"}/>
    </main>
  )
}
