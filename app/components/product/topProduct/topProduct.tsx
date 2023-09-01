"use client"
///similar product component

///Libraries -->
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, MouseEvent } from 'react';
import styles from "./topProduct.module.scss"
import { IProduct, IClientInfo } from '@/app/utils/interfaces';
import { routeStyle, getItem, decodedString, getCurrencySymbol, getExchangeRate } from '../../../utils/utils'

///Commencing the code 
/**
 * @title Product list Component
 * @returns The Product list component
 */
const SimilarProduct = ({ product_ }: { product_: Array<IProduct> }) => {
    const routerPath = usePathname();
    const router = useRouter();
    const [similarProducts, setSimilarProducts] = useState(product_)
    const [lastIndex, setLastIndex] = useState(6)
    const clientInfo: IClientInfo = getItem("clientInfo")

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
                <span className={styles.subheading}>{clientInfo ? clientInfo.groupTest === "A" ? "Similar Products" : "People also ordered" : "Similar Products"}</span>
                <button onClick={() => router.push('/#products')}><span>See more {'>'}</span></button>
            </div>
            <br />
            <div className={styles.product_slide}>
                {similarProducts?.slice(0, lastIndex).map((product, _id) => (
                    <div className={styles.product_carousel} key={_id} onClick={e => handleClick(e, product._id)}>
                        <div className={styles.carousel_image}>
                            <img 
                                src={product.images[0]}
                                alt=""
                            />
                        </div>
                        <div className={styles.carousel_name}>
                            <span>{product.name}</span>
                        </div>
                        <div className={styles.carousel_price}>
                            <div className={styles.price_1}>
                              <strong>
                                <span dangerouslySetInnerHTML={{ __html: decodedString(getCurrencySymbol(clientInfo)) }} />
                                <span>{product.price ? (Math.round(product.price * getExchangeRate(clientInfo))).toLocaleString("en-US") : ""}</span>
                              </strong>
                            </div>
                            <div className={styles.price_2}>
                              <span dangerouslySetInnerHTML={{ __html: decodedString(getCurrencySymbol(clientInfo)) }} />
                              <span>{product.slashedPrice ? (Math.round(product.slashedPrice * getExchangeRate(clientInfo))).toLocaleString("en-US") : ""}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};
  
export default SimilarProduct;