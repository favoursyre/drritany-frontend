"use client"
///Product Query component

///Libraries -->
import styles from "./productQuery.module.scss"
import { IProduct, IClientInfo } from "@/config/interfaces";
import { useState, useEffect, MouseEvent } from "react"
import { decodedString, slashedPrice } from "@/config/utils";
import { useRouter } from "next/navigation";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Image from "next/image";
import { useClientInfoStore } from "@/config/store";
import ProductCard from "@/components/cards/product/ProductCard";

///Commencing the code 

/**
 * @title Product Query Component
 * @returns The Product Query component
 */
const ProductQuery = ({ keyword_, query_ }: { keyword_: string | string[] | undefined, query_: Array<IProduct> }) => {
    const [lastIndex, setLastIndex] = useState(12)
    const [keyword, SetKeyword] = useState(keyword_)
    const [foundProducts, setFoundProducts] = useState<Array<IProduct>>(query_)
    const router = useRouter()
    const [currentURL, setCurrentURL] = useState(window.location.href)
    const clientInfo = useClientInfoStore(state => state.info)
    console.log('Query: ', foundProducts)

    ///This hook constantly checks for the screen's width
    useEffect(() => {
        const intervalId = setInterval(() => {
          if (screen.width <= 550) {
            setLastIndex(6)
          } else {
            setLastIndex(12)
          }
        }, 1000);
    
        return () => clearInterval(intervalId);
      }, [lastIndex]);

      useEffect(() => {
        const intervalId = setInterval(() => {
            if (currentURL === window.location.href) {
                //console.log('not changed')
                undefined
            } else {
                //console.log("changed")
                clearInterval(intervalId)
                setCurrentURL(window.location.href)
               window.location.reload()
            }
            
        }, 1000);

        return () => clearInterval(intervalId);
    }, [currentURL]);

    return (
        <main className={`${styles.main}`}>
            
            {foundProducts && foundProducts.length > 0 ? (
                <div className={styles.active_state}>
                    <span className={styles.brief}>{foundProducts?.length} product{foundProducts.length > 1 ? "s": ""} found that matched <strong>&apos;{keyword}&apos;</strong></span>
                    
                    <div className={styles.product_grid}>
                        {foundProducts.map((product, _id) => (
                            <ProductCard product_={product} key={_id} view={undefined} />
                        ))}
                    </div>
                    <div className={styles.pagination_section}>
                            <button>
                                <KeyboardArrowLeftIcon />
                            </button>
                                1 / {foundProducts.length}
                            <button>
                                <KeyboardArrowRightIcon />
                            </button>
                        </div>
                </div>
            ) : (
                <>
                    <div className={styles.empty_state}>
                        <div className={styles.image}>
                            <Image
                                className={styles.img} 
                                src="https://drive.google.com/uc?export=download&id=1u3nIrX-Mg4Zmep4HphaopUL_C2ixuP05"
                                alt=""
                                width={103}
                                height={103}
                            />
                        </div>
                        <span className={styles.brief}>There are no results for <strong>&apos;{keyword}&apos;</strong></span>
                        <span className={styles.brief}>- Check for spelling errors</span>
                        <span className={styles.brief}>- Try searching with short and simple keywords</span>
                        <span className={styles.brief}>- Try searching for more general terms</span>
                        <button onClick={() => router.push("/")}>
                            <span>GO TO HOMEPAGE</span>
                        </button>
                    </div>
                </>
            )}
            
        </main>
    );
};
  
export default ProductQuery;