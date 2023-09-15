"use client"
///Search component

///Libraries -->
import styles from "./search.module.scss"
import { IProduct, IClientInfo } from "@/app/utils/interfaces";
import { useState, useEffect, MouseEvent } from "react"
import { getItem, decodedString, getCurrencySymbol, getExchangeRate } from "@/app/utils/utils";
import { useRouter } from "next/navigation";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

///Commencing the code 

/**
 * @title Search Component
 * @returns The Search component
 */
const Search = ({ keyword_, query_ }: { keyword_: string | string[] | undefined, query_: Array<IProduct> }) => {
    const [lastIndex, setLastIndex] = useState(12)
    const [keyword, SetKeyword] = useState(keyword_)
    const [foundProducts, setFoundProducts] = useState(query_)
    const router = useRouter()
    const [currentURL, setCurrentURL] = useState(window.location.href)
    const clientInfo: IClientInfo = getItem("clientInfo")
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

    ///This function triggers when handle click is clicked
    const handleClick = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, id: string): void => {
        e.preventDefault()

        router.push(`/products/${id}`);
    }

    return (
        <main className={`${styles.main}`}>
            
            {foundProducts && foundProducts.length > 0 ? (
                <div className={styles.active_state}>
                    <span className={styles.brief}>{foundProducts?.length} product{foundProducts.length > 1 ? "s": ""} found that matched <strong>&apos;{keyword}&apos;</strong></span>
                    
                    <div className={styles.product_grid}>
                        {foundProducts.map((product, _id) => (
                            <div className={styles.product_carousel} key={_id} onClick={event => handleClick(event, product._id)}>
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
                            <img 
                                src="https://drive.google.com/uc?export=download&id=1u3nIrX-Mg4Zmep4HphaopUL_C2ixuP05"
                                alt=""
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
  
export default Search;