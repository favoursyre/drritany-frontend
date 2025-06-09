"use Client"
///This handles the products page

///Libraries -->
import ProductInfo from '@/components/product/productInfo/productInfo';
import SimilarProduct from '@/components/product/productSlide/ProductSlide';
import HomeCampaignB from '@/components/campaigns/homeCampaignB/homeCampaignB';
import RecommendedProduct from '@/components/product/productSlide/ProductSlide';
import { shuffleArray, backend, removeProductFromArray, getProduct, getProducts, sortProductByActiveStatus, getProductReviewsByProductId } from '@/config/utils';
import { Metadata } from 'next';
import { IProduct, Props, ISlideTitle, IResponse, IProductReview } from '@/config/interfaces';

///Commencing the code -->

///This fetches the product info page

// Pre-render known product pages at build time
// export async function generateStaticParams(): Promise<Array<{ id?: string }>> {
//   try {
//     const products_ = await getProducts() as unknown as Array<IProduct>
//     //console.log('Products: ', products_)
//     //console.log("Backend: ", backend)
  
//     const productIds = products_.map((product: IProduct) => product._id!.toString());
//     //console.log('Product Ids: ', productIds)
//     return productIds.map((id) => ({ id }));
//   } catch (error) {
//     console.log("GSP Error: ", error)
//     return [{ id: "66e97b258cd36b9a41654a36"}]
//   }
// }

// Optional: Control dynamic params behavior
//export const dynamicParams = true; // Allow dynamic rendering for new IDs (default)


///Declaring the metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product: Array<IProduct> | undefined = await getProduct(id)

  if (!product || product?.length === 0) {
    return {
      title: "Product not found",
      description: "Product not found"
    }
  } else {
    return {
      title: `${product[0].name}`,
      description: `${product[0].description}`,
      alternates: {
        canonical: `/products/${id}`
      }
    }
  }
}

/**
 * @title Product info page
 */
export default async function ProductByIdPage({ params }: Props) {
  const { id } = await params
  console.log('ID from page: ', id)
  const product = await getProduct(id) as unknown as Array<IProduct>
  const products_ = sortProductByActiveStatus(await getProducts(), "Active") as unknown as Array<IProduct>
  const productReviews = await getProductReviewsByProductId(id) as unknown as Array<IProductReview>
  const products = shuffleArray(removeProductFromArray(product[0], products_))
  const titles1: ISlideTitle = {
    slideTitleId: 1,
    barTitleId: 2
  }
  const titles2: ISlideTitle = {
    slideTitleId: 2,
    barTitleId: 2
  }

  return (
    <main className="product_info_page">
      <ProductInfo product_={product[0]} reviews_={productReviews} />
      {/* <HomeCampaignB /> */}
      <SimilarProduct _products={products_} _product={product[0]} title_={titles1} view_={"infoSlide1"} />
      <RecommendedProduct _products={products_} _product={product[0]} title_={titles2} view_={"infoSlide2"} />
    </main>
  )
}
