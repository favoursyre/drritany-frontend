"use client"
///Product Catalog component

///Libraries -->
import styles from "./productCatalog.module.scss"
import { IProduct, IClientInfo, ISheetInfo, IQueryResearch } from "@/config/interfaces";
import { useState, useEffect, MouseEvent, Fragment } from "react"
import { sortOptions as sortOption, sortProductByOrder, sortProductByPrice, sortProductByLatest, getCurrentDate, getCurrentTime, statSheetId, backend } from "@/config/utils";
import { useRouter } from "next/navigation";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ErrorIcon from '@mui/icons-material/Error';
import TuneIcon from '@mui/icons-material/Tune';
import Image from "next/image";
import { useClientInfoStore } from "@/config/store";
import ProductCard from "@/components/cards/product/ProductCard";
import ProductGrid from "../productGrid/ProductGrid";
import { useModalBackgroundStore, useContactModalStore } from "@/config/store";

///Commencing the code 

/**
 * @title Product Query Component
 * @returns The Product Query component
 */
const ProductCatalog = ({ query_, products_ }: { query_: string | undefined, products_: Array<IProduct> }) => {
    const [lastIndex, setLastIndex] = useState(12)
    const [query, setQuery] = useState(query_)
    const [productList, setProductList] = useState(products_)
    const [products, setProducts] = useState<Array<IProduct>>([])
    const router = useRouter()
    const [currentURL, setCurrentURL] = useState(window.location.href)
    const clientInfo = useClientInfoStore(state => state.info)
    const [sort, setSort] = useState(false)
    const [sortId, setSortId] = useState(0)
    const [sortOptions, setSortOptions] = useState(sortOption)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setContactModal = useContactModalStore(state => state.setContactModal);
    //console.log('Product List: ', productList)

    useEffect(() => {
        console.log("Test: ", productList, sortProductByLatest(productList), sortProductByPrice(productList, "ascend"))
        const products_: Array<IProduct> = sortProductByLatest(productList)
        //console.log("After: ", products_)
        setProducts(() => products_)

        //Storing the keyword in an excel sheet for research purposes
        if (clientInfo) {
            const storeQuery = async () => {
                try {
                    //Arranging the query research info
                    const queryInfo: IQueryResearch = {
                        IP: clientInfo?.ip!,
                        Country: clientInfo?.country?.name?.common!,
                        Query: query!,
                        Date: getCurrentDate(),
                        Time: getCurrentTime()
                    }

                    const sheetInfo: ISheetInfo = {
                        sheetId: statSheetId,
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
            
            if (query_) {
                storeQuery()
            }
        }
    }, [products, clientInfo])

    useEffect(() => {
        console.log("Query: ", query, productList)

        const intervalId = setInterval(() => {
        }, 100);

        return () => clearInterval(intervalId);
    }, [products, clientInfo]);

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

    //This function is triggered when a user wants to make a custom request
    const customRequest = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        setContactModal(true)
        setModalBackground(true)
    }

    ///This function filters the products
    const filterProduct = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, sort: number): Promise<void> => {
        e.preventDefault()
        setSort(false)
        setSortId(sort)
        let product_: Array<IProduct>

        if (sort === 0) {
            product_ = sortProductByOrder(productList)
            //setProductList(() => [...product_])
            setProducts(() => [...products_])
        } else if (sort === 1) {
            product_ = sortProductByLatest(productList)
            //setProductList(() => [...product_])
            setProducts(() => [...product_])
        } else if (sort === 2) {
            product_ = sortProductByPrice(productList, "descend")
            //console.log("Query: ", query_)
            //setProductList(() => [...product_])
            setProducts(() => [...product_])
        } else if (sort === 3) {
            product_ = sortProductByPrice(productList, "ascend")
            //setProductList(() => [...product_])
            setProducts(() => [...product_])
        }
    }

    //Conditionally rendering various components
    if (query && (productList === undefined || productList.length === 0)) {
        return (
            <Fragment>
                <div className={styles.empty_state}>
                    <div className={styles.iconCircle}>
                        <ErrorIcon className={styles.icon} />
                    </div>
                    <div className={styles.text}>
                        <span className={styles.brief}>Unfortunately there are no results for <strong>&apos;{query}&apos;</strong></span>
                        <span className={styles.brief}>- Try checking for spelling errors</span>
                        <span className={styles.brief}>- Try searching with short and simple keywords</span>
                        <span className={styles.brief}>- Try searching for more general terms</span>
                    </div>
                    <div className={styles.custom}>
                        <span>Still didn&apos;t find what you&apos;re looking for? Make a</span>
                        <button onClick={(e) => customRequest(e)}>
                            Custom Request
                        </button>
                    </div>
                </div>
            </Fragment>
        )
    } else {
        return (
            <main className={`${styles.main}`}>
                <div className={styles.heading}>
                    <div className={styles.upper}>
                        <div className={styles.bar}></div>
                        <span className={styles.barTitle}>Shop more & get more discounts</span>
                    </div>
                    
                </div>
                <ProductGrid product_={productList} view_={undefined} />
                {/* <div className={styles.active_state}>
                    <div className={styles.heading}>
                        <span className={styles.brief}>
                            {products?.length} product{products.length > 1 ? "s": ""} found that matched <strong>&apos;{query}&apos;</strong>
                        </span>
                    </div>
                    <ProductGrid product_={products} view_="query" />
                    <div className={styles.pagination_section}>
                            <button>
                                <KeyboardArrowLeftIcon />
                            </button>
                                1 / {products.length}
                            <button>
                                <KeyboardArrowRightIcon />
                            </button>
                        </div>
                </div> */}
            </main>
        )
    }
};
  
export default ProductCatalog;