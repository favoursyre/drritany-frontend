"use client"
///Product Card component

///Libraries -->
import styles from "./productCard.module.scss"
import Image from "next/image";
import { IProduct, IClientInfo, IWishlistResearch, ISheetInfo } from "@/config/interfaces";
import { useState, useEffect, useMemo } from "react";
import type { MouseEvent, TouchEvent } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { slashedPrice, routeStyle, round, wishListName, getCustomPricing, storeWishInfo, getDeliveryFee, clientInfoName, extractBaseTitle, hashValue } from "@/config/utils";
import { getItem, notify, setItem } from "@/config/clientUtils";
import { useClientInfoStore, useModalBackgroundStore, useLoadingModalStore } from "@/config/store";
import { Discount, FavoriteBorder, DeleteOutline } from '@mui/icons-material';
import Loading from "@/components/loadingCircle/Circle";
import { countryList } from "@/config/database";
import { Cache } from "@/config/clientUtils";
import { sendGTMEvent } from "@next/third-parties/google";

///Commencing the code 
/**
 * @title Product Card Component
 * @returns The Product Card component
 */
const ProductCard = ({ product_, view_ }: { product_: IProduct, view_: string | undefined }) => {
    const [product, setProduct] = useState<IProduct>({...product_})
    //const clientInfo = useClientInfoStore(state => state.info)
    const router = useRouter()
    const [view, setView] = useState<string>(view_!)
    //const [customPrice, setCustomPrice] = useState<number>(getCustomPricing(product, 0, clientInfo?.country?.name?.common!))
    //const [wishList, setWishList] = useState<Array<IProduct>>(getItem(wishListName))
    const routerPath = usePathname();
    const [deleteIsLoading, setDeleteIsLoading] = useState<boolean>(false)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    //const setDiscountModal = useDiscountModalStore(state => state.setDiscountModal);
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal);
    const [imageHasLoaded, setImageHasLoaded] = useState<boolean>(false)
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo ? _clientInfo : undefined)
    //const _products = Cache(productsName).get()
    //const [products, setProducts] = useState<Array<IProduct> | undefined>(_products?.value!)

    //Updating products
    useEffect(() => {
        //console.log("View: ", view)
        setProduct(() => product_)
    }, [product_]);

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
        const info = getItem(clientInfoName);
        if (info) {
            setClientInfo(info);
            setModalBackground(false);
            setLoadingModal(false);
        }
    }, [setModalBackground, setLoadingModal]);

    //This displays the custom price based on the country if it exist
    // const customPrice = (): number => {
    //     let customPrice
    //     let newCustomPrice
    //     const clientCountry = countryList.find((c) => c.name?.common === clientInfo?.country?.name?.common)
    //     const variant = product.pricing?.variantPrices?.find((c) => c.country === clientCountry?.name?.common || c.country === clientCountry?.name?.abbreviation)
    //     if (variant && clientCountry) {
    //         customPrice = variant.amount! //* clientCountry?.currency?.exchangeRate!
    //     } else {
    //         customPrice = product.pricing?.basePrice!
    //     }

    //     //This calculates delivery fee
    //     if (product.addDelivery === false && product.addDelivery !== undefined) {
    //         newCustomPrice = customPrice
    //     } else {
    //         let deliveryFee = getDeliveryFee(product.specification?.weight!, clientCountry?.name?.common!)
    //         newCustomPrice = customPrice + deliveryFee
    //     }
        
    //     // const inflation = clientCountry?.priceInflation ? clientCountry.priceInflation : 0
    //     // if (inflation === 0) {
    //     //     customPrice = product.pricing?.basePrice!
    //     // } else {
    //     //     customPrice = ((inflation / 100) * product.pricing?.basePrice!) + product.pricing?.basePrice!
    //     // }

    //     return newCustomPrice
    // }

    ///This handles what happens when a product is clicked
    const viewProduct = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>, id: string) => {
        e.preventDefault()

        setModalBackground(true)
        setLoadingModal(true)

        router.push(`/products/${id}`);
    }

    ///This handles what happens when a product is hovered on
    const prefetchProduct = (e: MouseEvent<HTMLElement, globalThis.MouseEvent> | TouchEvent<HTMLElement>, id: string) => {
        if (e instanceof MouseEvent) {
            e.preventDefault(); // 👍 This won't break on touch
        }

        router.prefetch(`/products/${id}`);
    }

    // Memoize custom price calculation
    const customPrice = useMemo(() => {
        if (!clientInfo) return product_.pricing?.basePrice || 0;
        const clientCountry = countryList.find(
            (c) => c.name?.common === clientInfo.countryInfo?.name?.common
        );
        const variant = product_.pricing?.variantPrices?.find(
            (v) => v.country === clientCountry?.name?.common || v.country === clientCountry?.name?.abbreviation
        );
        let basePrice = variant?.amount || product_.pricing?.basePrice || 0;

        if (product_.addDelivery !== false) {
            const deliveryFee = getDeliveryFee(product_.specification?.weight || 0, clientCountry?.name?.common || "");
            basePrice += deliveryFee;
        }

        const exchangeRate = clientInfo.countryInfo?.currency?.exchangeRate || 1;
        return round(basePrice * exchangeRate, 2);
    }, [product_, clientInfo]);

    // Memoize slashed price
    const slashedCustomPrice = useMemo(() => {
        return product_.pricing?.discount ? round(slashedPrice(customPrice, product_.pricing.discount), 2) : null;
    }, [customPrice, product_.pricing?.discount]);

    ///This function opens discount modal
    // const openDiscountModal = (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent>): void => {
    //     e.preventDefault()
    //     const productName = product.name as unknown as string
    //     const productFreeOption = product.freeOption as unknown as boolean

    //     setDiscountProduct({ name: productName, freeOption: product.freeOption as unknown as boolean, poppedUp: false })
    //     setModalBackground(true)
    //     setDiscountModal(true)
    // }

    const getViewClass = (view: string | undefined) => {
        switch (view) {
            case "slide":
                return styles.slideView
            case "query":
                return styles.queryView
            case "wishSlide1":
                return styles.slideView
            default: 
                undefined
        }
    }

    //This function is triggered when wish/wish delete is clicked
    const wishProduct = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        const wishList_ = getItem(wishListName) as unknown as Array<IProduct>
        if (view === "wishSlide1") {
            //This deletes a product from the wish list
            if (wishList_) {
                setDeleteIsLoading(() => true)
                const newWishList = wishList_.filter((p) => p._id !== product._id);
                setItem(wishListName, newWishList)
                storeWishInfo("Deleted", clientInfo!, product)
                notify("success", "Product deleted from wish list")
                window.location.reload()
            }

        } else {
            let wishListAdded: boolean = false
            //This adds a product to the wish list
            if (wishList_) {
                const exists = wishList_.some((p) => p._id === product._id);
                if (exists) {
                    notify('info', "Product has already been added to wish list")
                } else {
                    const newWishList = [ ...wishList_, product ]
                    setItem(wishListName, newWishList)
                    storeWishInfo("Added", clientInfo!, product)
                    notify("success", "Product added to wish list")
                    wishListAdded = true
                }
            } else {
                const newWishList: Array<IProduct> = [ product ]
                setItem(wishListName, newWishList)
                storeWishInfo("Added", clientInfo!, product)
                notify("success", "Product added to wish list")
                wishListAdded = true
            }
            
            //Sending a gtm add to wishlist event
            if (wishListAdded) {
                const countryInfo_ = countryList.find((country) => country.name?.common === clientInfo?.ipData?.country)
                const stateInfo_ = countryInfo_?.states?.find((state) => state.name === clientInfo?.ipData?.region)
                const wishList__ = getItem(wishListName) as unknown as Array<IProduct>
                sendGTMEvent({
                    event: 'add_to_wishlist',
                    ecommerce: {
                        content_type: 'product',
                        content_ids: wishList__.map((item) => item._id),
                        content_name: extractBaseTitle(document.title),
                        value: round((customPrice * countryInfo_?.currency?.exchangeRate!), 2),
                        currency: countryInfo_?.currency?.abbreviation,
                        content_category: product.category?.micro,
                        contents: wishList__.map((item) => ({
                            id: item._id,
                            name: item.name,
                            quantity: 1,
                            item_price: getCustomPricing(item, 0, countryInfo_?.name?.common!),
                        }))
                    },
                    clientInfo: {
                        id: hashValue(clientInfo?._id!),
                        ip: clientInfo?.ipData?.ip!,
                        city: hashValue(clientInfo?.ipData?.city?.trim().toLowerCase()!),
                        region: hashValue(stateInfo_?.abbreviation?.trim().toLowerCase()!),
                        country: hashValue(countryInfo_?.name?.abbreviation?.trim().toLowerCase()!)
                    }
                })
            }
        }
    }

    return (
        <main 
            className={`${styles.main} ${getViewClass(view)}`} 
            onClick={(e) => viewProduct(e, product._id!)}
            onMouseEnter={(e) => prefetchProduct(e, product._id!)}
            onTouchStart={(e) => prefetchProduct(e, product._id!)}
        >
            <div className={styles.discounts}>
                <div className={styles.percent}>
                    <span>-{product.pricing?.discount}%</span>
                </div>
                <button onClick={(e) => wishProduct(e)}>
                    {view === "wishSlide1" ? (
                        <>
                            {deleteIsLoading ? (
                                <Loading width="10px" height="10px" />
                            ) : (
                                <DeleteOutline className={styles.icon} />
                            )}
                        </>
                    ) : (
                        <FavoriteBorder className={styles.icon} />
                    )}
                </button>
                {/* {product.extraDiscount ? (
                    <Discount className={styles.offer} onClick={(e) => openDiscountModal(e)} />
                ) : (
                    <></>
                )} */}
            </div>
            <div className={styles.card_image}>
                {/* {!imageHasLoaded && <Loading width="20px" height="20px" />} */}
                <Image
                    //className={`${styles.img} ${!imageHasLoaded ? styles.hiddenImg : ''}`} 
                    className={`${styles.img}`} 
                    src={product.images[0].src}
                    alt=""
                    width={product.images[0].width}
                    height={product.images[0].height}
                    priority={routerPath.includes("/products")}
                    //onLoad={() => setImageHasLoaded(true)}
                />
            </div>
            <div className={styles.card_name}>
                <span>{product.name}</span>
            </div>
            <div className={styles.card_price}>
                    <div className={styles.price_1}>
                        <strong>
                            {/* <span dangerouslySetInnerHTML={{ __html: decodedString(nairaSymbol) }} /> */}
                            {clientInfo ? (
                                <span>{clientInfo?.countryInfo?.currency?.symbol}</span>
                            ) : (
                                <></>
                            )}
                            {clientInfo?.countryInfo?.currency?.exchangeRate ? (
                                <span>
                                    {customPrice.toLocaleString("en-US")}
                                </span>
                            ) : (
                                <></>
                            )}
                        </strong>
                    </div>
                    <div className={styles.price_2}>
                        {/* {clientInfo ? (<span dangerouslySetInnerHTML={{ __html: decodedString(getCurrencySymbol(clientInfo)) }} />) : (<></>)} */}
                        {clientInfo ? (
                            <span>{clientInfo?.countryInfo?.currency?.symbol}</span>
                        ) : (
                            <></>
                        )}
                        {clientInfo?.countryInfo?.currency?.exchangeRate ? (
                            <span>
                                {slashedCustomPrice!.toLocaleString("en-US")}
                            </span>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
        </main>
    );
};
  
export default ProductCard;