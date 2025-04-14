///This handles the product query page

///Libraries -->
import { NextApiRequest, NextApiResponse, Metadata } from 'next';
import { backend, shuffleArray, capitalizeFirstLetter, getProducts } from '@/config/utils';
//import ProductQuery from '@/components/product/productQuery/ProductQuery';
import SimilarProduct from '@/components/product/productSlide/ProductSlide';
import { IProduct, Props } from '@/config/interfaces';

///Commencing the code

/**
 * @title Product query page
 */
 export default async function ProductPage() {
  
    return (
      <main className="search_page">
        {/* <ProductQuery keyword_={query} query_={queryProducts} /> */}
        {/* <SimilarProduct product_={products} titleId_={2} /> */}
      </main>
    )
  }
  