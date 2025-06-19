"use client"
///This contains utility functions that are strictly for client based components

///Libraries -->
import { toast } from 'react-toastify';
import { MouseEvent, SetStateAction } from 'react';
import { companyEmail, getCurrentDate, getCurrentTime, storeButtonInfo, extractBaseTitle, removeUndefinedKeys, getDeliveryFee, areObjectsEqual, cartName, storeCartInfo, round, hashValue, sendMetaCapi } from './utils';
import { ClientDevice, ClientOS, DeliveryStatus, IClientInfo, IEventStatus, PaymentStatus, IButtonResearch, ICacheData, IProduct, ICartItem, ICart, IMetaWebEvent, MetaStandardEvent, MetaActionSource } from './interfaces';
import { analytics } from 'googleapis/build/src/apis/analytics';
import { v4 as uuid } from 'uuid';
import { sendGTMEvent } from '@next/third-parties/google';

///Commencing the code
//console.log("Domain: ", domainName)

///This function triggers a notification when called
export const notify = (type: string, message: string): void => {
    switch (type) {
        case "info":
            toast.info(message, {
                position: "top-center",
                style: { backgroundColor: 'white', color: '#1170FF' },
            });
            break
        case "error":
            toast.error(message, {
                position: "top-center",
                style: { backgroundColor: 'white', color: '#1170FF' },
            });
            break
        case "success":
            toast.success(message, {
                position: "top-center",
                style: { backgroundColor: 'white', color: '#1170FF' },
            }); 
            break
        case "warn":
            toast.warn(message, {
                position: "top-center",
                style: { backgroundColor: 'white', color: '#1170FF' },
            }); 
            break
        default:
            console.log("wrong input")
            break
    }
    
}

///This function saves a value to localstorage
export const setItem = (key: string, value: any): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
        let jsonData = JSON.stringify(value)
        localStorage.setItem(key, jsonData);
    } else {
        null
    }
}
  
export const getItem = (key: string): any => {
    // Parse the retrieved data string back into an object
    //console.log('Local: ', localStorage.getItem(key))
    if (typeof window !== 'undefined' && window.localStorage) {
        const item = localStorage.getItem(key)
        //console.log('Item New: ', item)
        if (item === null) {
            return null
        } else {
            if (item === "undefined") {
                return null
            } else {
                return JSON.parse(item);
            }
        }
    } else {
        return null
    }
}

export const removeItem = (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
    } else {
        null
    }
}

///This links opens the social link
export const visitSocialLink = async (social: string, info: IButtonResearch) => {
    //Storing the button information
    console.log("social media2 clicked")
    await storeButtonInfo(info)
    console.log("social media3 clicked")

    if (window) {
        if (social === "instagram") {
            window.open("https://www.instagram.com/official.idealplug", '_blank');
        } else if (social === "facebook") {
            window.open("https://web.facebook.com/profile.php?id=61559971113003", "_blank")
        } else if (social === "twitter") {
            window.open("https://twitter.com/favoursyre", "_blank")
        } else if (social === "linkedin") {
            window.open("https://www.linkedin.com/in/favour-ndubuisi-7b019786/", "_blank")
        } else if (social === "mail") {
            window.open(`mailto:${companyEmail}`, "_blank")
        } else if (social === "whatsapp") {
            window.open("https://api.whatsapp.com/send?phone=8619589402657", "_blank")
        } else if (social === "x") {
            window.open("https://x.com/Idealplug", "_blank")
        } else {
            undefined
        }
    } else {
        undefined
    }
}

///This function is used to get the OS version of a client's device
export const getOS = (): ClientOS => {
    var userAgent = navigator.userAgent,
        platform = navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
        os = ClientOS.MAC_OS;
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = ClientOS.IOS;
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = ClientOS.WINDOW;
    } else if (/Android/.test(userAgent)) {
        os = ClientOS.ANDROID;
    } else if (!os && /Linux/.test(platform)) {
        os = ClientOS.LINUX;
    } else {
        os = ClientOS.UNKNOWN
    }
  
    return os;
}

///This function is used to get the client's device type
export const getDevice = (): ClientDevice => {
    const width = screen.width
    let device: ClientDevice

    if (width <= 600) {
        device = ClientDevice.MOBILE
    } else if (width > 600 && width <= 1200) {
        device = ClientDevice.TABLET
    } else if (width > 1200) {
        device = ClientDevice.DESKTOP
    }

    return device!
}

