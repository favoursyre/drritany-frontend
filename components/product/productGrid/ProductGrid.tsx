"use client"
///product component

///Libraries -->
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, MouseEvent, useRef, Fragment } from 'react';
import styles from "./productGrid.module.scss"
import { IProduct, ICategoryInfo, IProductFilter, ICategory } from '@/config/interfaces';
import { useModalBackgroundStore, useContactModalStore } from "@/config/store";
import { groupList, sortProductOptions as sortOption, sortProductByOrder, sortMongoQueryByTime, sortProductByPrice, categories, routeStyle, productFilterName, sortProductByRating, sleep } from '@/config/utils'
import InfiniteScroll from 'react-infinite-scroll-component';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Image from 'next/image';
import { useClientInfoStore } from "@/config/store";
import ProductCard from '@/components/cards/product/ProductCard';
import { Add, Category, Tune } from '@mui/icons-material';
import { getItem, notify, removeItem, setItem } from '@/config/clientUtils';
import Loading from '@/components/loadingCircle/Circle';
import DisplayBar from '@/components/displayBar/DisplayBar';

///Commencing the code
/**
 * @title Product Component
 * @returns The Product component
 */
const ProductGrid = ({ product_, view_, query_ }: { product_: Array<IProduct>, view_: string | undefined, query_: string | undefined }) => {
    const routerPath = usePathname();
    const [productList, setProductList] = useState<Array<IProduct>>([])
    const [products, setProducts] = useState<Array<IProduct>>([])
    const [pcCurrentIndex, setPcCurrentIndex] = useState(0)
    const [mobileCurrentIndex, setMobileCurrentIndex] = useState(0)
    const [sort, setSort] = useState(false)
    const [sortId, setSortId] = useState(0)
    const [sortOptions, setSortOptions] = useState(sortOption)
    const [category, setCategory] = useState<boolean>(false)
    const [categoryId, setCategoryId] = useState<number>(0)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setContactModal = useContactModalStore(state => state.setContactModal);
    const [productFilter, setProductFilter] = useState<IProductFilter>(getItem(productFilterName))
    const [macroCategoryId, setMacroCategoryId] = useState<number>(0)
    const [miniCategory, setMiniCategory] = useState<string>("")
    const [categoryOptions, setCategoryOptions] = useState<Array<string | ICategoryInfo >>(["All", ...categories])
    const [pcTotalPage, setPcTotalPage] = useState<Array<any>>([])
    const [mobileTotalPage, setMobileTotalPage] = useState<Array<any>>([])
    const [timeLeft, setTimeLeft] = useState<number>(54400);
    const [width, setWidth] = useState<number>(typeof window !== 'undefined' && window.screen ? window.screen.width : 0)
    const [view, setView] = useState<string | undefined>(view_)
    const [p_, setP_] = useState<boolean>(false)
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const productsPerLoad = 10;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [dataIsLoading, setDataIsLoading] = useState<boolean>(false)
    const limit = 18; // Define how many products per page (controls payload size per "load")
    const [currentBatch, setCurrentBatch] = useState<number>(1);
    const [currentIndex, setCurrentIndex] = useState<number>()
    const [totalBatch, setTotalBatch] = useState<number>()
    const [query, setQuery] = useState<string | undefined>(query_)

    //Updating products
    // useEffect(() => {
    //     console.log('test p: ', product_)
    //     const product__ = product_.slice(0, 12)

    //     if (!p_) {
    //         if (!products) {
    //             console.log("Products not detected")
    //             setProductList(() => product__)
    //             setProducts(() => product__)

    //         } else {
    //             setP_(() => true)
    //         }
    //     }


    //     // if (!p_) {
    //     //     setProductList(() => product__)
    //     //     setProducts(() => product__)
    //     //     setP_(() => true)
    //     // } else {
    //     //     console.log("set already")
    //     // }

    //     console.log('test p 2: ', products, productList, p_)

    // }, [productList, products])

    //Updating query
    useEffect(() => {
        console.log("Query: ", query_, query)
        setQuery(() => query_)
    }, [product_])

    //Updating the product
    useEffect(() => {
        
        //console.log("Products Len: ", products.length)
        const start = (currentBatch - 1) * limit
        const end = start + limit

        //console.log("Product data:", product_);

        if (product_ && product_.length > 0) {
            const product__ = product_.slice(0, end)
            setProductList(() => product_);
            setProducts(() => product__);
            console.log("Products 2: ", product__)
            const _possibleBatches = Math.ceil(product_.length / limit)
            //console.log("Total batch: ", _possibleBatches)
            setTotalBatch(() => _possibleBatches)
        }

        console.log("Products 5: ", products)
        //notify("info", `Len ${products.length}`)
        //setViewProducts(() => newProducts.slice(start, end))
    }, [product_]);

    //This function filters products
    const _filterProduct = (sort: number) => {
        setSort(false)
        setSortId(sort)

        //let newProducts
        if (sort === 0) {
            const newProducts = sortProductByOrder(products)
            //setProductList(() => [...product_])
            setProducts(() => [...newProducts])
        } else if (sort === 1) {
            const newProducts = sortMongoQueryByTime(products, "latest")
            //product_ = sortByCategory(productList, "Health & Personal Care")
            //setProductList(() => [...product_])
            setProducts(() => [...newProducts])
        } else if (sort === 2) {
            const newProducts = sortProductByPrice(products, "descend")
            //setProductList(() => [...product_])
            setProducts(() => [...newProducts])
        } else if (sort === 3) {
            const newProducts = sortProductByPrice(products, "ascend")
            //setProductList(() => [...product_])
            setProducts(() => [...newProducts])
        } else if (sort === 4) {
            const newProducts = sortProductByRating(products)
            //setProductList(() => [...product_])
            setProducts(() => [...newProducts])
        }
    }

    //This is a use effect function
    useEffect(() => {
        //console.log('Products1: ', product_, productList, products)

        if (productFilter) {
            if (productFilter.filterId) {
                _filterProduct(productFilter.filterId!)
                //setSortId(() => )
            }

            if (productFilter.category) {
                if (typeof productFilter.category !== "string") {
                    const filterCategory = productFilter.category as unknown as ICategory
                    //console.log("Filter Category: ", filterCategory)
                    const start = (currentBatch - 1) * limit
                    const end = start + limit
                    const newProducts = product_.filter((product) => product.category?.mini === filterCategory?.mini)
                    const product__ = newProducts.slice(0, end)

                    setProductList(() => [...newProducts])
                    setProducts(() => [...product__])

                    const _possibleBatches = Math.ceil(newProducts.length / limit)
                    //console.log("Total batch: ", _possibleBatches)
                    setTotalBatch(() => _possibleBatches)

                    const _index = categories.findIndex((category) => category.macro === filterCategory.macro)
                    setMacroCategoryId(_index + 1);
                    setMiniCategory(filterCategory.mini!)
                }
            }
            //removeItem(productFilterName)
        }
    }, [productFilter, products])

    // useEffect(() => {
    //     //Setting product filter


    //     const intervalId = setInterval(() => {
    //         //console.log("Effect: ", products)
    //         setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    //     }, 1000);

    //     return () => clearInterval(intervalId);
    // }, [products, productList, product_]);

    // useEffect(() => {

    //     const intervalId = setInterval(() => {
    //         //console.log("checking screen width")
    //         if (width <= 550) {
    //             const totalPage = groupList(productList, 6) //This gets the total products in groups of 6
    //             setMobileTotalPage(totalPage)
    //             setProducts(totalPage[mobileCurrentIndex])
    //             //console.log("check: ", mobileCurrentIndex)
    //         } else {
    //             const totalPage = groupList(productList, 12) //This gets the total products in groups of 12
    //             setPcTotalPage(totalPage)
    //             setProducts(totalPage[pcCurrentIndex])
    //         };
    //         //console.log('Products: ', products)
    //     }, 500);

    //     return () => clearInterval(intervalId);
    // }, [mobileCurrentIndex, pcCurrentIndex, products, sort, sortId, productList, width]);

    ///

    // useEffect(() => {
    //     if (timeLeft === 0) {
    //     setTimeLeft(86400);
    //     }
    // }, [timeLeft]);

    //This function is triggered when a user wants to make a custom request
    const customRequest = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        setContactModal(true)
        setModalBackground(true)
    }

    ///This function formats time
    const formatTime = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hrs}h: ${mins < 10 ? '0' : ''}${mins}m: ${secs < 10 ? '0' : ''}${secs}s`;
    };

    ///This handles the go next function
    const goNext = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()

        if (width <= 550) {
            if (mobileCurrentIndex + 1 >= mobileTotalPage.length) {
                null
            } else {
                //console.log("first: ", mobileCurrentIndex)
                setMobileCurrentIndex(mobileCurrentIndex+1)
                //console.log("second: ", mobileCurrentIndex)
                const newProducts: Array<IProduct> = mobileTotalPage[mobileCurrentIndex]
                setProducts(() => [...newProducts])
                console.log('Products: ', products)
                //console.log("clicked")
            }
          } else {
            if (pcCurrentIndex + 1 >= pcTotalPage.length) {
                null
            } else {
                console.log("first: ", pcCurrentIndex)
                setPcCurrentIndex(pcCurrentIndex + 1)
                console.log("second: ", pcCurrentIndex)
                const newProducts: Array<IProduct> = pcTotalPage[pcCurrentIndex]
                setProducts(() => [...newProducts])
                console.log('Products: ', products)
                console.log("clicked")
            }
          }
    }

    ///This handles the go prev function
    const goPrev = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()

        if (width <= 550) {
            if (mobileCurrentIndex + 1 <= 1) {
                null
            } else {
                console.log("first: ", mobileCurrentIndex)
                setMobileCurrentIndex(mobileCurrentIndex - 1)
                console.log("second: ", mobileCurrentIndex)
                const newProducts: Array<IProduct> = mobileTotalPage[mobileCurrentIndex]
                setProducts(() => [...newProducts])
                console.log("clicked")
            }
        } else {
            if (pcCurrentIndex + 1 <= 1) {
                null
            } else {
                console.log("first: ", pcCurrentIndex)
                setPcCurrentIndex(pcCurrentIndex - 1)
                console.log("second: ", pcCurrentIndex)
                const newProducts: Array<IProduct> = pcTotalPage[pcCurrentIndex]
                setProducts(() => [...newProducts])
                //console.log("clicked")
            }
        }
    }

    // Check if we've reached the bottom of the div
    const handleScroll = async () => {
        if (containerRef.current) {  // Make sure the ref is not null
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;  // Get scroll information
        //notify("info", `testing`)

        // If the user has scrolled to the bottom of the container
        if (scrollTop + clientHeight >= scrollHeight - 5) {
                console.log("Batch: ", currentBatch, totalBatch)
                //notify("info", `data: ${dataIsLoading}, ${currentBatch}, ${totalBatch}`)

            if (!dataIsLoading && currentBatch < totalBatch!) {  // Only load more if it's not currently loading and there are more products
                console.log("It has reached the bottom")
                //notify("info", `bottom reached`)

                setDataIsLoading(() => true)

                const newBatch = currentBatch + 1
                setCurrentBatch(() => newBatch)
                const start = (newBatch - 1) * limit
                const end = start + limit
                console.log("SE: ", start, end)
                const newProducts = productList?.slice(start, end)
                //products.push(...newProducts)
                //const _products = [...products, ...newProducts]
                setProducts((prevProducts) => [...prevProducts, ...newProducts])

                console.log("Products Len: ", products.length)

                await sleep(1)
                setDataIsLoading(() => false)
                //setLoading(true);  // Set loading to true to display the loading message
                //loadMoreProducts();  // Load more products
                //setLoading(false);  // Set loading to false once loading is complete
            }
        }
        }
    }

    ///This function filters the products
    const filterProduct = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, sort: number): Promise<void> => {
        e.preventDefault()

        _filterProduct(sort)

        const _filterSettings: IProductFilter = getItem(productFilterName)
        const __filter: IProductFilter = {
            filterId: sort,
            category: _filterSettings.category
        }
        setItem(productFilterName, __filter)
        setProductFilter(() => __filter)
    }

    //This function is triggered when user clicks on select macro category
    const selectMacroCategory = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, _id: number): void => {
        e.preventDefault()

        setMacroCategoryId(_id === macroCategoryId ? undefined! : _id);
        if (_id === 0) {
            setMiniCategory(() => undefined!)
            setCategory(() => false)
            setProductList(() => [...product_])
            setProducts(() => [...product_])
            const _filterSettings: IProductFilter = getItem(productFilterName)
            const __filter: IProductFilter = {
                filterId: _filterSettings.filterId,
                category: categoryOptions[_id]
            }
            setItem(productFilterName, __filter)
            setProductFilter(() => __filter)
        }
    }

    ///This function chooses the products category
    const selectMiniCategory = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, _id: number): Promise<void> => {
        e.preventDefault()
        setCategory(() => false)

        //let min
        const _category = categoryOptions[macroCategoryId]
        if (typeof _category !== "string") {
            const miniCategory = _category.minis[_id].mini
            setMiniCategory(() => miniCategory)
            const newProducts = product_.filter((product) => product.category?.mini === miniCategory)
            setProductList(() => [...newProducts])
            setProducts(() => [...newProducts])

            const _filterSettings: IProductFilter = getItem(productFilterName)
            const __filter: IProductFilter = {
                filterId: _filterSettings.filterId,
                category: {
                    macro: _category.macro,
                    mini: miniCategory
                }
            }
            setItem(productFilterName, __filter)
            setProductFilter(() => __filter)
        }



        // const category: string = categoryOptions[_id]

        // const newProduct = sortByCategory(productList, category)
        // console.log('New Product: ', category, newProduct)
        // if (newProduct && newProduct.length !== 0) {
        //     setProducts(() => [...newProduct])
        // } else {
        //     notify("info", "Products doesn't exist in this category yet, check back later")
        // }

        //console.log('Products: ', products)
    }

    const loadMoreProducts = () => {

    }

    return (
        <main className={`${styles.main} ${routeStyle(routerPath, styles)}`} id="products">
            <div className={styles.header_section}>
                <span className={styles.text}>{productList?.length} product{productList.length > 1 ? "s": ""} found {query ? `for "${query}"` : ""}</span>
            </div>
            <div className={styles.product_list}>
                <div className={styles.filters}>
                    <div className={`${styles.sort_section}`}>
                        <button className={styles.sort_button} onClick={() => setSort(() => !sort)}>
                            <Tune />
                        </button>
                        <span>Sort</span>
                        <div className={`${styles.sort_option} ${!sort ? styles.inactiveSort : ""}`}>
                            {sortOptions.map((option, _id) => (
                                <button key={_id} className={sortId === _id ? styles.activeSortButton : styles.inActiveSortButton} onClick={(e) => filterProduct(e, option.id)}>
                                    {option.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    {query ? (
                        <></>
                    ) : (
                        <div className={styles.category}>
                            <span>Category</span>
                            <button className={styles.category_button} onClick={() => setCategory(() => !category)}>
                                <Category />
                            </button>
                            <div className={`${styles.category_option} ${!category ? styles.inactiveSort : ""}`}>
                                {categoryOptions.map((category, id) => (
                                    <div key={id} className={`${styles.accordianItem} ${macroCategoryId === id ? styles.activeAccordian : styles.inactiveAccordian}`}>
                                        <button
                                            className={`${styles.question} ${macroCategoryId === id ? styles.activeQuestion : styles.inactiveQuestion}`}
                                            onClick={(e) => selectMacroCategory(e, id)}
                                        >
                                            {typeof category === "string" ? category : category.macro}
                                            {typeof category === "string" ? (
                                                <></>
                                            ) : (
                                                <Add className={`${macroCategoryId === id ? styles.activeSymbol : styles.inactiveSymbol}`} />
                                            )}
                                        </button>
                                        {typeof category === "string" ? (
                                            <></>
                                        ) : (
                                            <div className={`${styles.answer} ${macroCategoryId === id ? styles.answerActive : ''}`}>
                                                {category.minis.map((mini, m_id) => (
                                                    <button className={`${styles.miniBtn} ${miniCategory === mini.mini ? styles.activeMiniBtn : ''}`} onClick={(e) => selectMiniCategory(e, m_id)} key={m_id}>
                                                        {mini.mini}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {/* {categoryOptions.map((category, _id) => (
                                    <button key={_id} className={categoryId === _id ? styles.activeSortButton : styles.inActiveSortButton} onClick={(e) => chooseCategory(e, _id)}>{category}</button>
                                ))} */}
                            </div>
                        </div>
                    )}
                </div>
                <div 
                    className={styles.product_carousel}
                    ref={containerRef}
                    onScroll={handleScroll}
                >
                    {products && products.length !== 0 ? products.map((product, _id) => (
                        // <InfiniteScroll
                        //     dataLength={0}  // Number of loaded products
                        //     next={loadMoreProducts}  // Function to call for loading more
                        //     hasMore={false}  // Whether there are more products to load
                        //     loader={<div>Loading...</div>}  // Display when loading
                        //     endMessage={<div>No more products to show</div>}  // Display when no more products are available
                        //     className={styles.product_carousel}
                        // >
                        //     {/* <div className="product-list"> */}
                        //     {products.map((product, _id) => (
                        //         <ProductCard key={_id} product_={product} view_={view} />
                        //     ))}
                        //     {/* </div> */}
                        // </InfiniteScroll>
                        <ProductCard key={_id} product_={product} view_={view} />
                    )) : (
                        <div className={styles.empty_section}>
                            <span className={styles.span1}>No product in this section yet</span>
                            <div className={styles.custom}>
                                <span>Have a product in mind? Make a</span>
                                <button onClick={(e) => customRequest(e)}>
                                    Custom Request
                                </button>
                            </div>
                        </div>
                    )}
                    {dataIsLoading ? (
                        <Loading width='20px' height='20px' />
                    ) : (
                        <></>
                    )}
                </div>
                {/* <div className={styles.pagination_section}>
                        <button onClick={e => goPrev(e)}>
                            <KeyboardArrowLeftIcon />
                        </button>
                        <span>{width <= 550 ? mobileCurrentIndex + 1 : pcCurrentIndex + 1} / {width <= 550 ? mobileTotalPage.length : pcTotalPage.length}</span>
                        <button onClick={e => goNext(e)}>
                            <KeyboardArrowRightIcon />
                        </button>
                    </div> */}
            </div>

        </main>
    );
};

export default ProductGrid;