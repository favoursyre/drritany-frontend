"use Client"
///This handles the home page

///Libraries -->
import Hero from './components/hero/Hero';
import { backend, shuffleArray, setItem } from './utils/utils';
import Map from "./components/map/Map"
import Products from './components/product/productGrid/ProductGrid';
import Quote from './components/quote/Quote';
import Testimony from './components/testimony/Testimony';

///Commencing the code
///This function gets the quotes
async function getQuotes() {
  try {
      const response = await fetch(
          `${backend}/quotes`,
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

///This function gets all the products
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
      console.log(error);
  }
}

///This function gets all testimonials
async function getTestimonials() {
  try {
    const response = await fetch(
        `${backend}/testimony`,
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
      console.log(error);
  }
}

/**
 * @title Homepage
 */
export default async function Home() {
  const products = await getProducts()
  const quotes = shuffleArray(await getQuotes()) 
  const testimonials = shuffleArray(await getTestimonials())
 
  return (
    <main className="home_page">
      <Hero />
      <Map />
      <Products product_={products}/>
      <Quote quote_={quotes}/>
      <Testimony testimonial_={testimonials} />  
    </main>
  )
}