///This function handles the button for `Add to Cart`
export const addToCart = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, 
    order: boolean,
    product: IProduct,
    clientInfo: IClientInfo,
    routerPath: string,
    customPrice: number,
    cart: ICart,
    colorId: number,
    sizeId: number,
    setAddToCartIsLoading: (value: SetStateAction<boolean>) => void,
    setCart: (value: SetStateAction<ICart | null>) => void,
    setAddedToCart: (value: SetStateAction<boolean>) => void,
    quantity: number,
): Promise<void> => {
    e.preventDefault()

    const p = product
    let storeCartEvent: boolean = false

    if (p.pricing?.inStock === false) {
        notify("info", "This product is currently out of stock, check back later!")

        //Storing this info in button research
        const info: IButtonResearch = {
            ID: clientInfo?._id!,
            IP: clientInfo?.ipData?.ip!,
            City: clientInfo?.ipData?.city!,
            Region: clientInfo?.ipData?.region!,
            Country: clientInfo?.ipData?.country!,
            Button_Name: "addToCart()",
            Button_Info: `Tried adding "${p.name}" to cart in product info but its out of stock`,
            Page_Title: extractBaseTitle(document.title),
            Page_URL: routerPath,
            Date: getCurrentDate(),
            Time: getCurrentTime(),
            OS: getOS(),
            Device: getDevice()
        }
        await storeButtonInfo(info)

        return
    } else {
        setAddToCartIsLoading(() => true)

        const pWeight: number = p.specification?.weight as unknown as number
        const cartSpecs = removeUndefinedKeys({
            color: p.specification?.colors ? p.specification?.colors[colorId] : undefined,
            size: p.specification?.sizes ? p.specification?.sizes[sizeId] : undefined
        })
        //const productName = `${p.name} ${formatObjectValues(cartSpecs)}`
        const deliveryFee_ = getDeliveryFee(pWeight, clientInfo?.countryInfo?.name?.common!)

        //Arranging the cart details
        const cartItem: ICartItem = {
            _id: p._id!,
            image: p.images[0],
            name: p.name,
            unitPrice: customPrice,
            unitWeight: pWeight,
            unitHiddenDeliveryFee: deliveryFee_,
            discountPercent: p.pricing?.discount!,
            category: p.category?.mini!,
            quantity: quantity,
            subTotalWeight: quantity * pWeight, 
            specs: cartSpecs,
            extraDiscount: p.pricing?.extraDiscount!,
            subTotalHiddenDeliveryFee: deliveryFee_ * quantity,
            subTotalPrice: customPrice * quantity,
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
        const deliveryFee = getDeliveryFee(totalWeight, clientInfo?.countryInfo?.name?.common!)
        const totalHiddenDeliveryFee = Number(cartItem.subTotalHiddenDeliveryFee.toFixed(2))

        // const productName = `${product.name} (${cartSpecs.color}, ${typeof cartSpecs.size === "string" ? cartSpecs.size : cartSpecs.size.size})`

        //Checking if cart already exist for the client
        if (cart) {
            //console.log(true)
            //Getting all the cart items with the same cart ID and specs
            let index!: number
            
            for (let i = 0; i < cart.cart.length; i++) {
                //console.log("Testing 2: ", cart.cart[i].specs, cartSpecs)
                if (cart.cart[i]._id === p._id && areObjectsEqual(cart.cart[i].specs, cartSpecs)) {
                    index = i
                    //console.log("Testing: ", areObjectsEqual(cart.cart[i].specs, cartSpecs))
                    break;
                }
            }

            //const countryInfo_ = countryList.find((country) => country.name?.common === clientInfo?.ipData?.country)
            //const stateInfo_ = countryInfo_?.states?.find((state) => state.name === clientInfo?.ipData?.region)

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
                    notify('success', "Product has been added to cart")
                    console.log("Store cart info ---1")
                    storeCartEvent = true

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
                    cart.deliveryFee = Number((getDeliveryFee(cart.totalWeight, clientInfo?.countryInfo?.name?.common!)).toFixed(2))
                    setCart(() => cart)
                    setItem(cartName, cart)
                    if (!order) {
                        notify('success', "Product has been updated to cart")
                        console.log("Store cart info ---2")
                        storeCartEvent = true
                    }
                }
            }

            // const car_ = localStorage.getItem(cartName)
            // const _car_= JSON.parse(car_ || "{}")
            // //console.log("cart_: ", _car_)
        } else {
            //console.log("No cart: ", false)

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
            ID: clientInfo?._id!,
            IP: clientInfo?.ipData?.ip!,
            City: clientInfo?.ipData?.city!,
            Region: clientInfo?.ipData?.region!,
            Country: clientInfo?.ipData?.country!,
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

    if (storeCartEvent) {
        console.log("Store this info....")
        //Storing cart infos and events
        await storeCartInfo("Added", clientInfo!, product.name!)

        //Sending page view event to gtm
        const countryInfo_ = clientInfo?.countryInfo //countryList.find((country) => country.name?.common === clientInfo?.ipData?.country)
        //const stateInfo_ = countryInfo_?.states?.find((state) => state.name === clientInfo?.ipData?.region)
        const eventTime = Math.round(new Date().getTime() / 1000)
        const eventId = uuid()
        const userAgent = navigator.userAgent
        const { fbp, fbc } = getFacebookCookies();
        const eventData: IMetaWebEvent = {
            data: [
                {
                    event_name: MetaStandardEvent.AddToCart,
                    event_time: eventTime,
                    event_id: eventId,
                    action_source: MetaActionSource.website,
                    custom_data: {
                        content_name: extractBaseTitle(document.title),
                        content_ids:  cart?.cart.map((item) => item._id),
                        content_type: cart?.cart.length === 1 ? "product" : "product_group",
                        value: round(customPrice * countryInfo_?.currency?.exchangeRate!, 2),
                        currency: countryInfo_?.currency?.abbreviation,
                        content_category: product.category?.micro,
                        contents: cart?.cart.map((item) => ({
                            id: item._id,
                            //name: item.name,
                            quantity: item.quantity,
                            item_price: item.subTotalPrice,
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
                        event_name: MetaStandardEvent.AddToCart,
                        event_time: eventTime,
                    }
                }
            ]
        } 

        console.log('Sending GTM event')
        sendGTMEvent({ event: eventData.data[0].event_name, value: eventData.data[0] })

        console.log('Sending Meta Api event')
        await sendMetaCapi(eventData, clientInfo?._id!, getOS(), getDevice())
    }
}

//This is a custom cache function
// export const setCacheItem = (key: string, value: any, expirationTime: number = 0, override: boolean = false): void => {
//     if (typeof window !== 'undefined' && window.localStorage) {
//         // Check if item exists in localStorage and if override is false
//         const existingItem = localStorage.getItem(key);
//         if (existingItem && !override) {
//             const existingData: ICacheData = JSON.parse(existingItem);
//             const currentTime = Date.now();

//             // If the data has expired, we should save new data
//             if (currentTime > existingData.timestamp + existingData.expirationTime) {
//                 console.log('Cache expired, saving new data.');
//             } else {
//                 console.log('Cache still valid, not overriding.');
//                 return; // Don't override if cache is still valid and override flag is false
//             }
//         }

//         // Create CacheData object with expiration time (in ms)
//         const cacheData: ICacheData = {
//             value: value,
//             timestamp: Date.now(),
//             expirationTime: expirationTime * 1000
//         };

//         // Save cache data to localStorage
//         localStorage.setItem(key, JSON.stringify(cacheData));
//     }
// };

// //This is a custom cache function
// export const getCacheItem = (key: string): any => {
//     if (typeof window !== 'undefined' && window.localStorage) {
//         const item = localStorage.getItem(key);

//         if (item === null) {
//             return null; // If the item doesn't exist
//         } else {
//             try {
//                 const cacheData: ICacheData = JSON.parse(item);
//                 const currentTime = Date.now();

//                 // If the cache data has expired
//                 if (currentTime > cacheData.timestamp + cacheData.expirationTime && cacheData.expirationTime > 0) {
//                     // Remove expired data from cache
//                     localStorage.removeItem(key);
//                     return null;
//                 }

//                 // Return the cached value
//                 return cacheData.value;
//             } catch (error) {
//                 console.error('Error parsing cache data:', error);
//                 return null;
//             }
//         }
//     }
//     return null;
// };

//This is a function that handles caching of data using local storage
export const Cache = (key: string) => {
    //console.log('cache key: ', key)

    const get = (): any | undefined => {
        try {
            const item = getItem(key) as unknown as { value: any, validPeriod: number, dateCreated: number }
            if (item) {
                if (item.validPeriod === 0) {
                    return item.value
                } else {
                    const currentTime = Date.now()
                    const timeDifference = (currentTime - item.dateCreated) / 1000;  // Converting ms to s
                    if (timeDifference > item.validPeriod) {
                        //removeItem(key)
                        throw new Error("Data is expired")
                        //window.location.reload()
                    } else {
                        return item.value
                    }
                }
            } else {
                throw new Error("Data doesn't exist, crosscheck key")
            }
        } catch (error) {
            //console.log('Error in getting cache: ', error)
            return undefined
        }
    }

    const set = (value: any, revalidate: number = 0): boolean => {
        //0 means never expires, meaning never refreshes
        try {
            const data: {
                value: any,
                validPeriod: number, //This is in seconds
                dateCreated: number
            } = {
                value: value,
                validPeriod: revalidate,
                dateCreated: Date.now()
            }
            setItem(key, data)
            return true
        } catch (error) {
            //console.log('Error in setting cache: ', error)
            return false
        }
    }

    return {
        get,
        set
    };
}

/**
 * Retrieves _fbc and _fbp cookies from the browser.
 * Returns null for each if the cookie is not found or if running server-side.
 */
export function getFacebookCookies(): { fbp?: string, fbc?: string } {
    // Ensure client-side execution
    if (typeof window === 'undefined') {
      return { fbp: undefined, fbc: undefined };
    }
  
    // Function to get a cookie by name
    const getCookie = (name: string): string | undefined => {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? match[2] : undefined;
    };
  
    return {
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc'),
    };
  }
