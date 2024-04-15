"use Client"
///This handles the home page

///Libraries -->
import Hero from '@/components/hero/Hero';
import { domainName } from '@/config/utils';
import Map from "@/components/map/Map"
import Products from '@/components/product/productGrid/ProductGrid';
import dynamic from "next/dynamic"
const Quote = dynamic(() => import("@/components/quote/Quote"), { ssr: false })
const Testimony = dynamic(() => import("@/components/testimony/Testimony"), { ssr: false })
//import Quote from '@/components/quote/Quote';
//import Testimony from '@/components/testimony/Testimony';
import { IProduct } from '@/config/interfaces';

///Commencing the code
///This function gets the quotes
// async function getQuotes() {
//   try {
//       const response = await fetch(
//           `${backend}/quotes`,
//           {
//             next: {
//               revalidate: 60,
//             },
//           }
//         );
      
//         await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      
//         const quotes = await response.json();
//         return quotes;
//   } catch (error) {
//       console.error(error);
//   }
// }

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
  console.log("Prod1: ", products)
  // const quotes = shuffleArray(await getQuotes()) 
  // const testimonials = shuffleArray(await getTestimonials())
 
  return (
    <main className="home_page">
      <Hero />
      <Map />
      <Products product_={products}/>
      <Quote />
      <Testimony />  
    </main>
  )
}
