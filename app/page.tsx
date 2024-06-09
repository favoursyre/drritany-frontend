"use Client"
///This handles the home page

///Libraries -->
import Hero from '@/components/hero/Hero';
import { domainName, shuffleArray } from '@/config/utils';
import Stats from "@/components/stats/Stats"
import ProductGrid from '@/components/product/productGrid/ProductGrid';
//import dynamic from "next/dynamic"
import ProductSlide from '@/components/product/productSlide/ProductSlide';
//const Testimony = dynamic(() => import("@/components/testimony/Testimony"), { ssr: false })
import TimeBar from '@/components/timeBar/TimeBar';
//import Testimony from '@/components/testimony/Testimony';
import { IProduct } from '@/config/interfaces';

///Commencing the code
export const dynamic = "force-dynamic"

///This function gets all the products
async function getProducts() {
  // try {
  //   const response = await fetch(`${domainName}/api/product/`,
  //       {
  //         method: "GET",
  //         cache: "no-store",
  //       }
  //     );
      
  //       await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      
  //       const products = await response.json();
  //       console.log('Prod2: ', products)
  //       return products;
  // } catch (error) {
  //     console.log(error);
  // }
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
    console.log(error);
  }
  
}

///This function gets all testimonials
// async function getTestimonials() {
//   try {
//     const response = await fetch(
//         `${backend}/testimony`,
//         {
//           next: {
//             revalidate: 60,
//           },
//         }
//       );
    
//       await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
    
//       const quotes = await response.json();
//       return quotes;
//   } catch (error) {
//       console.log(error);
//   }
// }

/**
 * @title Homepage
 */
export default async function Home() {
  const products = await getProducts()
  const productSlide = shuffleArray(products) as unknown as Array<IProduct>
  //console.log("Prod1: ", products)
  // const quotes = shuffleArray(await getQuotes()) 
  // const testimonials = shuffleArray(await getTestimonials())
 
  return (
    <main className="home_page">
      <Hero />
      <Stats />
      <TimeBar />
      <ProductGrid product_={products} view_={undefined} />
      <ProductSlide product_={productSlide} />
      {/* <Testimony />   */}
    </main>
  )
}
