"use Client"
///This handles the home page

///Libraries -->
import Hero from '@/components/hero/Hero';
import { backend, shuffleArray, sortProductByActiveStatus, sortMongoQueryByTime, sortProductByOrder, sortProductByRating } from '@/config/utils';
import Stats from "@/components/stats/Stats"
import ProductGrid from '@/components/product/productGrid/ProductGrid';
//import dynamic from "next/dynamic"
import ProductSlide from '@/components/product/productSlide/ProductSlide';
//const Testimony = dynamic(() => import("@/components/testimony/Testimony"), { ssr: false })
//import TimeBar from '@/components/timeBar/TimeBar';
//import Testimony from '@/components/testimony/Testimony';
import { IProduct, ISlideTitle } from '@/config/interfaces';
import CategorySlide from '@/components/categorySlide/categorySlide';
import HomeCampaignA from '@/components/campaigns/homeCampaignA/homeCampaignA';
import HomeCampaignB from '@/components/campaigns/homeCampaignB/homeCampaignB';

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
      const res = await fetch(`${backend}/product?action=latest`, {
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

//Changing this page to static
// export async function getStaticProps(context) {
//   return []
// }


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
  const products = sortProductByActiveStatus(await getProducts(), "Active") as unknown as Array<IProduct>
  // const productSlide = sortProductByActiveStatus(shuffleArray(products!), "Active") as unknown as Array<IProduct>
  // const newestArrivals = sortProductByLatest(products!)
  // const mostOrdered = sortProductByOrder(products!)
  // const mostRated = sortProductByRating(products!)
  const titles1: ISlideTitle = {
    slideTitleId: 3,
    barTitleId: 0
  }
  const titles2: ISlideTitle = {
    slideTitleId: 4,
    barTitleId: 0
  }
  const titles3: ISlideTitle = {
    slideTitleId: 5,
    barTitleId: 1
  }
  const titles4: ISlideTitle = {
    slideTitleId: 2,
    barTitleId: 2
  }
  //console.log("Prod1: ", products)
  //console.log("Prod2: ", newestArrivals)
  //console.log("Prod3: ", mostOrdered)
  //console.log("Prod4: ", mostRated)
  // const quotes = shuffleArray(await getQuotes()) 
  // const testimonials = shuffleArray(await getTestimonials())
 
  return (
    <main className="home_page" >
      <Hero />
      <Stats />
      <ProductSlide product_={products} title_={titles1} view_={"homeSlide1"}/>
      <CategorySlide />
      <ProductSlide product_={products} title_={titles2} view_={"homeSlide2"}/>
      {/* <HomeCampaignA /> */}
      <ProductSlide product_={products} title_={titles4} view_={"homeSlide3"}/>
      {/* <HomeCampaignB /> */}
      {/* <ProductSlide product_={productSlide} title_={titles4} view_={"homeSlide4"}/> */}
      {/* <Testimony />   */}
    </main>
  )
}
