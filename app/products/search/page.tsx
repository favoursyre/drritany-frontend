
///This handles the product query page

///Libraries -->
import { NextApiRequest, NextApiResponse } from 'next';
import { backend, shuffleArray } from '@/config/utils';
import Search from '@/components/search/Search';
import SimilarProduct from '@/components/product/topProduct/topProduct';

///Commencing the code


///This function searches for passed in query
async function getQueriedProducts(query: string | string[] | undefined) {
    try {
      const response = await fetch(
          `${backend}/products/search?query=${query}`,
          {
            next: {
              revalidate: 60,
            },
          }
        );
      
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      
        const products = await response.json();
        return products;
  } catch (error) {
      console.error(error);
  }
  }


///This fetches the products
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
 * @title Product query page
 */
 export default async function ProductPage(req: { params: Object, searchParams: { query: string}}, res: NextApiResponse) {
    const { query } = req.searchParams
    //const { query: query_ } = req
    console.log("Query: ", query )
    const queryProducts = await getQueriedProducts(query)
    const products = shuffleArray(await getProducts())
  
    return (
      <main className="search_page">
        <Search keyword_={query} query_={queryProducts} />
        <SimilarProduct product_={products} />
      </main>
    )
  }
  