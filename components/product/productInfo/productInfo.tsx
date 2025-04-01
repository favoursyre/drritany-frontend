"use client"
///Product Info component

///Libraries -->
import { toast } from 'react-toastify';
import React, { useState, useEffect, MouseEvent, Fragment, useRef } from "react"
import styles from "./productInfo.module.scss"
import { IProduct, ICart, ICartItem, IClientInfo, IImage, IProductViewResearch, ISheetInfo, IButtonResearch } from '@/config/interfaces';
import { setItem, notify, getItem, getOS, getDevice } from '@/config/clientUtils';
import { round, cartName, getCustomPricing, slashedPrice, deliveryPeriod, getDeliveryFee, wishListName, areObjectsEqual, formatObjectValues, removeUndefinedKeys, checkExtraDiscountOffer, storeWishInfo, storeCartInfo, getCurrentDate, getCurrentTime, backend, statSheetId, sleep, deliveryDuration, capitalizeFirstLetter,extractBaseTitle, storeButtonInfo, userIdName } from '@/config/utils'
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Star, AddShoppingCart, StarHalf, Discount, ShoppingCartCheckout, KeyboardArrowLeft, KeyboardArrowRight, Add, Remove, FavoriteBorder } from '@mui/icons-material';
import { useModalBackgroundStore, useDiscountModalStore, useReturnPolicyModalStore } from '@/config/store';
import { useClientInfoStore } from "@/config/store";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper as SwiperCore } from 'swiper/types';
import Loading from "@/components/loadingCircle/Circle";
import { EffectCoverflow, Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';

///Commencing the code
/**
 * @title Product Info Component
 * @returns The Product Info component
 */
const ProductInfo = ({ product_ }: { product_: IProduct }) => {
    //console.log('Products_: ', product_)
    const [cart, setCart] = useState<ICart | null>(getItem(cartName))
    const [product, setProduct] = useState(product_)
    //const [checkoutIsLoading]
    const swiperRef = useRef<SwiperCore>();
    const [activeHeading, setActiveHeading] = useState(0);
    const [transformOrigin, setTransformOrigin] = useState('center center');
    const clientInfo = useClientInfoStore(state => state.info)
    const [mainImage, setMainImage] = useState(product.images[0])
    const [mainImageId, setMainImageId] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [startDeliveryDate, setStartDeliveryDate] = useState<string>("")
    const [endDeliveryDate, setEndDeliveryDate] = useState<string>("")
    const router = useRouter()
    const [colorId, setColorId] = useState<number>(0)
    //const [selectColor, setSelectColor] = useState<boolean>(false)
    const [sizeId, setSizeId] = useState<number>(0)
    //const [selectSize, setSelectSize] = useState<boolean>(false)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setDiscountModal = useDiscountModalStore(state => state.setDiscountModal);
    const setReturnPolicyModal = useReturnPolicyModalStore(state => state.setReturnPolicyModal);
    const setDiscountProduct = useDiscountModalStore(state => state.setDiscountProduct);
    const routerPath = usePathname()
    const discountProduct = useDiscountModalStore(state => state.product);
    const [customPrice, setCustomPrice] = useState<number>(getCustomPricing(product, 0, clientInfo?.country?.name?.common!))
    const [imageIndex, setImageIndex] = useState<number>(0)
    const [videoIndex, setVideoIndex] = useState<number>(0)
    const [activeInfoBtn, setActiveInfoBtn] = useState<number>(0)
    const [addedToCart, setAddedToCart] = useState<boolean>(false)
    const [checkoutIsLoading, setCheckoutIsLoading] = useState<boolean>(false)
    const [addToCartIsLoading, setAddToCartIsLoading] = useState<boolean>(false)
    const [view, setView] = useState<"image" | "video">("image")
    const [isZoomed, setIsZoomed] = useState(false);
    const spec = product.specification
    const stars: Array<number> = [1, 2, 3, 4]
    console.log("In Stock: ", product.pricing?.inStock)

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
    const specs = [
        `SKU: ${product._id}`,
        `Condition: Brand New`,
        `Brand: ${spec?.brand}`,
        spec?.modelNumber ? `Model Number: ${spec.modelNumber}` : undefined,
        `Item Form: ${spec?.itemForm}`,
        `Item Count: ${spec?.itemCount}`,
        `Gender: ${spec?.gender}`,
        `Age Range: ${spec?.userAgeRange}`,
        spec?.ingredients && spec.ingredients.length > 1 ? `Ingredients: ${spec?.ingredients?.join(", ")}` : undefined,
        spec?.power ? `Power: ${spec?.power}w` : undefined,
        spec?.voltage ? `Voltage: ${spec?.voltage}v` : undefined,
        spec?.horsePower ? `Horsepower: ${spec?.horsePower}hp` : undefined,
        spec?.seaters ? `Seaters: ${spec?.seaters}` : undefined,
        spec?.engineType ? `Engine: ${spec?.engineType}` : undefined,
        spec?.transmissionType ? `Transmission: ${spec?.transmissionType}v` : undefined,
        spec?.ramStorage ? `Storage(RAM): ${spec?.ramStorage}gb` : undefined,
        spec?.romStorage ? `Storage(ROM): ${spec?.romStorage}gb` : undefined,
        spec?.batteryCapacity ? `Battery: ${spec?.batteryCapacity}mAh` : undefined,
        `Product Origin: ${spec?.productOrigin}`,
        spec?.productLocation ? `Product Location: ${spec.productLocation}` : undefined,
        `Weight: ${spec?.weight}kg`,
        spec?.dimension?.height ? `Height: ${spec.dimension.height}inches` : undefined,
        spec?.dimension?.width ? `Width: ${spec.dimension.width}inches` : undefined,
        spec?.dimension?.length ? `Length: ${spec.dimension.length}inches` : undefined,
        spec?.manufactureYear ? `Year: ${spec.manufactureYear}` : undefined
    ]

    //This stores the viewed peoduct in the sheet
    useEffect(() => {

        //Storing the product name in an excel sheet for research purposes
        if (clientInfo) {
            const storeQuery = async () => {
                try {
                    //Arranging the query research info
                    const queryInfo: IProductViewResearch = {
                        IP: clientInfo?.ip!,
                        Country: clientInfo?.country?.name?.common!,
                        Product: product.name!,
                        Date: getCurrentDate(),
                        Time: getCurrentTime()
                    }

                    const sheetInfo: ISheetInfo = {
                        sheetId: statSheetId,
                        sheetRange: "ProductView!A:E",
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

            storeQuery()
        }
    }, [product, clientInfo])

    useEffect(() => {
        //console.log("Client: ", clientInfo)
        // const interval = setInterval(() => {
        //     if (clientInfo !== undefined) {
        //         console.log("client is defined")
        //         const newPrice = getCustomPricing(product, sizeId, clientInfo?.country?.name?.common!)
        //         setCustomPrice(() => newPrice)
        //     } else {
        //         console.log("Client is undefined")
        //     }
        // }, 100);
    
        // return () => {
        //     clearInterval(interval);
        // };

        // Check if clientInfo is defined, if not, rerun the effect.
        if (clientInfo !== undefined) {
            console.log("Client is defined");

            const newPrice = getCustomPricing(product, sizeId, clientInfo?.country?.name?.common!);
            setCustomPrice(newPrice);
        } else {
            console.log("Client is undefined");
        }
        
    }, [clientInfo, customPrice, sizeId, product]);

    useEffect(() => {
        // This function will be called every time the component is mounted, and
        // whenever the `count` state variable changes
        console.log('Index: ', imageIndex)
        //console.log("Colors & Sizes: ", product.specification?.colors, product.specification?.sizes)
        //console.log("main: ", mainImage)
      }, [mainImage, mainImageId, imageIndex, videoIndex, view, activeInfoBtn]);

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

    useEffect(() => {
        const currentDate = new Date();
        const nextWeek = new Date(currentDate.getTime() + deliveryPeriod * 24 * 60 * 60 * 1000);
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
        const formattedDate = nextWeek.toLocaleDateString('en-US', options);

        nextWeek.setDate(nextWeek.getDate() + deliveryDuration);
        const formattedDate_ = nextWeek.toLocaleDateString('en-US', options);
        //console.log("One week from now: ", formattedDate);
        setStartDeliveryDate(formattedDate)
        setEndDeliveryDate(formattedDate_)
    }, [startDeliveryDate, endDeliveryDate, addedToCart])

    //This function is used to view return policy
    const viewReturnPolicy = async (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        //Switching on the return policy modal
        setModalBackground(true)
        setReturnPolicyModal(true)

        //Storing this info in button research
        const info: IButtonResearch = {
            ID: getItem(userIdName),
            IP: clientInfo?.ip!,
            Country: clientInfo?.country?.name?.common!,
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
            toast.info('1 is the minimum quantity you can order', {
                position: toast.POSITION.TOP_CENTER,
                style: { backgroundColor: 'white', color: '#1170FF' },
              });
        } else {
            let quantity_: number = quantity - 1
            setQuantity(quantity_)
        }
    }

    ///This function handles the button for `Add to Cart`
    const addToCart = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, order: boolean): Promise<void> => {
        e.preventDefault()
        const p = product

        if (p.pricing?.inStock === false) {
            notify("info", "This product is currently out of stock, check back later!")

            //Storing this info in button research
            const info: IButtonResearch = {
                ID: getItem(userIdName),
                IP: clientInfo?.ip!,
                Country: clientInfo?.country?.name?.common!,
                Button_Name: "addToCart()",
                Button_Info: `Tried adding "${p.name}" to cart in product info but its out of stock`,
                Page_Title: extractBaseTitle(document.title),
                Page_URL: routerPath,
                Date: getCurrentDate(),
                Time: getCurrentTime(),
                OS: getOS(),
                Device: getDevice()
            }
            storeButtonInfo(info)

            return
        } else {
            setAddToCartIsLoading(() => true)

            const pWeight: number = p.specification?.weight as unknown as number
            const cartSpecs = removeUndefinedKeys({
                color: p.specification?.colors ? p.specification?.colors[colorId] : undefined,
                size: p.specification?.sizes ? p.specification?.sizes[sizeId] : undefined
            })
            //const productName = `${p.name} ${formatObjectValues(cartSpecs)}`
            const deliveryFee_ = getDeliveryFee(pWeight, clientInfo?.country?.name?.common!)

            //Arranging the cart details
            const cartItem: ICartItem = {
                _id: p._id!,
                image: p.images[0],
                name: p.name,
                unitPrice: customPrice,
                unitWeight: pWeight,
                unitHiddenDeliveryFee: deliveryFee_,
                quantity: quantity,
                subTotalWeight: quantity * pWeight, 
                specs: cartSpecs,
                extraDiscount: p.pricing?.extraDiscount!,
                subTotalHiddenDeliveryFee: deliveryFee_ * quantity,
                subTotalPrice: p.pricing?.basePrice || 0 * quantity,
                subTotalDiscount: 0
            }
            //console.log("Quantity: ", quantity)
            cartItem.subTotalPrice = Number((cartItem.unitPrice * cartItem.quantity).toFixed(2))
            const totalPrice = Number(cartItem.subTotalPrice.toFixed(2))

            let discount
            if (cartItem.extraDiscount?.limit! && cartItem.quantity >= cartItem.extraDiscount?.limit!) {
                cartItem.subTotalDiscount = Number(((cartItem.extraDiscount?.percent! / 100) * totalPrice).toFixed(2))
                //discount = (10 / 100) * totalPrice
            } else {
                cartItem.subTotalDiscount = 0
            }
            const totalDiscount = Number(cartItem.subTotalDiscount.toFixed(2))
            const totalWeight = Number(cartItem.subTotalWeight.toFixed(2))
            const deliveryFee = getDeliveryFee(totalWeight, clientInfo?.country?.name?.common!)
            const totalHiddenDeliveryFee = Number(cartItem.subTotalHiddenDeliveryFee.toFixed(2))

            // const productName = `${product.name} (${cartSpecs.color}, ${typeof cartSpecs.size === "string" ? cartSpecs.size : cartSpecs.size.size})`

            //Checking if cart already exist for the client
            if (cart) {
                //console.log(true)
                //Getting all the cart items with the same cart ID and specs
                let index!: number
                
                for (let i = 0; i < cart.cart.length; i++) {
                    console.log("Testing 2: ", cart.cart[i].specs, cartSpecs)
                    if (cart.cart[i]._id === p._id && areObjectsEqual(cart.cart[i].specs, cartSpecs)) {
                        index = i
                        console.log("Testing: ", areObjectsEqual(cart.cart[i].specs, cartSpecs))
                        break;
                    }
                }

                //const result = cart.cart.some((cart: ICartItem) => cart._id === p._id);
                if (index === undefined) {
                    cart.grossTotalPrice = Number((cart.grossTotalPrice + totalPrice).toFixed(2))
                    cart.totalDiscount = Number((cart.totalDiscount + totalDiscount).toFixed(2))
                    cart.totalWeight = Number((cart.totalWeight + totalWeight).toFixed(2))
                    cart.deliveryFee = Number(deliveryFee.toFixed(2))
                    cart.totalHiddenDeliveryFee = Number((cart.totalHiddenDeliveryFee + totalHiddenDeliveryFee).toFixed(2))
                    cart.cart.push(cartItem)
                    setCart(() => cart)
                    setItem(cartName, cart)
                    if (!order) {
                        await storeCartInfo("Added", clientInfo!, product.name!)
                        notify('success', "Product has been added to cart")
                    }
                } else {
                    if (quantity === cart.cart[index].quantity) {
                        if (!order) {
                            notify('warn', "Item has already been added to cart")
                        }
                    } else {
                        cart.cart[index].quantity = quantity
                        cart.cart[index].subTotalPrice = Number((cart.cart[index].unitPrice * quantity).toFixed(2))
                        cart.cart[index].subTotalWeight = Number((cart.cart[index].unitWeight * quantity).toFixed(2))
                        cart.cart[index].subTotalHiddenDeliveryFee = Number((cart.cart[index].unitHiddenDeliveryFee * quantity).toFixed(2))
                        cart.cart[index].subTotalDiscount = quantity >= cart.cart[index].extraDiscount?.limit! ? Number(((cart.cart[index].extraDiscount?.percent!/100) * cart.cart[index].subTotalPrice).toFixed(2)) : 0
                        cart.grossTotalPrice = Number((cart.cart.reduce((total: number, cart: ICartItem) => total + cart.subTotalPrice, 0)).toFixed(2));
                        cart.totalDiscount = Number((cart.cart.reduce((discount: number, cart: ICartItem) => discount + cart.subTotalDiscount, 0)).toFixed(2));
                        cart.totalWeight = Number((cart.cart.reduce((weight: number, cart: ICartItem) => weight + cart.subTotalWeight, 0)).toFixed(2))
                        cart.totalHiddenDeliveryFee = Number((cart.cart.reduce((hiddenDeliveryFee: number, cart: ICartItem) => hiddenDeliveryFee + cart.subTotalHiddenDeliveryFee, 0)).toFixed(2))
                        cart.deliveryFee = Number((getDeliveryFee(cart.totalWeight, clientInfo?.country?.name?.common!)).toFixed(2))
                        setCart(() => cart)
                        setItem(cartName, cart)
                        if (!order) {
                            await storeCartInfo("Added", clientInfo!, product.name!)
                            notify('success', "Product has been updated to cart")
                        }
                    }
                }

                const car_ = localStorage.getItem(cartName)
                const _car_= JSON.parse(car_ || "{}")
                console.log("cart_: ", _car_)
            } else {
                console.log("No cart: ", false)

                const cart: ICart = {
                    grossTotalPrice: totalPrice,
                    totalDiscount: totalDiscount,
                    totalWeight: totalWeight,
                    totalHiddenDeliveryFee: totalHiddenDeliveryFee,
                    deliveryFee: deliveryFee,
                    cart: [cartItem]
                }

                setItem(cartName, cart)
                //const cart_ = getItem(cartName)
                //console.log("cart: ", JSON.parse(cart_ || "{}"))
                if (!order) {
                    notify('success', "Product has been added to cart")
                }

            }

            setAddedToCart(() => true)

            //This ends the loading icon
            //await sleep(0.5)
            setAddToCartIsLoading(() => false)

            //Storing this info in button research
            const info: IButtonResearch = {
                ID: getItem(userIdName),
                IP: clientInfo?.ip!,
                Country: clientInfo?.country?.name?.common!,
                Button_Name: "addToCart()",
                Button_Info: `Added "${cartItem.name}" to cart in product info`,
                Page_Title: extractBaseTitle(document.title),
                Page_URL: routerPath,
                Date: getCurrentDate(),
                Time: getCurrentTime(),
                OS: getOS(),
                Device: getDevice()
            }
            storeButtonInfo(info)
        } 
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
            addToCart(e, true)

            //Storing this info in button research
            const info: IButtonResearch = {
                ID: getItem(userIdName),
                IP: clientInfo?.ip!,
                Country: clientInfo?.country?.name?.common!,
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

        console.log("Arrow clicked")
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
        console.log("Dimension: ", `${posX}% ${posY}%`)
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
                ID: getItem(userIdName),
                IP: clientInfo?.ip!,
                Country: clientInfo?.country?.name?.common!,
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
        }
    }

    return (
        <>
            {/* <DisplayBar text_={undefined} /> */}
            <div className={styles.header}>
                <div className={styles.bar}></div>
                <div className={styles.barTitle}>
                    <span>Shop more & get more discounts</span>
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
                            <SwiperSlide key={id} className={`${styles.image} ${id === imageIndex ? styles.activeImage : ""}`} onClick={() => {
                                setView(() => image.type === "image" ? "image" : "video")
                                setImageIndex(() => id)
                            }}>
                                {image.type === "video" ? (
                                    <iframe
                                        className={styles.iframe}
                                        src={image.src}
                                        width={image.width}
                                        height={image.height}
                                        //allow="autoplay"
                                        frameBorder={0}
                                        sandbox="allow-scripts allow-downloads allow-same-origin"
                                        //sandbox="allow-forms"
                                    >
                                    </iframe>
                                ) : (
                                    <Image
                                        className={styles.img}
                                        src={image.src}
                                        alt=""
                                        width={image.width}
                                        height={image.height}
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
                                    <span>{clientInfo.country?.currency?.symbol}</span>
                                ) : (
                                    <></>
                                )}
                                {clientInfo?.country?.currency?.exchangeRate ? (
                                    <span>
                                        {round(customPrice * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")}
                                    </span> 
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className={styles.slashed_price}>
                                {clientInfo ? <span>{clientInfo.country?.currency?.symbol}</span> : <></>}
                                {clientInfo?.country?.currency?.exchangeRate ? (
                                    <span>
                                        {round(slashedPrice(customPrice * clientInfo.country.currency.exchangeRate, product.pricing?.discount!), 1).toLocaleString("en-US")}
                                    </span>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                        <div className={styles.product_orders}>
                            <LocalShippingIcon className={styles.icon} />
                            <span>{product.orders?.toLocaleString("en-US")} orders</span>
                        </div>
                        <div className={styles.percent}>
                            <span>-{product.pricing?.discount}%</span>
                        </div>
                        </div>
                        <div className={styles.rating}>
                            <div className={styles.stars}>
                                {stars.map((star, id) => (
                                    <Star className={styles.star} key={id} />
                                ))}
                                <StarHalf className={styles.star} />
                            </div>
                            <span>{product.rating}</span>
                        </div>
                    </div>
                    <button className={styles.return} onClick={(e) => viewReturnPolicy(e)}>
                        <span>Return & Refund Policy</span>
                        <Add style={{ fontSize: "1rem" }}/>
                    </button>
                    <span className={styles.product_deliveryDate}><em>Delivery: {startDeliveryDate} - {endDeliveryDate} <strong>(Free Shipping)</strong></em></span>
                    {product.specification?.colors && product.specification.colors[0] !== "" ? (
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
                    {product.specification?.sizes && product.specification!.sizes[0] !== "" ? (
                        <div className={styles.product_sizes}>
                            <span className={styles.span1}>Size</span>
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
                                        <span>{typeof size === "string" ? size : size.size }</span>
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
                            <button className={styles.cart_button} onClick={(e) => addToCart(e, false)}>
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
                    {/* <button className={activeInfoBtn === 2 ? styles.activeInfoBtn : ""} onClick={(e) => clickInfoBtn(e, 2)}>Reviews</button> */}
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
                        <></>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductInfo;

