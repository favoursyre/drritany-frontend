
///This handles the product query page

///Libraries -->
import { NextApiRequest, NextApiResponse, Metadata } from 'next';
import { domainName, shuffleArray, capitalizeFirstLetter } from '@/config/utils';
import ProductQuery from '@/components/product/productQuery/ProductQuery';
import SimilarProduct from '@/components/product/productSlide/ProductSlide';
import { IProduct, Props } from '@/config/interfaces';

///Commencing the code
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return {
    title: `${searchParams.query}`,
    description: `Search our range of natural health products.`,
    alternates: {
      canonical: `/products/search`
    }
  } as Metadata
}

///This function searches for passed in query
async function getQueriedProducts(query: string | string[] | undefined) {
    try {
      const res = await fetch(`${domainName}/api/product?action=search&query=${query}`, {
        method: "GET",
        cache: "no-store",
      });
      
      if (res.ok) {
        return res.json()
      } else {
        //getQueriedProducts(query)
        console.log("request not ok")
      }
  } catch (error) {
      console.error(error);
  }
  }


///This fetches the products
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
 * @title Product query page
 */
 export default async function ProductPage(req: { params: Object, searchParams: { query: string}}, res: NextApiResponse) {
    const { query } = req.searchParams
    //const { query: query_ } = req
    //console.log("Query: ", query )
    const queryProducts = await getQueriedProducts(query)
    const products = shuffleArray(await getProducts()) as unknown as Array<IProduct>
  
    return (
      <main className="search_page">
        <ProductQuery keyword_={query} query_={queryProducts} />
        <SimilarProduct product_={products} titleId_={2} />
      </main>
    )
  }
  