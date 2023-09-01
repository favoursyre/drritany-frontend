"use Client"
///This handles the products page

///Libraries -->
import ProductInfo from '../../components/product/productInfo/productInfo';
import SimilarProduct from '@/app/components/product/topProduct/topProduct';
import { backend, shuffleArray } from '@/app/utils/utils';

///Commencing the code

///This fetches the product info page
async function getProduct(id: string) {
  try {
      const response = await fetch(
          `${backend}/product/info/${id}`,
          {
            next: {
              revalidate: 60,
            },
          }
        );
      
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      
        const product = await response.json();
        return product;
  } catch (error) {
      console.error(error);
  }
}

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
 * @title Product info page
 */
export default async function ProductByIdPage({ params: { id } }: { params: { id: string }}) {
  const product = await getProduct(id)
  const products = shuffleArray(await getProducts())

  return (
    <main className="product_info_page">
      <ProductInfo product_={product} />
      <SimilarProduct product_={products}/>
    </main>
  )
}
