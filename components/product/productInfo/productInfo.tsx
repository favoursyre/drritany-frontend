"use client"
///Product Info component

///Libraries -->
import React, { useState, useEffect, MouseEvent, Fragment, useRef, useMemo, ChangeEvent } from "react"
import styles from "./productInfo.module.scss"
import { IProduct, ICart, ICartItem, IClientInfo, IImage, IProductViewResearch, ISheetInfo, IButtonResearch, IMetaWebEvent, MetaActionSource, MetaStandardEvent, IProductReview } from '@/config/interfaces';
import { setItem, notify, getItem, getOS, getDevice, getFacebookCookies, addToCart } from '@/config/clientUtils';
import { round, cartName, getCustomPricing, slashedPrice, deliveryPeriod, getDeliveryFee, wishListName, areObjectsEqual, formatObjectValues, removeUndefinedKeys, checkExtraDiscountOffer, storeWishInfo, storeCartInfo, getCurrentDate, getCurrentTime, backend, statSheetId, sleep, deliveryDuration, capitalizeFirstLetter,extractBaseTitle, storeButtonInfo, clientInfoName, hashValue, sendMetaCapi, formatTime, formatDateMongo, maskString, sortMongoQueryByTime, getRandomNumber, getCountryInfo, calculateMeanRating, customSizeProduct, getSizeRegion, sizeRegionName, getCustomSize } from '@/config/utils'
import { countryList } from "@/config/database";
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Star, AddShoppingCart, StarHalf, Discount, ShoppingCartCheckout, KeyboardArrowLeft, KeyboardArrowRight, Add, Remove, FavoriteBorder, Schedule, Verified, PostAdd, AccountCircle, StarOutline, Whatshot, Visibility } from '@mui/icons-material';
import { useModalBackgroundStore, useDiscountModalStore, useReturnPolicyModalStore, useLoadingModalStore } from '@/config/store';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper as SwiperCore } from 'swiper/types';
import Loading from "@/components/loadingCircle/Circle";
import { EffectCoverflow, Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { sendGTMEvent } from '@next/third-parties/google';
import { v4 as uuid } from 'uuid';

///Commencing the code
/**
 * @title Product Info Component
 * @returns The Product Info component
 */
const ProductInfo = ({ product_, reviews_ }: { product_: IProduct, reviews_: Array<IProductReview> }) => {
    //console.log('Products_: ', product_)
    const [cart, setCart] = useState<ICart | null>(getItem(cartName))
    const [product, setProduct] = useState(product_)
    const [reviews, setReviews] = useState(reviews_)
    //const [checkoutIsLoading]
    const swiperRef = useRef<SwiperCore>();
    const [activeHeading, setActiveHeading] = useState(0);
    const [transformOrigin, setTransformOrigin] = useState('center center');
    //const clientInfo = useClientInfoStore(state => state.info)
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo!)
    const [mainImage, setMainImage] = useState(product.images[0])
    const [mainImageId, setMainImageId] = useState(0)
    const [quantity, setQuantity] = useState(1)
    //const [startDeliveryDate, setStartDeliveryDate] = useState<string>("")
    //const [endDeliveryDate, setEndDeliveryDate] = useState<string>("")
    const router = useRouter()
    const [colorId, setColorId] = useState<number>(0)
    //const [selectColor, setSelectColor] = useState<boolean>(false)
    const [sizeId, setSizeId] = useState<number>(0)
    const sizes = customSizeProduct(product.category?.mini!)
    const [sizeRegion, setSizeRegion] = useState<string>("")
    //const [selectSize, setSelectSize] = useState<boolean>(false)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setDiscountModal = useDiscountModalStore(state => state.setDiscountModal);
    const setReturnPolicyModal = useReturnPolicyModalStore(state => state.setReturnPolicyModal);
    const setDiscountProduct = useDiscountModalStore(state => state.setDiscountProduct);
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal)
    const routerPath = usePathname()
    const discountProduct = useDiscountModalStore(state => state.product);
    //const [customPrice, setCustomPrice] = useState<number>(getCustomPricing(product, 0, clientInfo?.country?.name?.common!))
    const [imageIndex, setImageIndex] = useState<number>(0)
    const [timeLeft, setTimeLeft] = useState<number>(77500000)//(71319000);
    const [videoIndex, setVideoIndex] = useState<number>(0)
    const [activeInfoBtn, setActiveInfoBtn] = useState<number>(0)
    const [addedToCart, setAddedToCart] = useState<boolean>(false)
    const [checkoutIsLoading, setCheckoutIsLoading] = useState<boolean>(false)
    const [addToCartIsLoading, setAddToCartIsLoading] = useState<boolean>(false)
    const [view, setView] = useState<"image" | "video">("image")
    const [isZoomed, setIsZoomed] = useState(false);
    const spec = product.specification
    const stars: Array<number> = [1, 2, 3, 4]
    const [mounted, setMounted] = useState<boolean>(false)
    const [imageHasLoaded, setImageHasLoaded] = useState<boolean>(false)
    const [sheetStored, setSheetStored] = useState<boolean>(false)
    //const [showStockLeft, setShowStockLeft] = useState<boolean>(product.stock && product.stock <= 20 ? true : false)
    const showStockLeft = product.stock && product.stock <= 20
    const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>(
        Object.fromEntries(
          (product.images || []).map((_, index) => [index, false])
        )
      );
    const [viewerCount, setViewerCount] = useState<number>(() => getRandomNumber(17, 97));

    //This updates the viewer count every 30secs
    useEffect(() => {
        const interval = setInterval(() => {
            setViewerCount(getRandomNumber(17, 97));
        }, 30000); // 30 seconds

        return () => clearInterval(interval); // cleanup on unmount
    }, []);

    //console.log("Reviews: ", reviews)

    
      // Fallback: Mark as loaded after a timeout if onLoad doesn't fire
      useEffect(() => {
        const timers = product.images?.map((_, id) => {
          return setTimeout(() => {
            setLoadedImages(prev => ({
              ...prev,
              [id]: true,
            }));
          }, 5000); // Adjust timeout as needed
        });
    
        return () => {
          timers?.forEach(clearTimeout);
        };
      }, [product.images]);

    //For client rendering
    useEffect(() => {
        setMounted(true);
        console.log("Product: ", product)
    }, []);
    //console.log("In Stock: ", product.pricing?.inStock)

    ///This contains the accordian details
    const questions = [
        {
          question: 'Customer Benefits',
          answer: spec?.benefits,

        },
        {
          question: 'Specifications',
          answer: [
            `SKU: ${product._id}`,
            `Brand: ${spec?.brand}`,
            `Item Form: ${spec?.itemForm}`,
            `Item Count: ${spec?.itemCount}`,
            `Gender: ${spec?.gender}`,
            `Age Range: ${spec?.userAgeRange}`,
            spec?.ingredients && spec.ingredients.length > 1 ? `Ingredients: ${spec?.ingredients?.join(", ")}` : undefined,
            //`${spec?.ingredients ? spec.ingredients : ""}`,
            //`${spec?.ingredients ? Ingredients: ${spec?.ingredients?.join(", ") : ""}}`,
            `Product Origin: ${spec?.productOrigin}`,
            `Weight: ${spec?.weight}kg`
        ],
        },
        {
          question: 'How to use?',
          answer: spec?.prescription,
        },
      ];

    //This contains the specifications of the products
    // const specs = [
    //     `SKU: ${product._id}`,
    //     `Condition: Brand New`,
    //     `Brand: ${spec?.brand}`,
    //     spec?.modelNumber ? `Model Number: ${spec.modelNumber}` : undefined,
    //     `Item Form: ${spec?.itemForm}`,
    //     `Item Count: ${spec?.itemCount}`,
    //     `Gender: ${spec?.gender}`,
    //     `Age Range: ${spec?.userAgeRange}`,
    //     spec?.ingredients && spec.ingredients.length > 1 ? `Ingredients: ${spec?.ingredients?.join(", ")}` : undefined,
    //     spec?.power ? `Power: ${spec?.power}w` : undefined,
    //     spec?.voltage ? `Voltage: ${spec?.voltage}v` : undefined,
    //     spec?.horsePower ? `Horsepower: ${spec?.horsePower}hp` : undefined,
    //     spec?.seaters ? `Seaters: ${spec?.seaters}` : undefined,
    //     spec?.engineType ? `Engine: ${spec?.engineType}` : undefined,
    //     spec?.transmissionType ? `Transmission: ${spec?.transmissionType}v` : undefined,
    //     spec?.ramStorage ? `Storage(RAM): ${spec?.ramStorage}gb` : undefined,
    //     spec?.romStorage ? `Storage(ROM): ${spec?.romStorage}gb` : undefined,
    //     spec?.batteryCapacity ? `Battery: ${spec?.batteryCapacity}mAh` : undefined,
    //     `Product Origin: ${spec?.productOrigin}`,
    //     spec?.productLocation ? `Product Location: ${spec.productLocation}` : undefined,
    //     `Weight: ${spec?.weight}kg`,
    //     spec?.dimension?.height ? `Height: ${spec.dimension.height}inches` : undefined,
    //     spec?.dimension?.width ? `Width: ${spec.dimension.width}inches` : undefined,
    //     spec?.dimension?.length ? `Length: ${spec.dimension.length}inches` : undefined,
    //     spec?.manufactureYear ? `Year: ${spec.manufactureYear}` : undefined
    // ]

    // Memoized specs
    const specs = useMemo(() => [
        `SKU: ${product_._id}`,
        `Condition: Brand New`,
        product_.specification?.brand?.toLowerCase().includes("other") ? undefined : `Brand: ${product_.specification?.brand || ""}`,
        product_.specification?.modelNumber ? `Model Number: ${product_.specification.modelNumber}` : undefined,
        `Item Form: ${product_.specification?.itemForm || ""}`,
        `Item Count: ${product_.specification?.itemCount || ""}`,
        `Gender: ${product_.specification?.gender || ""}`,
        `Age Range: ${product_.specification?.userAgeRange || ""}`,
        product_.specification?.ingredients?.length ? `Ingredients: ${product_.specification.ingredients.join(", ")}` : undefined,
        product_.specification?.power ? `Power: ${product_.specification.power}w` : undefined,
        product_.specification?.voltage ? `Voltage: ${product_.specification.voltage}v` : undefined,
        product_.specification?.horsePower ? `Horsepower: ${product_.specification.horsePower}hp` : undefined,
        product_.specification?.seaters ? `Seaters: ${product_.specification.seaters}` : undefined,
        product_.specification?.engineType ? `Engine: ${product_.specification.engineType}` : undefined,
        product_.specification?.transmissionType ? `Transmission: ${product_.specification.transmissionType}` : undefined,
        product_.specification?.ramStorage ? `Storage(RAM): ${product_.specification.ramStorage}gb` : undefined,
        product_.specification?.romStorage ? `Storage(ROM): ${product_.specification.romStorage}gb` : undefined,
        product_.specification?.batteryCapacity ? `Battery: ${product_.specification.batteryCapacity}mAh` : undefined,
        `Product Origin: ${product_.specification?.productOrigin || ""}`,
        product_.specification?.productLocation ? `Product Location: ${product_.specification.productLocation}` : undefined,
        `Weight: ${product_.specification?.weight || 0}kg`,
        product_.specification?.dimension?.height ? `Height: ${product_.specification.dimension.height}inches` : undefined,
        product_.specification?.dimension?.width ? `Width: ${product_.specification.dimension.width}inches` : undefined,
        product_.specification?.dimension?.length ? `Length: ${product_.specification.dimension.length}inches` : undefined,
        product_.specification?.manufactureYear ? `Year: ${product_.specification.manufactureYear}` : undefined
    ].filter(Boolean), [product_]);

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

            //Setting size region
            if (sizes) {
                const region_ = getSizeRegion(clientInfo.countryInfo?.name?.abbreviation!, sizes)
                setSizeRegion(() => region_)
                setItem(sizeRegionName, region_)
            }
        }  

    }, [clientInfo])

    // Memoize custom price
    const customPrice = useMemo(() => {
        return clientInfo ? getCustomPricing(product_, sizeId, clientInfo.countryInfo?.name?.common || "") : product_.pricing?.basePrice || 0;
    }, [product_, sizeId, clientInfo]);

    //This time left
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft((prevTimeLeft) => {
                if (prevTimeLeft <= 1000) {
                    return 77500000; // Optional: Reset to 1 day
                }
                return prevTimeLeft - 1000;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    //This stores the viewed product in the sheet
    useEffect(() => {

        //Storing the product name in an excel sheet for research purposes
        if (clientInfo) {
            const storeQuery = async () => {
                try {
                    //Arranging the query research info
                    const queryInfo: IProductViewResearch = {
                        ID: clientInfo?._id!,
                        IP: clientInfo?.ipData?.ip!,
                        City: clientInfo.ipData?.city!,
                        Region: clientInfo.ipData?.region!,
                        Country: clientInfo?.ipData?.country!,
                        Product_Name: product.name!,
                        Date: getCurrentDate(),
                        Time: getCurrentTime(),
                        OS: getOS(),
                        Device: getDevice()
                    }

                    const sheetInfo: ISheetInfo = {
                        sheetId: statSheetId,
                        sheetRange: "ProductView!A:J",
                        data: queryInfo
                    }
            
                    const res = await fetch(`${backend}/sheet`, {
                        method: "POST",
                        body: JSON.stringify(sheetInfo),
                    });

                    //Setting sheet to be stored
                    setSheetStored(true)
                    //console.log("Google Stream: ", res)
                } catch (error) {
                    //console.log("Store Error: ", error)
                }
            }

            if (!sheetStored) {
                storeQuery()

                //Sending page view event to gtm
                const countryInfo_ = countryList.find((country) => country.name?.common === clientInfo.ipData?.country)
                const stateInfo_ = countryInfo_?.states?.find((state) => state.name === clientInfo.ipData?.region)
                const eventTime = Math.round(new Date().getTime() / 1000)
                const eventId = uuid()
                const userAgent = navigator.userAgent
                const { fbp, fbc } = getFacebookCookies();
                const eventData: IMetaWebEvent = {
                    data: [
                        {
                            event_name: MetaStandardEvent.ViewContent,
                            event_time: eventTime,
                            event_id: eventId,
                            action_source: MetaActionSource.website,
                            custom_data: {
                                content_name: extractBaseTitle(document.title),
                                content_ids: [product._id!],
                                content_type: "product",
                                value: round((customPrice * countryInfo_?.currency?.exchangeRate!), 2),
                                currency: countryInfo_?.currency?.abbreviation,
                                content_category: product.category?.micro,
                            },
                            user_data: {
                                client_user_agent: userAgent,
                                client_ip_address: clientInfo?.ipData?.ip!,
                                external_id: hashValue(clientInfo?._id!),
                                fbc: fbc!,
                                fbp: fbp!,
                                ct: hashValue(clientInfo?.ipData?.city?.trim().toLowerCase()!),
                                st: hashValue(stateInfo_?.abbreviation?.trim().toLowerCase()!),
                                country: hashValue(countryInfo_?.name?.abbreviation?.trim().toLowerCase()!)
                            },
                            original_event_data: {
                                event_name: MetaStandardEvent.ViewContent,
                                event_time: eventTime,
                            }
                        }
                    ]
                } 
                sendGTMEvent({ event: eventData.data[0].event_name, value: eventData.data[0] })
                sendMetaCapi(eventData, clientInfo?._id!, getOS(), getDevice())
            }
        }
    }, [clientInfo])

    // useEffect(() => {
    //     //console.log("Client: ", clientInfo)
    //     // const interval = setInterval(() => {
    //     //     if (clientInfo !== undefined) {
    //     //         console.log("client is defined")
    //     //         const newPrice = getCustomPricing(product, sizeId, clientInfo?.country?.name?.common!)
    //     //         setCustomPrice(() => newPrice)
    //     //     } else {
    //     //         console.log("Client is undefined")
    //     //     }
    //     // }, 100);
    
    //     // return () => {
    //     //     clearInterval(interval);
    //     // };

    //     // Check if clientInfo is defined, if not, rerun the effect.
    //     if (clientInfo !== undefined) {
    //         //console.log("Client is defined");

    //         const newPrice = getCustomPricing(product, sizeId, clientInfo?.country?.name?.common!);
    //         setCustomPrice(newPrice);
    //     } else {
    //         //console.log("Client is undefined");
    //     }
        
    // }, [clientInfo, customPrice, sizeId, product]);

    // Memoize delivery dates
    const [startDeliveryDate, endDeliveryDate] = useMemo(() => {
        const currentDate = new Date();
        const start = new Date(currentDate.getTime() + deliveryPeriod * 24 * 60 * 60 * 1000); // 7 days base
        const end = new Date(start.getTime() + deliveryDuration * 24 * 60 * 60 * 1000); // Additional 7 days
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
        return [start.toLocaleDateString('en-US', options), end.toLocaleDateString('en-US', options)];
    }, []);

    //This is an onChange function
    const onChange = (e: ChangeEvent<HTMLSelectElement>, label: string) => {
        e.preventDefault()
        const value = e.target.value

        if (label === "sizeRegion") {
            setSizeRegion(() => value)
            setItem(sizeRegionName, value)
        }
    }

    // useEffect(() => {
    //     // This function will be called every time the component is mounted, and
    //     // whenever the `count` state variable changes
    //     //console.log('Index: ', imageIndex)
    //     //console.log("Colors & Sizes: ", product.specification?.colors, product.specification?.sizes)
    //     //console.log("main: ", mainImage)
    //   }, [mainImage, mainImageId, imageIndex, videoIndex, view, activeInfoBtn]);

    //This gets the picked Color Name
    const getColorName = (): string | undefined => {
        let colorName
        const colors = product.specification?.colors
        if (colors) {
            //Checking if its an array of strings
            if (Array.isArray(colors) && colors.every(item => typeof item === 'string')) {
                colorName = colors[colorId]
            } else {
                const imgPatterns = colors as unknown as IImage
                colorName = imgPatterns.name
            }
        }

        if (colorName && typeof colorName === "string") {
            return capitalizeFirstLetter(colorName)
        }

        return 
    }

    // useEffect(() => {
    //     const currentDate = new Date();
    //     const nextWeek = new Date(currentDate.getTime() + deliveryPeriod * 24 * 60 * 60 * 1000);
    //     const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    //     const formattedDate = nextWeek.toLocaleDateString('en-US', options);

    //     nextWeek.setDate(nextWeek.getDate() + deliveryDuration);
    //     const formattedDate_ = nextWeek.toLocaleDateString('en-US', options);
    //     //console.log("One week from now: ", formattedDate);
    //     setStartDeliveryDate(formattedDate)
    //     setEndDeliveryDate(formattedDate_)
    // }, [startDeliveryDate, endDeliveryDate, addedToCart])

    //This function is used to view return policy
    const viewReturnPolicy = async (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        //Switching on the return policy modal
        setModalBackground(true)
        setReturnPolicyModal(true)

        //Storing this info in button research
        const info: IButtonResearch = {
            ID: clientInfo?._id!,
            IP: clientInfo?.ipData?.ip!,
            City: clientInfo?.ipData?.city!,
            Region: clientInfo?.ipData?.region!,
            Country: clientInfo?.ipData?.country!,
            Button_Name: "viewReturnPolicy()",
            Button_Info: `Clicked "return policy" in product info`,
            Page_Title: extractBaseTitle(document.title),
            Page_URL: routerPath,
            Date: getCurrentDate(),
            Time: getCurrentTime(),
            OS: getOS(),
            Device: getDevice()
        }
        storeButtonInfo(info)
    }

    //This function is triggered when addReview is clicked
    const addReview = async (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        setModalBackground(true)
        setLoadingModal(true) 

        await sleep(2)

        notify("info", "You will need to order this product first before you can be able to leave a review")

        setModalBackground(false)
        setLoadingModal(false)
    }

    //This function helps choose color
    const chooseColor = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>, id: number) => {
        e.preventDefault()

        //setSelectColor(!selectColor)
        setColorId(id)
    }

    //This function helps choose size
    const chooseSize = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>, id: number) => {
        e.preventDefault()

        //setSelectSize(!selectSize)
        setSizeId(id)
    }

    ///This function is triggered when the user wants to reduce the amount
    const reduceQuantity = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()
        if (quantity === 1) {
            notify("info", "1 is the minimum quantity you can order")
        } else {
            let quantity_: number = quantity - 1
            setQuantity(quantity_)
        }
    }

    ///This function handles the button for `Add to Cart`
    // const addToCart = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, order: boolean): Promise<void> => {
    //     e.preventDefault()
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
    //                     console.log("Store cart info ---1")
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
    //                         console.log("Store cart info ---2")
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

    // //This stores data in wishinfo
    // //Storing the keyword in an excel sheet for research purposes
    // const storeWishInfo = async (_action: string) => {
    //     if (clientInfo) {
    //         try {
    //             //Arranging the query research info
    //             const wishListInfo: IWishlistResearch = {
    //                 IP: clientInfo?.ip!,
    //                 Country: clientInfo?.country?.name?.common!,
    //                 Product: product.name!,
    //                 Action: _action,
    //                 Date: getCurrentDate(),
    //                 Time: getCurrentTime()
    //             }

    //             const sheetInfo: ISheetInfo = {
    //                 sheetId: statSheetId,
    //                 sheetRange: "Wishlist!A:F",
    //                 data: wishListInfo
    //             }
        
    //             const res = await fetch(`${backend}/sheet`, {
    //                 method: "POST",
    //                 body: JSON.stringify(sheetInfo),
    //             });
    //             console.log("Google Stream: ", res)
    //         } catch (error) {
    //             console.log("Store Error: ", error)
    //         }
    //     }
    // }

    ///This function opens discount modal
    const openDiscountModal = (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent>): void => {
        e.preventDefault()

        setDiscountProduct({ 
            data: product,
            poppedUp: false 
        })
        setModalBackground(true)
        setDiscountModal(true)
    }

    ///This function is triggered when the order now is pressed
    const orderNow = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): Promise<void> => {
        e.preventDefault()

        if (product.pricing?.inStock === false) {
            notify("info", "This product is currently out of stock, check back later!")
        } else {
            setCheckoutIsLoading(() => true)
            
            //Add the product to cart
            addToCart_(e, true)

            //Storing this info in button research
            const info: IButtonResearch = {
                ID: clientInfo?._id!,
                IP: clientInfo?.ipData?.ip!,
                City: clientInfo?.ipData?.city!,
                Region: clientInfo?.ipData?.region!,
                Country: clientInfo?.countryInfo?.name?.common!,
                Button_Name: "orderNow()",
                Button_Info: `Clicked "checkout" in product info`,
                Page_Title: extractBaseTitle(document.title),
                Page_URL: routerPath,
                Date: getCurrentDate(),
                Time: getCurrentTime(),
                OS: getOS(),
                Device: getDevice()
            }
            storeButtonInfo(info)

            //Routing the user to cart page
            //window.location.reload()
            router.push("/cart")
        }
    }

    ///This function triggers when someone opens an accordian
  const handleHeadingClick = (index: any) => {
    setActiveHeading(index === activeHeading ? null : index);
  };

    //This function changes the main picture on the product info
    const changePicture = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, action: string) => {
        e.preventDefault()

        //console.log("Arrow clicked")
        const imageLength = product.images.length
        let newIndex = imageIndex

        // Handle left arrow click
        if (action === "left") {
            // Move left, if already at the first image, loop to the last image
            newIndex = newIndex === 0 ? imageLength - 1 : newIndex - 1;
        } 
        // Handle right arrow click
        else if (action === "right") {
            // Move right, if already at the last image, loop to the first image
            newIndex = newIndex === imageLength - 1 ? 0 : newIndex + 1;
        }

        // Update the image index
        setImageIndex(() => newIndex);
    }

    ///This function increases the amount of quantity
    const increaseQuantity = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()
        let quantity_: number = quantity + 1
        setQuantity(quantity_)
    }

    // Function to handle the zoom effect on mouse move
    const handleMouseMove = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        e.preventDefault()
        
        const target = e.currentTarget;
        const { left, top, width, height } = target.getBoundingClientRect();
        const offsetX = e.clientX - left;
        const offsetY = e.clientY - top;

        //Get the percentage position of the cursor inside the image
        const posX = (offsetX / width) * 100;
        const posY = (offsetY / height) * 100;

        setTransformOrigin(`${posX}% ${posY}%`);
        //console.log("Dimension: ", `${posX}% ${posY}%`)
    };

    // Handle mouse enter to enable zoom
    const handleMouseEnter = () => {
        setIsZoomed(true);
    };

    // Handle mouse leave to reset zoom and origin
    const handleMouseLeave = () => {
        setIsZoomed(false);
        setTransformOrigin('center center');
    };

    //This button is triggered when the info button is clicked
    const clickInfoBtn = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, id: number): void => {
        e.preventDefault()

        setActiveInfoBtn(id)
    }

    //This function is triggered when wish/wish delete is clicked
    const wishProduct = async (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
        e.preventDefault()
        //e.stopPropagation()
        let addToWishList: boolean = false

        const wishList_ = getItem(wishListName) as unknown as Array<IProduct>
        if (wishList_) {
            const exists = wishList_.some((p) => p._id === product._id);
            if (exists) {
                notify('info', "Product has already been added to wish list")
            } else {
                const newWishList = [ ...wishList_, product ]
                setItem(wishListName, newWishList)
                storeWishInfo("Added", clientInfo!, product)
                notify("success", "Product added to wish list")
                addToWishList = true
            }
        } else {
            const newWishList: Array<IProduct> = [ product ]
            setItem(wishListName, newWishList)
            storeWishInfo("Added", clientInfo!, product)
            notify("success", "Product added to wish list")
            addToWishList = true
        }

        if (addToWishList) {
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

    return (
        <>
            {/* <DisplayBar text_={undefined} /> */}
            <div className={styles.header}>
                <div className={styles.bar}></div>
                <div className={styles.barTitle}>
                    <span>Shop now & Pay on Delivery</span>
                    {/* <span>{product.category?.macro}</span>
                    {product?.category?.mini ? (
                        <>
                            <KeyboardArrowRight className={styles.icon} />
                            <span>{product.category?.mini}</span>
                            {product.category?.micro ? (
                                <>
                                    <KeyboardArrowRight className={styles.icon} />
                                    <span>{product.category?.micro}</span>
                                    {product.category?.nano ? (
                                        <>
                                            <KeyboardArrowRight className={styles.icon} />
                                            <span>{product.category?.nano}</span>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            ) : (
                                <></>
                            )}
                        </>
                    ) : (
                        <></>
                    )} */}
                </div>
            </div>
            {mounted ? (
                <>
                    <main className={`${styles.main}`}>
                        <div className={styles.left_section}>
                            <div className={styles.profile_image}
                                onMouseMove={(e) => handleMouseMove(e)}
                                onMouseEnter={() => setTransformOrigin('center center')}
                                onMouseLeave={() => setTransformOrigin('center center')}
                            >
                                {product.images && product.images[imageIndex].type === "video"  ? (
                                    <iframe
                                        className={styles.img}
                                        src={product.images[imageIndex]?.src}
                                        width={product.images[imageIndex]?.width}
                                        height={product.images[imageIndex].height}
                                        allow="autoplay"
                                        loading="lazy"
                                        frameBorder={0}
                                        sandbox="allow-scripts allow-downloads allow-same-origin"
                                        //sandbox="allow-same-origin allow-scripts"
                                    >
                                    </iframe>
                                ) : (
                                    <Image
                                        className={styles.img}
                                        src={product.images[imageIndex].src}
                                        alt=""
                                        width={product.images[imageIndex].width}
                                        height={product.images[imageIndex].height}
                                        style={{
                                            transformOrigin: transformOrigin,
                                            transform: isZoomed ? 'scale(1.5)' : 'scale(1)'
                                        }}  
                                        priority
                                    />
                                )}
                            </div>
                            <div className={styles.controller}>
                                <button className={`arrow-left arrow ${styles.prev}`} onClick={(e) => changePicture(e,"left")}>
                                    <KeyboardArrowLeft />
                                </button>
                                {/* <div className={`swiper-pagination ${styles.pagination}`}></div> */}
                                <button className={`arrow-right arrow ${styles.next}`} onClick={(e) => changePicture(e,"right")}>
                                    <KeyboardArrowRight />
                                </button>
                            </div>
                            <Swiper
                                effect={'slide'}
                                spaceBetween={8}
                                grabCursor={true}
                                centeredSlides={false}
                                loop={false}
                                autoplay={{ delay: 4000, pauseOnMouseEnter: true }} //{{ delay: 7000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                                slidesPerView={'auto'}
                                onBeforeInit={(swiper) => {
                                    swiperRef.current = swiper;
                                    }}
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 2.5,
                                }}
                                fadeEffect={{ crossFade: true }}
                                pagination={{ el: '.swiper-pagination', clickable: true }}
                                //navigation={{ nextEl: nextRef.current, prevEl: prevRef.current }}
                                modules={[ EffectCoverflow, Pagination, Navigation, Autoplay, EffectFade ]}
                                className={styles.image_slide}
                            >
                                {product.images?.map((image, id) => (
                                    <SwiperSlide 
                                        key={id} 
                                        className={`${styles.image} ${id === imageIndex ? styles.activeImage : ""}`} onClick={() => {
                                            setView(() => image.type === "image" ? "image" : "video")
                                            setImageIndex(() => id)
                                        }}
                                    >
                                        {!loadedImages[id] && <Loading width="20px" height="20px" />}
                                        {image.type === "video" ? (
                                            <iframe
                                                className={styles.iframe}
                                                src={image.src}
                                                width={image.width}
                                                height={image.height}
                                                frameBorder={0}
                                                sandbox="allow-scripts allow-downloads allow-same-origin"
                                                onLoad={() => 
                                                    setLoadedImages((prev: Record<number, boolean>) => ({
                                                        ...prev,
                                                        [id]: true
                                                      }))
                                                }
                                            />
                                        ) : (
                                            <Image
                                                className={`${styles.img} ${!loadedImages[id] ? styles.hiddenImg : ''}`}
                                                src={image.src}
                                                alt="Image"
                                                width={image.width}
                                                height={image.height}
                                                onLoad={() => {
                                                    //console.log("Image: ", loadedImages, id)
                                                    setLoadedImages((prev: Record<number, boolean>) => ({
                                                        ...prev,
                                                        [id]: true
                                                    }))
                                                }}
                                                //loading="lazy" // You can adjust the loading attribute as needed (e.g., "lazy", "eager")
                                            />
                                        )}

                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <div className={styles.image_slide_}>
                                {/* {product.images.map((image, imageId) => (
                                    <div key={imageId} className={`${styles.image} ${imageId === imageIndex ? styles.activeImage : ""}`} onClick={() => {
                                        setView(() => image.type === "image" ? "image" : "video")
                                        setImageIndex(() => imageId)
                                    }}>
                                        
                                        
                                    </div>
                                ))} */}
                                {/* {p.videos && p.videos.length > 0 && p.videos[0].src ? p.videos.map((video, videoId) => (
                                    <div className={styles.image} key={videoId} onClick={() => {
                                        setView(() => "video")
                                        setVideoIndex(() => videoId)
                                    }}>
                                        <iframe
                                            className={styles.iframe}
                                            src={video.src}
                                            width={video.width}
                                            height={video.height}
                                            //allow="autoplay"
                                            frameBorder={0}
                                            //sandbox="allow-forms"
                                        >
                                    </iframe>
                                </div>
                                )) : (
                                    <></>
                                )} */}
                            </div>
                        </div>
                        <div className={styles.right_section}>
                            <h3>
                                <strong>{product.name}</strong>
                                {/* {checkExtraDiscountOffer(product) ? (
                                    // <Tooltip title="Discount Offer" placement='top'>
                                    //     <IconButton>
                                        <Discount className={styles.icon} onClick={(e) => openDiscountModal(e)} />
                                    //     </IconButton>
                                    // </Tooltip>
                                ) : (
                                    <></>
                                )} */}
                            </h3>
                            <span className={styles.product_about}>{product.description}</span>
                            <div className={styles.product_price_orders_rating}>
                                <div className={styles.price_orders}>
                                    <div className={styles.product_price}>
                                        <div className={styles.price}>
                                            {/* <span dangerouslySetInnerHTML={{ __html: decodedString(nairaSymbol) }} /> */}
                                            {clientInfo ? (
                                                <span>{clientInfo.countryInfo?.currency?.symbol}</span>
                                            ) : (
                                                <></>
                                            )}
                                            {clientInfo?.countryInfo?.currency?.exchangeRate ? (
                                                <span>
                                                    {round(customPrice * clientInfo.countryInfo.currency.exchangeRate, 2).toLocaleString("en-US")}
                                                </span> 
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                        <div className={styles.slashed_price}>
                                            {clientInfo ? <span>{clientInfo.countryInfo?.currency?.symbol}</span> : <></>}
                                            {clientInfo?.countryInfo?.currency?.exchangeRate ? (
                                                <span>
                                                    {round(slashedPrice(customPrice * clientInfo.countryInfo.currency.exchangeRate, product.pricing?.discount!), 2).toLocaleString("en-US")}
                                                </span>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.percent}>
                                        <span>{product.pricing?.discount}% Off</span>
                                    </div>
                                    <div className={styles.save}>
                                        {clientInfo?.countryInfo?.currency?.exchangeRate ? (
                                            <span>Save {clientInfo.countryInfo?.currency?.symbol}{round((slashedPrice(customPrice, product.pricing?.discount!) - customPrice) * clientInfo.countryInfo.currency.exchangeRate, 2).toLocaleString("en-US")}</span>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                {/* product.stock && product.stock <= 20 */}
                                </div>
                            </div>
                            <div className={styles.orders_left_rating}>
                                <div className={styles.orders_left}>
                                    <div className={styles.product_orders}>
                                        {/* <LocalShippingIcon className={styles.icon} /> */}
                                        <span>{product.orders === 0 ? 51 : product.orders?.toLocaleString("en-US")} sold</span>
                                    </div>
                                    <div className={styles.product_left}>
                                        {showStockLeft ? (
                                            <>
                                                <Whatshot className={styles.icon} />
                                                <span>Only {product.stock} left</span>
                                            </>
                                        ) : (
                                            <span>Limited Stock</span>
                                        )}
                                    </div>    
                                </div>
                                <div className={styles.rating}>
                                    <div className={styles.stars}>
                                        {calculateMeanRating(reviews) === 0 ? (
                                            <>
                                                {Array.from({ length: 5 }).map((star, id) => (
                                                    <StarOutline className={styles.star} key={id} />
                                                ))}
                                            </>
                                        ) : calculateMeanRating(reviews) === '5.0' ? (
                                            <>
                                                {Array.from({ length: 5 }).map((_, id) => (
                                                    <Star className={styles.star} key={id} />
                                                ))}
                                            </>
                                        ) : (
                                            <>
                                                {stars.map((_, id) => (
                                                    <Star className={styles.star} key={id} />
                                                ))}
                                                <StarHalf className={styles.star} />
                                            </>
                                        )}
                                    </div>
                                    <span>{calculateMeanRating(reviews)}</span>
                                </div>
                            </div>
                            <div className={styles.timeCountdown}>
                                <span>Special Offer ends in {formatTime(timeLeft)}</span> 
                                <Schedule style={{ fontSize: "1rem" }}/>
                            </div>
                            <button className={styles.return} onClick={(e) => viewReturnPolicy(e)}>
                                <span>Return & Refund Policy</span>
                                <Add style={{ fontSize: "1rem" }}/>
                            </button>
                            <div className={styles.currentView}>
                                <span>{viewerCount} people are viewing this now</span> 
                                <Visibility style={{ fontSize: "1rem" }}/>
                            </div>
                            <span className={styles.product_deliveryDate}><em>Delivery: {startDeliveryDate} - {endDeliveryDate} <strong>(Free Shipping)</strong></em></span>
                            {product.specification?.colors && product.specification.colors[0] !== "" && product.specification!.colors.length !== 0 ? (
                                <div className={styles.product_colors}>
                                    <span className={styles.span1}>Color: <span className={styles._span1}>{getColorName()}</span></span>
                                    <Swiper
                                        effect={'slide'}
                                        spaceBetween={8}
                                        grabCursor={true}
                                        centeredSlides={false}
                                        loop={false}
                                        autoplay={false} //{{ delay: 7000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                                        slidesPerView={'auto'}
                                        onBeforeInit={(swiper) => {
                                            swiperRef.current = swiper;
                                            }}
                                        coverflowEffect={{
                                            rotate: 0,
                                            stretch: 0,
                                            depth: 100,
                                            modifier: 2.5,
                                        }}
                                        fadeEffect={{ crossFade: true }}
                                        pagination={{ el: '.swiper-pagination', clickable: true }}
                                        //navigation={{ nextEl: nextRef.current, prevEl: prevRef.current }}
                                        modules={[ EffectCoverflow, Pagination, Navigation, Autoplay, EffectFade ]}
                                        className={styles.colorContainer}
                                    >
                                        {product.specification?.colors?.map((color, id) => (
                                            <SwiperSlide className={`${styles.slider} ${colorId === id ? styles.activeColorBtn : styles.inActiveColorBtn}`} key={id} onClick={(e) => chooseColor(e, id)}>
                                                {typeof color === "string" ? (
                                                    <div className={styles.color} style={{ backgroundColor: `${color}`, borderColor: `${color}` }}></div>
                                                ) : (
                                                    <div className={styles.image}>
                                                        <Image
                                                            className={styles.img}
                                                            src={color.src!}
                                                            alt=""
                                                            width={color.width!}
                                                            height={color.height!}
                                                        /> 
                                                    </div>
                                                )}
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            ) : (<></>)}
                            {product.specification?.sizes && product.specification!.sizes[0] !== "" && product.specification!.sizes.length !== 0 ? (
                                <div className={styles.product_sizes}>
                                    <div className={styles.div_size}>
                                        <span className={styles.span1}>Size</span>
                                        {sizes ? (
                                            <select value={sizeRegion} onChange={(e) => onChange(e, "sizeRegion")}>
                                                {sizes.map((size, sid) => (
                                                    <option value={size.region} key={sid}>{size.region}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    <Swiper
                                        effect={'slide'}
                                        spaceBetween={10}
                                        grabCursor={true}
                                        centeredSlides={false}
                                        loop={false}
                                        autoplay={false} //{{ delay: 7000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                                        slidesPerView={'auto'}
                                        onBeforeInit={(swiper) => {
                                            swiperRef.current = swiper;
                                            }}
                                        coverflowEffect={{
                                            rotate: 0,
                                            stretch: 0,
                                            depth: 100,
                                            modifier: 2.5,
                                        }}
                                        fadeEffect={{ crossFade: true }}
                                        pagination={{ el: '.swiper-pagination', clickable: true }}
                                        //navigation={{ nextEl: nextRef.current, prevEl: prevRef.current }}
                                        modules={[ EffectCoverflow, Pagination, Navigation, Autoplay, EffectFade ]}
                                        className={styles.sizeContainer}
                                    >
                                        {product.specification?.sizes?.map((size, id) => (
                                            <SwiperSlide className={`${styles.slider} ${sizeId === id ? styles.activeSizeBtn : styles.inActiveSizeBtn}`} key={id} onClick={(e) => chooseSize(e, id)}>
                                                <span>{typeof size === "string" ? size : getCustomSize(sizeRegion, sizes!, size.size) }</span>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    <div className={styles.controller}>
                                        <button className={`arrow-left arrow ${styles.prev}`} onClick={() => swiperRef.current?.slidePrev()}>
                                            <KeyboardArrowLeft />
                                        </button>
                                        {/* <div className={`swiper-pagination ${styles.pagination}`}></div> */}
                                        <button className={`arrow-right arrow ${styles.next}`} onClick={() => swiperRef.current?.slideNext()}>
                                            <KeyboardArrowRight />
                                        </button>
                                    </div>
                                </div>
                            ) : (<></>)}
                            <div className={styles.buttons}>
                                <div className={styles.product_quantity}>
                                    <button className={styles.minus_button} onClick={e => reduceQuantity(e)}>
                                        <Remove style={{ fontSize: "1rem" }} />
                                    </button>
                                    <span>{quantity}</span>
                                    <button className={styles.plus_button} onClick={e => increaseQuantity(e)}>
                                        <Add style={{ fontSize: "1rem" }} />
                                    </button>
                                </div>
                                {addedToCart ? (
                                    <button className={styles.cart_button} onClick={(e) => orderNow(e)}>
                                        {checkoutIsLoading ? (
                                            <Loading width="20px" height="20px" />
                                        ) : (
                                            <>
                                                <ShoppingCartCheckout className={styles.icon} />
                                                <span>Checkout</span>
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button className={styles.cart_button} onClick={(e) => addToCart_(e, false)}>
                                        {addToCartIsLoading ? (
                                            <Loading width="20px" height="20px" />
                                        ) : (
                                            <>
                                                <AddShoppingCart className={styles.icon} />
                                                <span>Add to Cart</span>
                                            </>
                                        )}
                                    </button>
                                )}
                                <button className={styles.wish_button} onClick={(e) => wishProduct(e)}>
                                    <FavoriteBorder className={styles.icon} />
                                </button>
                            </div>
                            {/* <div className={styles.product_specs}>
                                    {p.specification?.colors && p.specification?.colors.length > 1 ? (
                                        <div className={styles.colors}>
                                            <button className={styles.selectedColor} onClick={() => setSelectColor(!selectColor)}>
                                                <div className={styles.circle} style={{ backgroundColor: `${p.specification?.colors[colorId]}`, borderColor: p.specification?.colors[colorId] === "white" ? "black": `${p.specification?.colors[colorId]}`}}></div>
                                                <span>{capitalizeFirstLetter(p.specification?.colors[colorId])}</span>
                                                <span className={`${selectColor ? styles.activeArrow : styles.inactiveArrow}`}>{">"}</span>
                                            </button>
                                            <div className={`${styles.color_option}`} style={{ display: selectColor ? "flex" : "none"}}>
                                                {p.specification.colors.map((color, _id) => (
                                                    <button key={_id} className={colorId === _id ? styles.activeButton : styles.inActiveButton} onClick={(e) => chooseColor(e, _id)}>
                                                        <div className={styles.circle} style={{ backgroundColor: `${color}`, borderColor: color === "white" ? "black": `${color}` }}></div>
                                                        <span>{capitalizeFirstLetter(color)}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (<></>)}
                                    {p.specification?.sizes && p.specification?.sizes.length > 1 ? (
                                        <div className={styles.sizes}>
                                            <button className={styles.selectedSize} onClick={() => setSelectSize(!selectSize)}>
                                                <span>{p.specification?.sizes[sizeId]}</span>
                                                <span className={`${selectSize ? styles.activeArrow : styles.inactiveArrow}`}>{">"}</span>
                                            </button>
                                            <div className={`${styles.size_option}`} style={{ display: selectSize ? "flex" : "none"}}>
                                                {p.specification?.sizes.map((size, _id) => (
                                                    <button key={_id} className={sizeId === _id ? styles.activeButton : styles.inActiveButton} onClick={(e) => chooseSize(e, _id)}>
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (<></>)}
                            </div> */}
                            {/* <div className={styles.product_quantity_specs}>
                                <div className={styles.product_quantity}>
                                    <button className={styles.minus_button} onClick={e => reduceQuantity(e)}>
                                        <RemoveIcon style={{ fontSize: "1rem" }} />
                                    </button>
                                    <span>{quantity}</span>
                                    <button className={styles.plus_button} onClick={e => increaseQuantity(e)}>
                                        <AddIcon style={{ fontSize: "1rem" }} />
                                    </button>
                                </div>
                            </div> */}

                            {/* <div className={styles.product_cart_order}>
                                <button className={styles.order_button} onClick={(e) => orderNow(e)}>
                                    <ShoppingCartCheckout className={styles.icon} />
                                    <span>Checkout</span>
                                </button>
                                <button className={styles.cart_button} onClick={e => {
                                    addToCart(e, false)
                                }}>
                                    <AddShoppingCart className={styles.icon} />
                                    <span>Add to Cart</span>
                                </button>
                            </div> */}
                            {/* <div className={styles.product_accordian}>
                                {questions.map((q, index) => (
                                    <div key={index}>
                                        <button
                                            className={`${styles.question} ${activeHeading === index ? styles.activeQuestion : styles.inactiveQuestion}`}
                                            onClick={() => handleHeadingClick(index)}
                                        >
                                            {q.question}
                                            <span className={`${activeHeading === index ? styles.activeSymbol : styles.inactiveSymbol}`}>
                                                {"+"}
                                            </span>
                                        </button>
                                        <div
                                            className={`${styles.answer} ${
                                                activeHeading === index ? styles.answerActive : ''
                                            }`}
                                        >
                                            <ul >
                                                {questions[index].answer?.map((a, a_id) => (
                                                    <Fragment key={a_id}>
                                                        {a ? (
                                                            <li>{a}</li>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </Fragment>
                                                ))}
                                            </ul>

                                        </div>
                                    </div>
                                ))}
                            </div> */}
                        </div>
                    </main>
                    <div className={styles.extraInfo}>
                        <div className={styles.buttons}>
                            <button className={activeInfoBtn === 0 ? styles.activeInfoBtn : ""} onClick={(e) => clickInfoBtn(e, 0)}>Description</button>
                            <button className={activeInfoBtn === 1 ? styles.activeInfoBtn: ""} onClick={(e) => clickInfoBtn(e, 1)}>Specifications</button>
                            <button className={activeInfoBtn === 2 ? styles.activeInfoBtn : ""} onClick={(e) => clickInfoBtn(e, 2)}>Reviews ({reviews.length})</button>
                        </div>
                        <div className={styles.infoBody}>
                            {activeInfoBtn === 0 ? (
                                <Fragment>
                                    <span className={styles.span_d1}>
                                        <strong>Description</strong> <br />
                                        <span>{product.description}</span>
                                    </span>
                                    <span className={styles.span_d2}>
                                        <strong>Customer Benefits</strong>
                                        <ul>
                                            {product.specification?.benefits?.map((benefit, id) => (
                                                <li key={id}>{benefit}</li>
                                            ))}
                                        </ul>
                                    </span>
                                    <span className={styles.span_d3}>
                                        <strong>How to use</strong>
                                        <ul>
                                            {product.specification?.prescription?.map((step, id) => (
                                                <li key={id}>{step}</li>
                                            ))}
                                        </ul>
                                    </span>
                                </Fragment>
                            ) : activeInfoBtn === 1 ? (
                                <Fragment>
                                    <span className={styles.span_s1}>
                                        <strong>Specifications</strong>
                                        <ul>
                                            {specs?.map((spec, id) => (
                                                <>
                                                    {spec ? (
                                                        <li key={id}>{spec}</li>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </>
                                            ))}
                                        </ul>
                                    </span>
                                </Fragment>
                            ) : activeInfoBtn === 2 ? (
                                <Fragment>
                                    <div className={styles.heading}>
                                        <div className={styles.verified}>
                                            <Verified className={styles.icon} />
                                            <span>All reviews are from verified purchases</span>
                                        </div>
                                        <button className={styles.addReview} onClick={(e) => addReview(e)}>
                                            <PostAdd className={styles.icon} />
                                            <span>Add a review</span>
                                        </button>
                                    </div>
                                    <div className={styles.reviews}>
                                        {reviews && reviews.length !== 0 ? sortMongoQueryByTime(reviews, "latest")?.map((review, id) => (
                                            <div className={`${styles.review} ${id === reviews.length - 1 ? styles.last_review : ''}`} key={id}>
                                                <div className={styles.review_header}>
                                                    <div className={styles.image}>
                                                        {review.image ? (
                                                            <Image
                                                                className={styles.img}
                                                                src={review.image.src} 
                                                                height={review.image.height}
                                                                width={review.image.width}
                                                                alt="" 
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <AccountCircle className={styles.icon} />
                                                        )}
                                                    </div>
                                                    <span className={styles.name}>{maskString(review.name!)}</span>
                                                    <span className={styles.in}>in</span>
                                                    <Image 
                                                        className={styles.flag}
                                                        src={getCountryInfo(review.country!) ? getCountryInfo(review.country!)?.flag?.src! : clientInfo?.countryInfo?.flag?.src as unknown as string}
                                                        alt=""
                                                        width={getCountryInfo(review.country!) ? getCountryInfo(review.country!)?.flag?.width! : clientInfo?.countryInfo?.flag?.width}
                                                        height={getCountryInfo(review.country!) ? getCountryInfo(review.country!)?.flag?.height! : clientInfo?.countryInfo?.flag?.height}
                                                    />
                                                    <span className={styles.on}>on</span>
                                                    <span className={styles.date}>{formatDateMongo(review.createdAt as unknown as string)}</span>
                                                </div>
                                                <div className={styles.review_rating}>
                                                    {Array.from({ length: review.rating! }).map((star, id) => (
                                                        <Star className={styles.star} key={id} />
                                                    ))}
                                                    {Array.from({ length: 5 - review.rating! }).map((star, id) => (
                                                        <StarOutline className={styles.star} key={id} />
                                                    ))}
                                                </div>
                                                {review.specs ? (
                                                    <div className={styles.specs}>
                                                        {review.specs.size && review.specs.size !== "" ? (
                                                            <div className={styles.size}>
                                                                <span>Size: {capitalizeFirstLetter(getCustomSize(sizeRegion!, sizes!, review.specs.size!)!)}</span>
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )}
                                                        {review.specs.color && review.specs.color !== "" ? (
                                                            <div className={`${styles.color} ${!review.specs.size ? styles.noSize : ""}`}>
                                                                <span>Color: {capitalizeFirstLetter(review.specs.color)}</span>
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                                <div className={styles.text}>
                                                    <span>{review.review}</span>
                                                </div>
                                            </div>
                                        )) : (
                                            <></>
                                        )}
                                    </div>
                                </Fragment>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default ProductInfo;

