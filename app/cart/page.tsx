
///This handles the cart page

///Libraries -->
import Cart from "../components/cart/Cart"
import SimilarProduct from "../components/product/topProduct/topProduct"
import { backend, shuffleArray } from "../utils/utils";

///Commencing the code
///This fetches a list of all products
async function getProducts() {
  try {
      const response = await fetch(
          `${backend}/products`,
          {
            next: {
              revalidate: 60,
            },
          }
        );
      
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      
        const quotes = await response.json();
        return quotes;
  } catch (error) {
      console.error(error);
  }
}

/**
 * @title Homepage
 */
export default async function CartPage() {
  const products = shuffleArray(await getProducts())

  return (
    <main className="cart_page">
      <Cart />
      <SimilarProduct product_={products}/>
    </main>
  )
}
