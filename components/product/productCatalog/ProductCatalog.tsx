"use client"
///Product Catalog component

///Libraries -->
import styles from "./productCatalog.module.scss"
import { IProduct, IClientInfo, ISheetInfo, IQueryResearch } from "@/config/interfaces";
import { useState, useEffect, MouseEvent, Fragment } from "react"
import { sortProductByOrder, sortProductByPrice, sortMongoQueryByTime, getCurrentDate, getCurrentTime, statSheetId, backend, clientInfoName, productsName } from "@/config/utils";
import { useRouter } from "next/navigation";
import { getItem, Cache } from "@/config/clientUtils";
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
    const [currentURL, setCurrentURL] = useState(window.location.href)
    //const clientInfo = useClientInfoStore(state => state.info)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal)
    const setContactModal = useContactModalStore(state => state.setContactModal);
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo!)

    //Updating client info
    useEffect(() => {
        //console.log("Hero: ", _clientInfo, clientInfo)

        let _clientInfo_
        
        if (!clientInfo) {
            //console.log("Client info not detected")
            const interval = setInterval(() => {
                _clientInfo_ = getItem(clientInfoName)
                //console.log("Delivery Info: ", _deliveryInfo)
                setClientInfo(_clientInfo_)
            }, 100);
    
            //console.log("Delivery Info: ", deliveryInfo)
        
            return () => {
                clearInterval(interval);
            };
        } else {
            setModalBackground(false)
            setLoadingModal(false)
            //console.log("Client info detected")
        }  

    }, [clientInfo])

    //Setting products
    useEffect(() => {
        //console.log("Product List C: ", productList)
        //Setting Product list
        if (query_) {
            setProductList(() => products_!)
        } else {
            const _products_ = Cache(productsName).get()
            //console.log("Cache: ", _products_)
            // if (!_products_) {
            //     const interval = setInterval(() => {
            //         const _products_ = Cache(productsName).get()
            //           //console.log("Delivery Info: ", _deliveryInfo)
            //           setProductList(_products_)
            //     }, 500);
        
            //     //console.log("Delivery Info: ", deliveryInfo)
            
            //     return () => {
            //         clearInterval(interval);
            //     };
            // } else {
            //     setProductList(() => _products_)
            // }

            if (_products_) {
                setProductList(_products_);
            }
            //console.log("Products not seen in slides")  
        }
    }, [productList, query_, products_])

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
                    //console.log("Google Stream: ", res)
                } catch (error) {
                    //console.log("Store Error: ", error)
                }
            }
            
            if (query_) {
                storeQuery()
            }
        } else {
            setModalBackground(false)
            setLoadingModal(false)
        }
    }, [clientInfo, query, query_])

    // useEffect(() => {
    //     //console.log("Query: ", query, productList)

    //     const intervalId = setInterval(() => {

    //     }, 100);

    //     return () => clearInterval(intervalId);
    // }, [clientInfo]);

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
                    <ProductGrid product_={productList} view_={undefined} />
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