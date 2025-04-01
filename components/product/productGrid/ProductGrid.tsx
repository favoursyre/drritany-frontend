"use client"
///product component

///Libraries -->
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, MouseEvent } from 'react';
import styles from "./productGrid.module.scss"
import { IProduct, ICategoryInfo, IProductFilter, ICategory } from '@/config/interfaces';
import { useModalBackgroundStore, useContactModalStore } from "@/config/store";
import { groupList, sortProductOptions as sortOption, sortProductByOrder, sortMongoQueryByTime, sortProductByPrice, categories, routeStyle, productFilterName, sortProductByRating } from '@/config/utils'

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Image from 'next/image';
import { useClientInfoStore } from "@/config/store";
import ProductCard from '@/components/cards/product/ProductCard';
import { Add, Category, Tune } from '@mui/icons-material';
import { getItem, notify, removeItem, setItem } from '@/config/clientUtils';
import DisplayBar from '@/components/displayBar/DisplayBar';

///Commencing the code 
/**
 * @title Product Component
 * @returns The Product component
 */
const ProductGrid = ({ product_, view_ }: { product_: Array<IProduct>, view_: string | undefined }) => {
    const routerPath = usePathname();
    const [productList, setProductList] = useState(product_)
    const [products, setProducts] = useState<Array<IProduct>>([...productList])
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
        console.log('Products1: ', product_, productList, products)

        if (productFilter) {
            if (productFilter.filterId) {
                _filterProduct(productFilter.filterId!)
                //setSortId(() => )
            }
            
            if (productFilter.category) {
                if (typeof productFilter.category !== "string") {
                    const filterCategory = productFilter.category as unknown as ICategory
                    console.log("Filter Category: ", filterCategory)
                    const newProducts = productList.filter((product) => product.category?.mini === filterCategory?.mini)
                    setProducts(() => [...newProducts])

                    const _index = categories.findIndex((category) => category.macro === filterCategory.macro)
                    setMacroCategoryId(_index + 1);
                    setMiniCategory(filterCategory.mini!)
                }
            }
            //removeItem(productFilterName)
        }
    }, [productFilter, productList, product_, products])

    useEffect(() => {
        //Setting product filter
         

        const intervalId = setInterval(() => {
            //console.log("Effect: ", products)
            setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [products, productList, product_]);

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
    
    useEffect(() => {
        if (timeLeft === 0) {
        setTimeLeft(86400);
        }
    }, [timeLeft]);

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
            setProducts(() => [...productList])
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
            const newProducts = productList.filter((product) => product.category?.mini === miniCategory)
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

    return (
        <main className={`${styles.main} ${routeStyle(routerPath, styles)}`} id="products">
            <div className={styles.header_section}>
                <span className={styles.text}>{products?.length} product{products.length > 1 ? "s": ""} found</span>
            </div>
            <div className={styles.product_list}>
                <div className={styles.filters}>
                    <div className={`${styles.sort_section}`}>
                        <button className={styles.sort_button} onClick={() => setSort(!sort)}>
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
                </div>
                <div className={styles.product_carousel}>
                    {products && products.length !== 0 ? products.map((product, _id) => (
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