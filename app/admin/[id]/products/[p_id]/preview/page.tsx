"use Client"
///This handles the product preview page

///Libraries -->
import ProductInfo from '@/components/product/productInfo/productInfo';
import SimilarProduct from '@/components/product/productSlide/ProductSlide';
import RecommendedProduct from '@/components/product/productSlide/ProductSlide';
import { shuffleArray, backend, removeProductFromArray, sortProductsBySimilarity } from '@/config/utils';
import { Metadata } from 'next';
import { IProduct, Props } from '@/config/interfaces';

///Commencing the code -->

///This fetches the product info page
async function getProduct(id: string) {
  try {
    const res = await fetch(`${backend}/product/${id}`, {
      method: "GET",
      cache: "no-store",
    })

    if (res.ok) {
      return res.json()
    } else {
      console.log("not refetching: ", res)
      //getProduct(id)
    }
    
    } catch (error) {
        console.log("Check: ", error)
        console.error(error);
    }
}


///Declaring the metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product: Array<IProduct> | undefined = await getProduct(params.id)
  if (!product || product?.length === 0) {
    return {
      title: "Not found",
      description: "Page not found"
    }
  } else {
    return {
      title: `${product[0].name}`,
      description: `${product[0].description}`,
      alternates: {
        canonical: `/products/${params.id}`
      }
    }
  }
}

/**
 * @title Product preview page
 */
export default async function ProductPreviewPage({ params: { p_id } }: { params: { p_id: string }}) {
  const product = await getProduct(p_id) as unknown as Array<IProduct>
  console.log('Producthhs: ', product)

  return (
    <main className="product_info_page">
      <ProductInfo product_={product[0]} />
      {/* <RecommendedProduct product_={products} titleId_={2} /> */}
    </main>
  )
}
