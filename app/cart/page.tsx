
///This handles the cart page

///Libraries -->
import Cart from "@/components/cart/Cart"
import SimilarProduct from "@/components/product/topProduct/topProduct"
import { IProduct } from "@/config/interfaces";
import { domainName, shuffleArray } from "@/config/utils";
import { Metadata } from "next";

///Commencing the code
export const metadata: Metadata = {
  title: 'Cart',
  description: `Add products to your cart and checkout.`,
  alternates: {
    canonical: `/cart`
  }
}

///This fetches a list of all products
async function getProducts() {
  try {
    const res = await fetch(`${domainName}/api/product?action=order`, {
      method: "GET",
      cache: "no-store",
    })

    if (res.ok) {
      return res.json()
    } else {
      getProducts()
    }
  } catch (error) {
      console.error(error);
  }
}

/**
 * @title Homepage
 */
export default async function CartPage() {
  const products = shuffleArray(await getProducts()) as unknown as Array<IProduct>

  return (
    <main className="cart_page">
      <Cart />
      <SimilarProduct product_={products}/>
    </main>
  )
}
