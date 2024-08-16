"use client"
///Product Query component

///Libraries -->
import styles from "./productQuery.module.scss"
import { IProduct, IClientInfo, ISheetInfo, IQueryResearch } from "@/config/interfaces";
import { useState, useEffect, MouseEvent } from "react"
import { sortOptions as sortOption, sortProductByOrder, sortProductByPrice, sortProductByLatest, getCurrentDate, getCurrentTime, querySheetId, backend } from "@/config/utils";
import { useRouter } from "next/navigation";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ErrorIcon from '@mui/icons-material/Error';
import TuneIcon from '@mui/icons-material/Tune';
import Image from "next/image";
import { useClientInfoStore } from "@/config/store";
import ProductCard from "@/components/cards/product/ProductCard";
import ProductGrid from "../productGrid/ProductGrid";

///Commencing the code 

/**
 * @title Product Query Component
 * @returns The Product Query component
 */
const ProductQuery = ({ keyword_, query_ }: { keyword_: string | undefined, query_: Array<IProduct> }) => {
    const [lastIndex, setLastIndex] = useState(12)
    const [keyword, SetKeyword] = useState(keyword_)
    const [productList, setProductList] = useState(query_)
    const [foundProducts, setFoundProducts] = useState<Array<IProduct>>([])
    const router = useRouter()
    const [currentURL, setCurrentURL] = useState(window.location.href)
    const clientInfo = useClientInfoStore(state => state.info)
    const [sort, setSort] = useState(false)
    const [sortId, setSortId] = useState(0)
    const [sortOptions, setSortOptions] = useState(sortOption)
    //console.log('Query: ', foundProducts)

    useEffect(() => {
        console.log("Test: ", productList, sortProductByLatest(productList), sortProductByPrice(productList, "ascend"))
        const products_: Array<IProduct> = sortProductByLatest(productList)
        //console.log("After: ", products_)
        setFoundProducts(() => products_)

        //Storing the keyword in an excel sheet for research purposes
        if (clientInfo) {
            const storeQuery = async () => {
                try {
                    //Arranging the query research info
                    const queryInfo: IQueryResearch = {
                        IP: clientInfo?.ip!,
                        Country: clientInfo?.country?.name?.common!,
                        Keyword: keyword!,
                        Date: getCurrentDate(),
                        Time: getCurrentTime()
                    }

                    const sheetInfo: ISheetInfo = {
                        sheetId: querySheetId,
                        sheetRange: "ProductQuery!A:E",
                        data: queryInfo
                    }
            
                    const res = await fetch(`${backend}/sheet`, {
                        method: "POST",
                        body: JSON.stringify(sheetInfo),
                    });
                    console.log("Google Stream: ", res)
                } catch (error) {
                    console.log("Store Error: ", error)
                }
            }
            
            storeQuery()
        }
    }, [foundProducts, clientInfo])

    useEffect(() => {
        const intervalId = setInterval(() => {
        }, 100);

        return () => clearInterval(intervalId);
    }, [foundProducts, clientInfo]);

    ///This hook constantly checks for the screen's width
    useEffect(() => {
        const intervalId = setInterval(() => {
          if (screen.width <= 550) {
            setLastIndex(6)
          } else {
            setLastIndex(12)
          }
        }, 100);
    
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

    ///This function filters the products
    const filterProduct = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, sort: number): Promise<void> => {
        e.preventDefault()
        setSort(false)
        setSortId(sort)
        let product_: Array<IProduct>

        if (sort === 0) {
            query_ = sortProductByOrder(productList)
            //setProductList(() => [...product_])
            setFoundProducts(() => [...query_])
        } else if (sort === 1) {
            product_ = sortProductByLatest(productList)
            //setProductList(() => [...product_])
            setFoundProducts(() => [...product_])
        } else if (sort === 2) {
            query_ = sortProductByPrice(productList, "descend")
            //console.log("Query: ", query_)
            //setProductList(() => [...product_])
            setFoundProducts(() => [...query_])
        } else if (sort === 3) {
            product_ = sortProductByPrice(query_, "ascend")
            //setProductList(() => [...product_])
            setFoundProducts(() => [...product_])
        }
    }

    return (
        <main className={`${styles.main}`}>
            
            {foundProducts && foundProducts.length > 0 ? (
                <div className={styles.active_state}>
                    <div className={styles.heading}>
                        <span className={styles.brief}>
                            {foundProducts?.length} product{foundProducts.length > 1 ? "s": ""} found that matched <strong>&apos;{keyword}&apos;</strong>
                        </span>
                    </div>
                    <ProductGrid product_={foundProducts} view_="query" />
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
                        <div className={styles.iconCircle}>
                            <ErrorIcon className={styles.icon} />
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