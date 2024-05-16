"use client"
///Product Slide component

///Libraries -->
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, MouseEvent } from 'react';
import styles from "./productSlide.module.scss"
import { IProduct, IClientInfo } from '@/config/interfaces';
import Image from 'next/image';
import { routeStyle, decodedString, slashedPrice } from '@/config/utils'
import { useClientInfoStore } from "@/config/store";
import ProductCard from '@/components/cards/product/ProductCard';

///Commencing the code 
/**
 * @title Product Slide Component
 * @returns The Product Slide component
 */
const ProductSlide = ({ product_ }: { product_: Array<IProduct> }) => {
    const routerPath = usePathname();
    const router = useRouter();
    const [similarProducts, setSimilarProducts] = useState(product_)
    const [lastIndex, setLastIndex] = useState(6)
    const clientInfo = useClientInfoStore(state => state.info)

    //console.log("Router: ", routerPath)

    const handleClick = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, pid: string) => {
      e.preventDefault()

      router.push(`/products/${pid}`);
    }

      useEffect(() => {
        const intervalId = setInterval(() => {
          if (screen.width <= 550) {
            setLastIndex(4)
          } else {
            setLastIndex(6)
          }
        }, 1000);
    
        return () => clearInterval(intervalId);
      }, [lastIndex]);


      ///This function 

    return (
        <main className={`${styles.main} ${routeStyle(routerPath, styles)}`}>
            <div  className={styles.heading}>
                <span className={styles.subheading}>Customers also ordered</span>
                <button onClick={() => router.push('/#products')}><span>See more {'>'}</span></button>
            </div>
            <br />
            <div className={styles.product_slide}>
                {similarProducts?.slice(0, lastIndex).map((product, _id) => (
                    <ProductCard product_={product} key={_id} view={"slide"} />
                ))}
            </div>
        </main>
    );
};
  
export default ProductSlide;