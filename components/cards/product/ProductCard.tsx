"use client"
///Product Card component

///Libraries -->
import styles from "./productCard.module.scss"
import Image from "next/image";
import { IProduct, IClientInfo, IWishlistResearch, ISheetInfo, IButtonResearch, ICartItem, ICart, IMetaWebEvent, MetaActionSource, MetaStandardEvent } from "@/config/interfaces";
import { useState, useEffect, useMemo } from "react";
import type { MouseEvent, TouchEvent } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { slashedPrice, routeStyle, round, wishListName, getCustomPricing, storeWishInfo, getDeliveryFee, clientInfoName, extractBaseTitle, hashValue, getCurrentDate, getCurrentTime, storeButtonInfo, removeUndefinedKeys, areObjectsEqual, cartName, storeCartInfo, sendMetaCapi, domainName } from "@/config/utils";
import { getItem, notify, setItem, getDevice, getOS, getFacebookCookies, addToCart } from "@/config/clientUtils";
import { useClientInfoStore, useModalBackgroundStore, useLoadingModalStore } from "@/config/store";
import { Discount, FavoriteBorder, DeleteOutline, AddShoppingCart, Whatshot } from '@mui/icons-material';
import Loading from "@/components/loadingCircle/Circle";
import { countryList } from "@/config/database";
import { Cache } from "@/config/clientUtils";
import { sendGTMEvent } from "@next/third-parties/google";
import { v4 as uuid } from 'uuid';

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
    const [addToCartIsLoading, setAddToCartIsLoading] = useState<boolean>(false)
    const [colorId, setColorId] = useState<number>(0)
    const [sizeId, setSizeId] = useState<number>(0)
    const [quantity, setQuantity] = useState(1)
    const [cart, setCart] = useState<ICart | null>(getItem(cartName))
    const [addedToCart, setAddedToCart] = useState<boolean>(false)
    const [showFreeShipping, setShowFreeShipping] = useState(true);
    const [width, setWidth] = useState<number>(typeof window !== 'undefined' && window.screen ? window.screen.width : 0)
    const left: boolean = false
    //console.log('Router Path: ', routerPath)

    // Update width on resize
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => setWidth(window.screen.width);
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // State for current promo index (0 = Free Shipping, 1 = Stock Left, 2 = Sold)
    const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

    // Effect to cycle promos every 3 seconds when width <= 1000 and stock conditions are met
    useEffect(() => {

        // Cycle all three promos if stock <= 20
        const intervalId = setInterval(() => {
            //console.log("Cycling all promos");
            setCurrentPromoIndex((prev) => (prev + 1) % 4); // Cycle through 0, 1, 2, 3
        }, 3000); // Switch every 3 seconds
        return () => clearInterval(intervalId); // Cleanup interval

    }, [width, product.stock]); // Re-run when width or stock changes

    //Updating products
    useEffect(() => {
        //console.log("View: ", view)
        setProduct(() => product_)
    }, [product_]);
    
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

    // Memoize custom price calculation
    const customPrice_ = useMemo(() => {
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

    // Memoize custom price --- This function is from product info
    const customPrice = useMemo(() => {
        return clientInfo ? getCustomPricing(product_, sizeId, clientInfo.countryInfo?.name?.common || "") : product_.pricing?.basePrice || 0;
    }, [product_, sizeId, clientInfo]);

    // Memoize slashed price
    const slashedCustomPrice = useMemo(() => {
        return product_.pricing?.discount ? round(slashedPrice(customPrice_, product_.pricing.discount), 2) : null;
    }, [customPrice, product_.pricing?.discount]);

    // Determine if stock promo should show (stock defined and <= 20)
    const showStockPromo = product.stock && product.stock <= 20;
    // Set stock text based on availability
    //const stockText = showStockPromo ? `Only 7 left` : 'Limited Stock';

    const promos = [
        // Free Shipping promo
        <div key="free" className={styles.free}>
            <span>Free Shipping</span>
        </div>,
        // Stock Left promo, included only if stock <= 20
        <div key="stock" className={`${styles.left} ${showStockPromo ? styles.left_ : ''}`}>
            {showStockPromo ? (
                <>
                    <Whatshot className={styles.icon} />
                    <span>Only {product.stock} left</span>
                </>
            ) : (
                <span>Limited Stock</span>
            )}
        </div>,
        //Amount saved
        <div key="save" className={styles.save}>
            {clientInfo?.countryInfo?.currency?.exchangeRate ? (
                <span>Save {clientInfo.countryInfo?.currency?.symbol}{(slashedCustomPrice! - customPrice_!).toLocaleString("en-US")}</span>
            ) : (
                <></>
            )}
        </div>,
        // Sold promo, always included
        <div key="sold" className={styles.sold}>
            <span>{product.orders === 0 ? 51 : product.orders?.toLocaleString("en-US")} sold</span>
        </div>,
    ];

    ///This handles what happens when a product is clicked
    const viewProduct = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>, id: string) => {
        e.preventDefault()

        setModalBackground(true)
        setLoadingModal(true)

        //window.open(`${domainName}/products/${id}`, '_blank')
        router.push(`/products/${id}`);
    }

    ///This handles what happens when a product is hovered on
    const prefetchProduct = (e: MouseEvent<HTMLElement, globalThis.MouseEvent> | TouchEvent<HTMLElement>, id: string) => {
        if (e instanceof MouseEvent) {
            e.preventDefault(); // 👍 This won't break on touch
        }

        router.prefetch(`/products/${id}`);
    }

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
    const wishProduct = async (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
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
                //Storing this info in button research
                const info: IButtonResearch = {
                    ID: clientInfo?._id!,
                    IP: clientInfo?.ipData?.ip!,
                    City: clientInfo?.ipData?.city!,
                    Region: clientInfo?.ipData?.region!,
                    Country: clientInfo?.ipData?.country!,
                    Button_Name: "wishProduct()",
                    Button_Info: `Added "${product.name}" to wish list in product info`,
                    Page_Title: extractBaseTitle(document.title),
                    Page_URL: routerPath,
                    Date: getCurrentDate(),
                    Time: getCurrentTime(),
                    OS: getOS(),
                    Device: getDevice()
                }
                storeButtonInfo(info)
    
                //Sending page view event to gtm
                const countryInfo_ = clientInfo?.countryInfo //countryList.find((country) => country.name?.common === clientInfo?.ipData?.country)
                //const stateInfo_ = countryInfo_?.states?.find((state) => state.name === clientInfo?.ipData?.region)
                const eventTime = Math.round(new Date().getTime() / 1000)
                const eventId = uuid()
                const wishList__ = getItem(wishListName) as unknown as Array<IProduct>
                const userAgent = navigator.userAgent
                const { fbp, fbc } = getFacebookCookies();
                const eventData: IMetaWebEvent = {
                    data: [
                        {
                            event_name: MetaStandardEvent.AddToWishlist,
                            event_time: eventTime,
                            event_id: eventId,
                            action_source: MetaActionSource.website,
                            custom_data: {
                                content_name: extractBaseTitle(document.title),
                                content_ids:  wishList__.map((item) => item._id!),
                                content_type: wishList__.length === 1 ? "product" : "product_group",
                                value: round((customPrice * countryInfo_?.currency?.exchangeRate!), 2),
                                currency: countryInfo_?.currency?.abbreviation,
                                content_category: product.category?.micro,
                                contents: wishList__.map((item) => ({
                                    id: item._id,
                                    //name: item.name,
                                    quantity: 1,
                                    item_price: getCustomPricing(item, 0, countryInfo_?.name?.common!),
                                }))
                            },
                            user_data: {
                                client_user_agent: userAgent,
                                client_ip_address: clientInfo?.ipData?.ip!,
                                external_id: hashValue(clientInfo?._id!),
                                fbc: fbc!,
                                fbp: fbp!,
                                //ct: hashValue(clientInfo?.ipData?.city?.trim().toLowerCase()!),
                                //st: hashValue(stateInfo_?.abbreviation?.trim().toLowerCase()!),
                                country: hashValue(countryInfo_?.name?.abbreviation?.trim().toLowerCase()!)
                            },
                            original_event_data: {
                                event_name: MetaStandardEvent.AddToWishlist,
                                event_time: eventTime,
                            }
                        }
                    ]
                } 
                sendGTMEvent({ event: eventData.data[0].event_name, value: eventData.data[0] })
                await sendMetaCapi(eventData, clientInfo?._id!, getOS(), getDevice())
            }
        }

        if (routerPath === "/wishList") {
            window.location.reload()
        }
    }

    //This function is triggerred when add to cart is clicked
    // const addToCart = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, order: boolean): Promise<void> => {
    //     e.preventDefault()
    //     e.stopPropagation()
        
    //     const p = product
    //     let storeCartEvent: boolean = false

    //     if (p.pricing?.inStock === false) {
    //         notify("info", "This product is currently out of stock, check back later!")

    //         //Storing this info in button research
    //         const info: IButtonResearch = {
    //             ID: clientInfo?._id!,
    //             IP: clientInfo?.ipData?.ip!,
    //             City: clientInfo?.ipData?.city!,
    //             Region: clientInfo?.ipData?.region!,
    //             Country: clientInfo?.ipData?.country!,
    //             Button_Name: "addToCart()",
    //             Button_Info: `Tried adding "${p.name}" to cart in product info but its out of stock`,
    //             Page_Title: extractBaseTitle(document.title),
    //             Page_URL: routerPath,
    //             Date: getCurrentDate(),
    //             Time: getCurrentTime(),
    //             OS: getOS(),
    //             Device: getDevice()
    //         }
    //         await storeButtonInfo(info)

    //         return
    //     } else {
    //         setAddToCartIsLoading(() => true)

    //         const pWeight: number = p.specification?.weight as unknown as number
    //         const cartSpecs = removeUndefinedKeys({
    //             color: p.specification?.colors ? p.specification?.colors[colorId] : undefined,
    //             size: p.specification?.sizes ? p.specification?.sizes[sizeId] : undefined
    //         })
    //         //const productName = `${p.name} ${formatObjectValues(cartSpecs)}`
    //         const deliveryFee_ = getDeliveryFee(pWeight, clientInfo?.countryInfo?.name?.common!)

    //         //Arranging the cart details
    //         const cartItem: ICartItem = {
    //             _id: p._id!,
    //             image: p.images[0],
    //             name: p.name,
    //             unitPrice: customPrice,
    //             unitWeight: pWeight,
    //             unitHiddenDeliveryFee: deliveryFee_,
    //             discountPercent: p.pricing?.discount!,
    //             category: p.category?.mini!,
    //             quantity: quantity,
    //             subTotalWeight: quantity * pWeight, 
    //             specs: cartSpecs,
    //             extraDiscount: p.pricing?.extraDiscount!,
    //             subTotalHiddenDeliveryFee: deliveryFee_ * quantity,
    //             subTotalPrice: customPrice * quantity,
    //             subTotalDiscount: 0
    //         }
    //         //console.log("Quantity: ", quantity)
    //         //cartItem.subTotalPrice = Number((cartItem.unitPrice * cartItem.quantity).toFixed(2))
    //         //const totalPrice = Number(cartItem.subTotalPrice.toFixed(2))

    //         let discount
    //         if (cartItem.extraDiscount?.limit! && cartItem.quantity >= cartItem.extraDiscount?.limit!) {
    //             cartItem.subTotalDiscount = Number(((cartItem.extraDiscount?.percent! / 100) * cartItem.subTotalPrice).toFixed(2))
    //             //discount = (10 / 100) * totalPrice
    //         } else {
    //             cartItem.subTotalDiscount = 0
    //         }
    //         const totalDiscount = Number(cartItem.subTotalDiscount.toFixed(2))
    //         const totalWeight = Number(cartItem.subTotalWeight.toFixed(2))
    //         const deliveryFee = getDeliveryFee(totalWeight, clientInfo?.countryInfo?.name?.common!)
    //         const totalHiddenDeliveryFee = Number(cartItem.subTotalHiddenDeliveryFee.toFixed(2))

    //         // const productName = `${product.name} (${cartSpecs.color}, ${typeof cartSpecs.size === "string" ? cartSpecs.size : cartSpecs.size.size})`

    //         //Checking if cart already exist for the client
    //         if (cart) {
    //             //console.log(true)
    //             //Getting all the cart items with the same cart ID and specs
    //             let index!: number
                
    //             for (let i = 0; i < cart.cart.length; i++) {
    //                 //console.log("Testing 2: ", cart.cart[i].specs, cartSpecs)
    //                 if (cart.cart[i]._id === p._id && areObjectsEqual(cart.cart[i].specs, cartSpecs)) {
    //                     index = i
    //                     //console.log("Testing: ", areObjectsEqual(cart.cart[i].specs, cartSpecs))
    //                     break;
    //                 }
    //             }

    //             //const countryInfo_ = countryList.find((country) => country.name?.common === clientInfo?.ipData?.country)
    //             //const stateInfo_ = countryInfo_?.states?.find((state) => state.name === clientInfo?.ipData?.region)

    //             //const result = cart.cart.some((cart: ICartItem) => cart._id === p._id);
    //             if (index === undefined) {
    //                 cart.grossTotalPrice = Number((cart.grossTotalPrice + cartItem.subTotalPrice).toFixed(2))
    //                 cart.totalDiscount = Number((cart.totalDiscount + totalDiscount).toFixed(2))
    //                 cart.totalWeight = Number((cart.totalWeight + totalWeight).toFixed(2))
    //                 cart.deliveryFee = Number(deliveryFee.toFixed(2))
    //                 cart.totalHiddenDeliveryFee = Number((cart.totalHiddenDeliveryFee + totalHiddenDeliveryFee).toFixed(2))
    //                 cart.cart.push(cartItem)
    //                 setCart(() => cart)
    //                 setItem(cartName, cart)
    //                 if (!order) {
    //                     notify('success', "Product has been added to cart")
    //                     storeCartEvent = true

    //                 }
    //             } else {
    //                 if (quantity === cart.cart[index].quantity) {
    //                     if (!order) {
    //                         notify('warn', "Item has already been added to cart")
    //                     }
    //                 } else {
    //                     cart.cart[index].quantity = quantity
    //                     cart.cart[index].subTotalPrice = Number((cart.cart[index].unitPrice * quantity).toFixed(2))
    //                     cart.cart[index].subTotalWeight = Number((cart.cart[index].unitWeight * quantity).toFixed(2))
    //                     cart.cart[index].subTotalHiddenDeliveryFee = Number((cart.cart[index].unitHiddenDeliveryFee * quantity).toFixed(2))
    //                     cart.cart[index].subTotalDiscount = quantity >= cart.cart[index].extraDiscount?.limit! ? Number(((cart.cart[index].extraDiscount?.percent!/100) * cart.cart[index].subTotalPrice).toFixed(2)) : 0
    //                     cart.grossTotalPrice = Number((cart.cart.reduce((total: number, cart: ICartItem) => total + cart.subTotalPrice, 0)).toFixed(2));
    //                     cart.totalDiscount = Number((cart.cart.reduce((discount: number, cart: ICartItem) => discount + cart.subTotalDiscount, 0)).toFixed(2));
    //                     cart.totalWeight = Number((cart.cart.reduce((weight: number, cart: ICartItem) => weight + cart.subTotalWeight, 0)).toFixed(2))
    //                     cart.totalHiddenDeliveryFee = Number((cart.cart.reduce((hiddenDeliveryFee: number, cart: ICartItem) => hiddenDeliveryFee + cart.subTotalHiddenDeliveryFee, 0)).toFixed(2))
    //                     cart.deliveryFee = Number((getDeliveryFee(cart.totalWeight, clientInfo?.countryInfo?.name?.common!)).toFixed(2))
    //                     setCart(() => cart)
    //                     setItem(cartName, cart)
    //                     if (!order) {
    //                         notify('success', "Product has been updated to cart")
    //                         storeCartEvent = true
    //                     }
    //                 }
    //             }

    //             // const car_ = localStorage.getItem(cartName)
    //             // const _car_= JSON.parse(car_ || "{}")
    //             // //console.log("cart_: ", _car_)
    //         } else {
    //             //console.log("No cart: ", false)

    //             const cart: ICart = {
    //                 grossTotalPrice: cartItem.subTotalPrice,
    //                 totalDiscount: totalDiscount,
    //                 totalWeight: totalWeight,
    //                 totalHiddenDeliveryFee: totalHiddenDeliveryFee,
    //                 deliveryFee: deliveryFee,
    //                 cart: [cartItem]
    //             }

    //             setItem(cartName, cart)
    //             //const cart_ = getItem(cartName)
    //             //console.log("cart: ", JSON.parse(cart_ || "{}"))
    //             if (!order) {
    //                 notify('success', "Product has been added to cart")
    //             }

    //         }

    //         setAddedToCart(() => true)

    //         //This ends the loading icon
    //         //await sleep(0.5)
    //         setAddToCartIsLoading(() => false)

    //         //Storing this info in button research
    //         const info: IButtonResearch = {
    //             ID: clientInfo?._id!,
    //             IP: clientInfo?.ipData?.ip!,
    //             City: clientInfo?.ipData?.city!,
    //             Region: clientInfo?.ipData?.region!,
    //             Country: clientInfo?.ipData?.country!,
    //             Button_Name: "addToCart()",
    //             Button_Info: `Added "${cartItem.name}" to cart in product info`,
    //             Page_Title: extractBaseTitle(document.title),
    //             Page_URL: routerPath,
    //             Date: getCurrentDate(),
    //             Time: getCurrentTime(),
    //             OS: getOS(),
    //             Device: getDevice()
    //         }
    //         storeButtonInfo(info)
    //     } 

    //     if (storeCartEvent) {
    //         console.log("Store this info....")
    //         //Storing cart infos and events
    //         await storeCartInfo("Added", clientInfo!, product.name!)

    //         //Sending page view event to gtm
    //         const countryInfo_ = clientInfo?.countryInfo //countryList.find((country) => country.name?.common === clientInfo?.ipData?.country)
    //         //const stateInfo_ = countryInfo_?.states?.find((state) => state.name === clientInfo?.ipData?.region)
    //         const eventTime = Math.round(new Date().getTime() / 1000)
    //         const eventId = uuid()
    //         const userAgent = navigator.userAgent
    //         const { fbp, fbc } = getFacebookCookies();
    //         const eventData: IMetaWebEvent = {
    //             data: [
    //                 {
    //                     event_name: MetaStandardEvent.AddToCart,
    //                     event_time: eventTime,
    //                     event_id: eventId,
    //                     action_source: MetaActionSource.website,
    //                     custom_data: {
    //                         content_name: extractBaseTitle(document.title),
    //                         content_ids:  cart?.cart.map((item) => item._id),
    //                         content_type: cart?.cart.length === 1 ? "product" : "product_group",
    //                         value: round(customPrice * countryInfo_?.currency?.exchangeRate!, 2),
    //                         currency: countryInfo_?.currency?.abbreviation,
    //                         content_category: product.category?.micro,
    //                         contents: cart?.cart.map((item) => ({
    //                             id: item._id,
    //                             //name: item.name,
    //                             quantity: item.quantity,
    //                             item_price: item.subTotalPrice,
    //                         }))
    //                     },
    //                     user_data: {
    //                         client_user_agent: userAgent,
    //                         client_ip_address: clientInfo?.ipData?.ip!,
    //                         external_id: hashValue(clientInfo?._id!),
    //                         fbc: fbc!,
    //                         fbp: fbp!,
    //                         //ct: hashValue(clientInfo?.ipData?.city?.trim().toLowerCase()!),
    //                         //st: hashValue(stateInfo_?.abbreviation?.trim().toLowerCase()!),
    //                         country: hashValue(countryInfo_?.name?.abbreviation?.trim().toLowerCase()!)
    //                     },
    //                     original_event_data: {
    //                         event_name: MetaStandardEvent.AddToCart,
    //                         event_time: eventTime,
    //                     }
    //                 }
    //             ]
    //         } 

    //         console.log('Sending GTM event')
    //         sendGTMEvent({ event: eventData.data[0].event_name, value: eventData.data[0] })

    //         console.log('Sending Meta Api event')
    //         await sendMetaCapi(eventData, clientInfo?._id!, getOS(), getDevice())
    //     }

    //     if (routerPath === "/cart") {
    //         window.location.reload()
    //     }
    // }

    const addToCart_ = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, order: boolean): Promise<void> => {
        e.stopPropagation()

        addToCart(
            e,
            order,
            product,
            clientInfo!,
            routerPath,
            customPrice,
            cart!,
            colorId,
            sizeId,
            setAddToCartIsLoading,
            setCart,
            setAddedToCart,
            quantity
        )
    }

    return (
        <main 
            className={`${styles.main} ${getViewClass(view)}`} 
            onClick={(e) => viewProduct(e, product._id!)}
            onMouseEnter={(e) => prefetchProduct(e, product._id!)}
            onTouchStart={(e) => prefetchProduct(e, product._id!)}
        >
            <div className={styles.discounts}>
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
            <div className={styles.addToCart}>
                <button className={styles.addToCartBtn} onClick={(e) => addToCart_(e, false)}>
                    {addToCartIsLoading ? (
                        <Loading width="20px" height="20px" />
                    ) : (
                        <AddShoppingCart className={styles.icon} />
                    )}
                </button>
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
            <div className={styles.price_sold}>
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
                                    {customPrice_.toLocaleString("en-US")}
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
                <div className={styles.percent}>
                    <span>-{product.pricing?.discount}%</span>
                </div>
            </div>
            <div className={styles.free_left}>
                {promos[currentPromoIndex < promos.length ? currentPromoIndex : 0]}
            </div>
        </main>
    );
};
  
export default ProductCard;