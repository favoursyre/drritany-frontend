"use client"
///product component

///Libraries -->
import { useRouter } from 'next/navigation';
import { useState, useEffect, MouseEvent } from 'react';
import styles from "./productGrid.module.scss"
import { IProduct, IClientInfo } from '@/config/interfaces';
import { getItem } from "@/config/clientUtils"
import { groupList, sortOptions as sortOption, decodedString, getCurrencySymbol, getExchangeRate, nairaSymbol, nairaRate, discount, slashedPrice, domainName, sortProductByOrder, sortProductByLatest, sortProductByPrice } from '@/config/utils'
import TuneIcon from '@mui/icons-material/Tune';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Image from 'next/image';

///Commencing the code 
/**
 * @title Product Component
 * @returns The Product component
 */
const Product = ({ product_ }: { product_: Array<IProduct> }) => {
    const router = useRouter();
    const [productList, setProductList] = useState(product_)
    const [products, setProducts] = useState<Array<IProduct>>([])
    const [pcCurrentIndex, setPcCurrentIndex] = useState(0)
    const [mobileCurrentIndex, setMobileCurrentIndex] = useState(0)
    const [sort, setSort] = useState(false)
    const [sortId, setSortId] = useState(0)
    const [sortOptions, setSortOptions] = useState(sortOption) 
    const [pcTotalPage, setPcTotalPage] = useState<Array<any>>([])
    const [mobileTotalPage, setMobileTotalPage] = useState<Array<any>>([])
    const [timeLeft, setTimeLeft] = useState<number>(54400);
    const [width, setWidth] = useState<number>(typeof window !== 'undefined' && window.screen ? window.screen.width : 0)
    const clientInfo: IClientInfo = getItem("clientInfo")
    //console.log("Products: ", productList)

    // const res_ = await fetch(`${domainName}/api/product`)
    // console.log("Res: ", res_.json())


    ///
    useEffect(() => {
        const intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    ///
    useEffect(() => {
        
        const intervalId = setInterval(() => {
            //console.log("checking screen width")
            if (width <= 550) {
                const totalPage = groupList(productList, 6) //This gets the total products in groups of 6
                setMobileTotalPage(totalPage)
                setProducts(totalPage[mobileCurrentIndex])
                //console.log("check: ", mobileCurrentIndex)
            } else {
                const totalPage = groupList(productList, 12) //This gets the total products in groups of 12
                setPcTotalPage(totalPage)
                setProducts(totalPage[pcCurrentIndex])
            };
            //console.log('Products: ', products)
        }, 500);

        return () => clearInterval(intervalId);
    }, [mobileCurrentIndex, pcCurrentIndex, products, sort, sortId, productList, width]);

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

    ///This handles what happens when a product is clicked
    const handleClick = (event: object, id: string) => {
        //console.log("Type: ", typeof event)
        //console.log("id: ", id)
        
        router.push(`/products/${id}`);
    }

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
                setProducts(mobileTotalPage[mobileCurrentIndex])
                //console.log("clicked")
            }
          } else {
            if (pcCurrentIndex + 1 >= pcTotalPage.length) {
                null
            } else {
                //console.log("first: ", pcCurrentIndex)
                setPcCurrentIndex(pcCurrentIndex + 1)
                //console.log("second: ", mobileCurrentIndex)
                setProducts(pcTotalPage[pcCurrentIndex])
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
                setProducts(mobileTotalPage[mobileCurrentIndex])
                console.log("clicked")
            }
        } else {
            if (pcCurrentIndex + 1 <= 1) {
                null
            } else {
                //console.log("first: ", mobileCurrentIndex)
                setMobileCurrentIndex(pcCurrentIndex - 1)
                //console.log("second: ", mobileCurrentIndex)
                setProducts(pcTotalPage[pcCurrentIndex])
                //console.log("clicked")
            }
        }
    }

    ///This function filters the products
    const filterProduct = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, sort: number): Promise<void> => {
        e.preventDefault()
        setSort(false)
        setSortId(sort)

        if (sort === 0) {
            product_ = sortProductByOrder(productList)
            setProductList(product_)
        } else if (sort === 1) {
            product_ = sortProductByLatest(productList)
            setProductList(() => product_)
        } else if (sort === 2) {
            product_ = sortProductByPrice(productList, "descend")
            setProductList(() => product_)
        } else if (sort === 3) {
            product_ = sortProductByPrice(productList, "ascend")
            setProductList(() => product_)
        }
    }

    return (
        <main className={`${styles.main}`} id="products">
            <div className={styles.product_list}>
                <div className={styles.time_section}>
                    <span>Time remaining: {formatTime(timeLeft)}</span>
                </div>
                <div className={`${styles.sort_section}`}>
                   <button className={styles.sort_button} onClick={() => setSort(!sort)}>
                        <TuneIcon />
                    </button> 
                    <span>Sort</span>
                    <div className={`${styles.sort_option} ${!sort ? styles.inactiveSort : ""}`}>
                        {sortOptions.map((option, _id) => (
                            <button key={_id} className={sortId === _id ? styles.activeSortButton : styles.inActiveSortButton} onClick={(e) => filterProduct(e, option.id)}>{option.name}</button>
                        ))}
                    </div>
                </div>
                <div className={styles.product_carousel_section}>
                    {products ? products.map((product, _id) => (
                        <div className={styles.product_carousel} key={_id} onClick={event => handleClick(event, product._id)}>
                        <div className={styles.carousel_image}>
                            <Image
                                className={styles.img} 
                                src={product.images[0].src}
                                alt=""
                                width={product.images[0].width}
                                height={product.images[0].height}
                            />
                        </div>
                        <div className={styles.carousel_name}>
                            <span>{product.name}</span>
                        </div>
                        <div className={styles.carousel_price}>
                            <div className={styles.price_1}>
                                <strong>
                                    <span dangerouslySetInnerHTML={{ __html: decodedString(nairaSymbol) }} />
                                    <span>{product.price ? (Math.round(product.price * nairaRate)).toLocaleString("en-US") : ""}</span>
                                </strong>
                            </div>
                            <div className={styles.price_2}>
                                {/* {clientInfo ? (<span dangerouslySetInnerHTML={{ __html: decodedString(getCurrencySymbol(clientInfo)) }} />) : (<></>)} */}
                                <span dangerouslySetInnerHTML={{ __html: decodedString(nairaSymbol) }} />
                                <span>{product.price ? (Math.round(slashedPrice(product.price * nairaRate, discount))).toLocaleString("en-US") : (<></>)}</span>
                            </div>
                        </div>
                    </div>
                    )) : (<></>)}
                    <div className={styles.pagination_section}>
                        <button onClick={e => goPrev(e)}>
                            <KeyboardArrowLeftIcon />
                        </button>
                        <span>{width <= 550 ? mobileCurrentIndex + 1 : pcCurrentIndex + 1} / {width <= 550 ? mobileTotalPage.length : pcTotalPage.length}</span>
                        <button onClick={e => goNext(e)}>
                            <KeyboardArrowRightIcon />
                        </button>
                    </div>
                </div>
            </div>
            
        </main>
    );
};
  
export default Product;