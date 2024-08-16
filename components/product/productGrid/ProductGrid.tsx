"use client"
///product component

///Libraries -->
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, MouseEvent } from 'react';
import styles from "./productGrid.module.scss"
import { IProduct, IClientInfo } from '@/config/interfaces';
import { groupList, sortOptions as sortOption, sortProductByOrder, sortProductByLatest, sortProductByPrice, categories, sortByCategory, routeStyle } from '@/config/utils'
import TuneIcon from '@mui/icons-material/Tune';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Image from 'next/image';
import { useClientInfoStore } from "@/config/store";
import ProductCard from '@/components/cards/product/ProductCard';
import CategoryIcon from '@mui/icons-material/Category';
import { notify } from '@/config/clientUtils';
import DisplayBar from '@/components/displayBar/DisplayBar';

///Commencing the code 
/**
 * @title Product Component
 * @returns The Product component
 */
const ProductGrid = ({ product_, view_ }: { product_: Array<IProduct>, view_: string | undefined }) => {
    const routerPath = usePathname();
    const [productList, setProductList] = useState(product_)
    const [products, setProducts] = useState<Array<IProduct>>(productList)
    const [pcCurrentIndex, setPcCurrentIndex] = useState(0)
    const [mobileCurrentIndex, setMobileCurrentIndex] = useState(0)
    const [sort, setSort] = useState(false)
    const [sortId, setSortId] = useState(0)
    const [sortOptions, setSortOptions] = useState(sortOption)
    const [category, setCategory] = useState<boolean>(false)
    const [categoryId, setCategoryId] = useState<number>(0)
    const [categoryOptions, setCategoryOptions] = useState<Array<string>>(["All", ...categories.map((category) => category.macro)]) 
    const [pcTotalPage, setPcTotalPage] = useState<Array<any>>([])
    const [mobileTotalPage, setMobileTotalPage] = useState<Array<any>>([])
    const [timeLeft, setTimeLeft] = useState<number>(54400);
    const [width, setWidth] = useState<number>(typeof window !== 'undefined' && window.screen ? window.screen.width : 0)
    const [view, setView] = useState<string | undefined>(view_)

    ///
    useEffect(() => {
        const intervalId = setInterval(() => {
            //console.log("Effect: ", products)
            setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [products, productList, product_]);

    ///

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
        setSort(false)
        setSortId(sort)

        //let newProducts
        if (sort === 0) {
            const newProducts = sortProductByOrder(productList)
            //setProductList(() => [...product_])
            setProducts(() => [...newProducts])
        } else if (sort === 1) {
            const newProducts = sortProductByLatest(productList)
            //product_ = sortByCategory(productList, "Health & Personal Care")
            //setProductList(() => [...product_])
            setProducts(() => [...newProducts])
        } else if (sort === 2) {
            const newProducts = sortProductByPrice(productList, "descend")
            //setProductList(() => [...product_])
            setProducts(() => [...newProducts])
        } else if (sort === 3) {
            const newProducts = sortProductByPrice(productList, "ascend")
            //setProductList(() => [...product_])
            setProducts(() => [...newProducts])
        }
    }

    ///This function chooses the products category
    const chooseCategory = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, _id: number): Promise<void> => {
        e.preventDefault()
        setCategory(() => false)
        setCategoryId(() => _id)
        const category: string = categoryOptions[_id]

        const newProduct = sortByCategory(productList, category)
        console.log('New Product: ', category, newProduct)
        if (newProduct && newProduct.length !== 0) {
            setProducts(() => [...newProduct])
        } else {
            notify("info", "Products doesn't exist in this category yet, check back later")
        }
        
        //console.log('Products: ', products)
    }

    useEffect(() => {
        console.log('Products1: ', products)
    }, [products]);

    return (
        <main className={`${styles.main} ${routeStyle(routerPath, styles)}`} id="products">
            {/* <div className={styles.header_section}>
                 <span>Time remaining: {formatTime(timeLeft)}</span> 
                <span>Shop Now & Pay on Delivery</span>
            </div> */}
            <DisplayBar text_={undefined}/>
            <div className={styles.product_list}>
                <div className={styles.filters}>
                    <div className={`${styles.sort_section}`}>
                        <button className={styles.sort_button} onClick={() => setSort(!sort)}>
                            <TuneIcon />
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
                            <CategoryIcon />
                        </button> 
                        <div className={`${styles.category_option} ${!category ? styles.inactiveSort : ""}`}>
                            {categoryOptions.map((category, _id) => (
                                <button key={_id} className={categoryId === _id ? styles.activeSortButton : styles.inActiveSortButton} onClick={(e) => chooseCategory(e, _id)}>{category}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.product_carousel}>
                    {products ? products.map((product, _id) => (
                        <ProductCard key={_id} product_={product} view={view} />
                    )) : (<></>)}
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