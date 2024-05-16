"use Client"
///This handles the products page

///Libraries -->
import ProductInfo from '@/components/product/productInfo/ProductInfo';
import SimilarProduct from '@/components/product/productSlide/ProductSlide';
import { shuffleArray, domainName, removeProductFromArray } from '@/config/utils';
import { Metadata } from 'next';
import { IProduct, Props } from '@/config/interfaces';

///Commencing the code -->

///This fetches the product info page
async function getProduct(id: string) {
  try {
    const res = await fetch(`${domainName}/api/product/${id}`, {
      method: "GET",
      cache: "no-store",
    })

    if (res.ok) {
      return res.json()
    } else {
      console.log("not refetching")
      //getProduct(id)
    }
    
  } catch (error) {
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

//This function sets the products
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
 * @title Product info page
 */
export default async function ProductByIdPage({ params: { id } }: { params: { id: string }}) {
  const product = await getProduct(id) as unknown as Array<IProduct>
  const products_ = await getProducts() as unknown as Array<IProduct>
  const products = shuffleArray(removeProductFromArray(product[0], products_))

  return (
    <main className="product_info_page">
      <ProductInfo product_={product} />
      <SimilarProduct product_={products}/>
    </main>
  )
}
