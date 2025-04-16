"use client"
///Product Catalog component

///Libraries -->
import styles from "./productCatalog.module.scss"
import { IProduct, IClientInfo, ISheetInfo, IQueryResearch } from "@/config/interfaces";
import { useState, useEffect, MouseEvent, Fragment, useMemo } from "react"
import { sortProductByOrder, sortProductByPrice, sortMongoQueryByTime, getCurrentDate, getCurrentTime, statSheetId, backend, clientInfoName, productsName, getProducts, sortProductByActiveStatus } from "@/config/utils";
import { useRouter, usePathname } from "next/navigation";
import { getItem, Cache, getOS, getDevice } from "@/config/clientUtils";
import ErrorIcon from '@mui/icons-material/Error';
import ProductCard from "@/components/cards/product/ProductCard";
import ProductGrid from "../productGrid/ProductGrid";
import { useModalBackgroundStore, useContactModalStore, useLoadingModalStore } from "@/config/store";

///Commencing the code 

/**
 * @title Product Query Component
 * @returns The Product Query component
 */
const ProductCatalog = ({ query_, products_ }: { query_: string | undefined, products_: Array<IProduct> | undefined }) => {
    const [lastIndex, setLastIndex] = useState(12)
    const [query, setQuery] = useState(query_)
    const [productList, setProductList] = useState<Array<IProduct>>([])
    const [products, setProducts] = useState<Array<IProduct>>([])
    const router = useRouter()
    const pathname = usePathname();
    const [currentURL, setCurrentURL] = useState(window.location.href)
    //const clientInfo = useClientInfoStore(state => state.info)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal)
    const setContactModal = useContactModalStore(state => state.setContactModal);
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo!)
    const [sheetStored, setSheetStored] = useState<boolean>(false)

    //Updating client info
    // useEffect(() => {
    //     //console.log("Hero: ", _clientInfo, clientInfo)

    //     let _clientInfo_
        
    //     if (!clientInfo) {
    //         //console.log("Client info not detected")
    //         const interval = setInterval(() => {
    //             _clientInfo_ = getItem(clientInfoName)
    //             //console.log("Delivery Info: ", _deliveryInfo)
    //             setClientInfo(_clientInfo_)
    //         }, 100);
    
    //         //console.log("Delivery Info: ", deliveryInfo)
        
    //         return () => {
    //             clearInterval(interval);
    //         };
    //     } else {
    //         setModalBackground(false)
    //         setLoadingModal(false)
    //         //console.log("Client info detected")
    //     }  

    // }, [clientInfo])
    useEffect(() => {
        const _clientInfo = getItem(clientInfoName);
        if (_clientInfo) {
            setClientInfo(_clientInfo);
            setModalBackground(false);
            setLoadingModal(false);
        }
        // No polling needed unless clientInfo is expected to change dynamically
    }, []);

    //Setting products
    // useEffect(() => {
    //     //console.log("Product List C: ", productList)
    //     //Setting Product list
    //     if (query_) {
    //         setProductList(() => products_!)

    //     } else {
    //         const _products_ = Cache(productsName).get()

    //         if (_products_) {
    //             setProductList(() => _products_);
    //         } else {
    //             setProductList(() => products_!)
    //             const validPeriod = 3600 //1 hour
    //             const _cache = Cache(productsName).set(products_, validPeriod)
    //         }
    //         //console.log("Products not seen in slides")  
    //     }
    // }, [query_, products_])

    // Memoize productList to prevent unnecessary re-renders
    const cachedProductList = useMemo(() => {
        if (query_ && products_) return products_;
        const cached = Cache(productsName).get();
        if (cached) return cached;
        if (products_) {
            const validPeriod = 3600; // 1 hour
            Cache(productsName).set(products_, validPeriod);
            return products_;
        }
        return [];
    }, [query_, products_]);

    // Set productList once based on memoized data
    useEffect(() => {
        setProductList(() => cachedProductList);
    }, [cachedProductList]);

    useEffect(() => {

        //console.log("Test: ", productList, sortMongoQueryByTime(productList, "latest"), sortProductByPrice(productList, "ascend"))
        //const products_: Array<IProduct> = sortMongoQueryByTime(productList!,"latest")
        //console.log("After: ", products_)
        //setProducts(() => products_)

        //Storing the keyword in an excel sheet for research purposes
        if (clientInfo) {
            const storeQuery = async () => {
                try {
                    //Arranging the query research info
                    const queryInfo: IQueryResearch = {
                        ID: clientInfo._id!,
                        IP: clientInfo?.ipData?.ip!,
                        City: clientInfo.ipData?.city!,
                        Region: clientInfo.ipData?.region!,
                        Country: clientInfo?.ipData?.country!,
                        Query: query!,
                        Date: getCurrentDate(),
                        Time: getCurrentTime(),
                        OS: getOS(),
                        Device: getDevice()
                    }

                    const sheetInfo: ISheetInfo = {
                        sheetId: statSheetId,
                        sheetRange: "ProductQuery!A:J",
                        data: queryInfo
                    }
            
                    const res = await fetch(`${backend}/sheet`, {
                        method: "POST",
                        body: JSON.stringify(sheetInfo),
                    });
                    //console.log("Google Stream: ", res)

                    if (res.ok) {
                        setSheetStored(true)
                    }
                } catch (error) {
                    //console.log("Store Error: ", error)
                }
            }
            
            if (query_ && !sheetStored) {
                storeQuery()
            }
        } else {
            setModalBackground(false)
            setLoadingModal(false)
        }
    }, [clientInfo, query_])

    // useEffect(() => {
    //     //console.log("Query: ", query, productList)

    //     const intervalId = setInterval(() => {

    //     }, 100);

    //     return () => clearInterval(intervalId);
    // }, [clientInfo]);

    ///This hook constantly checks for the screen's width
    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //       if (screen.width <= 550) {
    //         setLastIndex(6)
    //       } else {
    //         setLastIndex(12)
    //       }
    //     }, 100);
    
    //     return () => clearInterval(intervalId);
    // }, [lastIndex]);
    useEffect(() => {
        if (typeof window === "undefined") return

        const updateIndex = () => setLastIndex(window.innerWidth <= 550 ? 6 : 12);
        updateIndex(); // Set initial value
        window.addEventListener('resize', updateIndex);
        return () => window.removeEventListener('resize', updateIndex);
    }, []);

    //Checking if url has changed and then turning off loading modal
    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         if (currentURL === window.location.href) {
    //             //console.log('not changed')
    //             undefined
    //         } else {
    //             //console.log("changed")
    //             clearInterval(intervalId)
    //             setCurrentURL(window.location.href)
    //             //window.location.reload()

    //             //Setting off the loading modal
    //             setModalBackground(false)
    //             setLoadingModal(false)
    //         }
            
    //     }, 1000);

    //     return () => clearInterval(intervalId);
    // }, [currentURL]);

    useEffect(() => {
        setModalBackground(false);
        setLoadingModal(false);
    }, [pathname, setModalBackground, setLoadingModal]);

    //This function is triggered when a user wants to make a custom request
    const customRequest = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        setContactModal(true)
        setModalBackground(true)
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
                {productList ? (
                    <ProductGrid product_={productList} view_={undefined} query_={query_} />
                ) : (
                    <>no product</>
                )}
                
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