//"use client"
///This contains all the utilities

///Libraries --> 
import React from 'react';
import { ICategoryInfo, IOrderSheet, IProduct, ICountry, IEventStatus, PaymentStatus, DeliveryStatus, IImage, IClientInfo, IWishlistResearch, ISheetInfo, IMarketPlatform, IButtonResearch, ICart, ICartItemDiscount, IMetaWebEvent, IEventResearch, ClientOS, ClientDevice, ICartItem, IProductReview } from './interfaces';
import styles from "@/styles/_base.module.scss"
import { Readable } from 'stream';
import { countryList } from './database';
import axios from 'axios';
import fs from "fs"
import https from "https"
import path from "path";
//import sharp from 'sharp';
import { createHash } from 'crypto';
import { IncomingMessage } from 'http';
import { getOS, getDevice } from './clientUtils';
import md5 from 'md5'
import { companyName as _companyName, deliveryPeriod as _deliveryPeriod, deliveryDuration as _deliveryDuration } from './sharedUtils';

///Commencing the code
export const companyName: string = _companyName

export const companyEmail: string = "support@idealplug.com"

export const nairaSymbol: string = "&#8358;"

export const nairaRate: number = 1200

export const discount: number = 33

export const extraDiscount: number = 5

export const deliveryPeriod: number = _deliveryPeriod //(Unit is in days) This means delivery is within 4 days

export const deliveryDuration: number = _deliveryDuration //This represents the time range within which the delivery will be made

export const minKg: number = 0.5

//export const mediaFolderId: string = "https://developers.google.com/oauthplayground"

export const deliveryFeePerKg: number = 0.8 //Unit is in USD

export const domainName: string = process.env.NEXT_PUBLIC_DOMAIN_NAME! //"http://localhost:3000"
//export const domainName: string = "http://192.168.43.133:3000"
//export const domainName: string = "https://idealplug.com"

///The backend api point
//export const backend = "https://idealplug.com/api"
export const backend = process.env.NEXT_PUBLIC_BACKEND! //"http://localhost:3000/api"

export const orderSheetId: string = "1sRUnpH6idKiS3pFH50DAPxL29PJpPXEgFHipC7O5kps"

export const statSheetId: string = "1sxI_f2u4Pyxfp-8lwZr6O42YWpIJSEvVfAPrAjkB-oQ"

export const mediaFolderId: string = "1c_PAN5IenoKGNtRJJ7MG6zfa5jZC9bwH"

export const stripePublishableKey: string = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!

export const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY!

///This function gets an array and sends the regrouped array of specified length
export const groupList = (arr: Array<any>, length: number): Array<any> => {
    let result = []
    let chunk: any
    for (let i: number = 0; i < arr.length; i += length) {
        chunk = arr.slice(i, i + length);
        result.push(chunk);
    }

    return result
}

//Cart name
export const cartName: string = "idealPlugCart"

export const wishListName: string = "idealPlugWishList"

export const deliveryName: string = "idealPlugDeliveryInfo"

export const adminName: string = "idealPlugAdmin"

export const productInfoName: string = "idealPlugProduct"

export const extraDeliveryFeeName: string = "idealPlugExtraDeliveryFee"

export const productFilterName: string = "idealPlugProductFilterSettings"

export const clientInfoName: string = "idealPlugClientInfo"

export const userIdName: string = "idealPlugUserId"

export const productsName: string = "idealPlugProducts"

export const transactionIdName: string = "idealPlugTransactionId"

//Order name
export const orderName: string = "idealPlugOrders"

export const SUPPORT_EMAIL: string = companyEmail
export const SUPPORT_PASSWORD: string = process.env.NEXT_PUBLIC_SENDER_PASSWORD!

///These are list of various platforms
export const platformList: Array<IMarketPlatform> = [
    { name: "AliExpress", url: "aliexpress.us" },
    { name: "Amazon", url: "amazon.com" },
]

export const logo: IImage = {
    src: "https://drive.google.com/uc?export=download&id=1V-QyvBujfHsM0fIimUT3PL2DwjZCWJXG",
    alt: "logo",
    width: 2500,
    height: 2500
}
  
// const routerPath = usePathname();
// console.log("router: ", routerPath)
///This checks for a router path and renders the necessary style for it
export const routeStyle = (router: string, styles: { readonly [key: string]: string } ): string => {
    //console.log("Router: ", router)
    switch (router) {
        case "/":
            return styles.homePage
        case "/cart":
            return styles.cartPage
        case "/wishlist":
            return styles.wishListPage
        case "/terms":
            return styles.termsPage
        case "/order":
            return styles.orderPage
        case "/about":
            return styles.aboutPage
        case "/faqs":
            return styles.faqsPage
        case "/products":
            return styles.productPage
        default:
            if (router.includes("/admin/login")) {
                return styles.adminLoginPage
            } else if (router.includes("/admin")) {
                return styles.adminPage
            } else if (router.includes("/products/")) {
                return styles.productInfoPage
            } else if (router.includes("/order/receipt")) {
                return styles.orderReceiptPage
            } else {
                return styles.others
            }
    }
}

///This extracts title
export const extractBaseTitle = (title: string): string => {
    const [baseTitle] = title.split(' | '); // Split by ' | ' and take the first part
    return baseTitle;
}
    
//This function checks if 2 objects are equal
export const areObjectsEqual = <T extends { [key: string]: any }>(obj1: T | undefined, obj2: T | undefined): boolean => {

    if (obj1 && obj2) {
        // Check if both objects have the same set of keys
        const obj1Keys = Object.keys(obj1);
        const obj2Keys = Object.keys(obj2);
    
        if (obj1Keys.length !== obj2Keys.length) {
            return false;
        }
    
        // Check if all values are equal
        for (const key of obj1Keys) {
            const val1 = obj1[key];
            const val2 = obj2[key];
        
            // Check if both values are objects
            const areBothObjects = isObject(val1) && isObject(val2);
        
            if (
                (areBothObjects && !areObjectsEqual(val1, val2)) || // Deep check for objects
                (!areBothObjects && val1 !== val2) // Direct check for other types
            ) {
                return false;
            }
        }

        return true
    } else {
        return false;
    }
  }
  
  // Helper function to check if a value is an object
  export const isObject = (obj: any): boolean => {
    return obj != null && typeof obj === 'object';
  }

///This function returns a parsed html tag
export const parsedHtml = (htmlTag: string, tagType: string): React.ReactElement => {
    return React.createElement(
        tagType,
        { dangerouslySetInnerHTML: { __html: htmlTag } }
      );
}

//This function helps check if a discount offer exist
export const checkExtraDiscountOffer = (product: IProduct): boolean => {
    const xtraDiscount = product.pricing?.extraDiscount
    if (!xtraDiscount || !xtraDiscount.limit || !xtraDiscount.percent || xtraDiscount.limit === 0 || xtraDiscount.percent === 0) {
        return false
    } else {
        return true
    }
}

//This function gets a gravatar image from a text
export const getGravatarImg = (text: string): IImage => {
  const normalizedText = text.toLowerCase().trim();
  const hash = hashValue(normalizedText, "md5");
  const img: IImage = {
    src: `https://www.gravatar.com/avatar/${hash}?d=identicon`,
    alt: "gravatar",
    width: 80,      
    height: 80,
    type: "image"
  }
  return img;
};

//This function gets a random number between a given range
export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

///This function exports a array shuffler function
export const shuffleArray = <T>(array: Array<T>): Array<T> => {
    if (array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    } else {
        return array
    }
}

//Function to delete a product from an array using _id
export const deleteProductById = (products: Array<IProduct>, id: string): Array<IProduct> => {
    return products.filter(product => product._id !== id);
}
  
//Function to check if a product exists by _id, and if not, add it
export const addProductIfNotExists = (products: Array<IProduct>, newProduct: IProduct): Array<IProduct> => {
    const exists = products.some(product => product._id === newProduct._id);

    if (!exists) {
        return [...products, newProduct]; // Add new product if it doesn't exist
    }

    return products; // Return the original array if the product already exists
}

//This function checks if a link is an image
export const isImage = (url: string | undefined): boolean => {
    if (url) {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'avif'];
        const extension = url.split('.').pop()?.toLowerCase();
        return imageExtensions.includes(extension || '');
    } else {
        return false
    }
};

//This function checks if a link is a video
export const isVideo = (url: string | undefined): boolean => {
    if (url) {
        // List of common video file extensions
        const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'm4v', 'mpeg'];
        // Extract the file extension from the URL
        const extension = url.split('.').pop()?.toLowerCase();
        // Check if the file extension matches one of the video extensions
        return videoExtensions.includes(extension || '');
    } else {
        // If the URL is undefined or doesn't have an extension, return false
        return false;
    }
};

//This function deletes the downloaded image from the system
export const deleteFile = async (filePath: string): Promise<void> => {
    try {
        // Resolve the full path
        let absolutePath: string;
        if (domainName.includes("localhost")) {
            absolutePath = path.resolve(filePath);
        } else {
            absolutePath = path.join(process.cwd(), filePath);
        }

        // Check if file exists
        if (!fs.existsSync(absolutePath)) {
            console.warn(`File does not exist at: ${absolutePath}`);
            return; // Not throwing an error here, as file is already gone
        }

        // Delete the file (using promises version of fs)
        await fs.promises.unlink(absolutePath);
        //console.log(`File deleted successfully: ${absolutePath}`);

    } catch (error) {
        console.error('Error deleting file:', {
            message: (error as Error).message,
            path: filePath
        });
        throw error;
    }
}

//This function generates direct links for google drive files
export const getGDriveDirectLink = (driveId: string): string  => {
    return `https://drive.google.com/uc?export=download&id=${driveId}`
}

//This function gets the preview links for google drive videos
export const getGDrivePreviewLink = (driveId: string): string => {
    return `https://drive.google.com/file/d/${driveId}/preview`
}

//This function extracts the id from google direct links
export const getGDriveDirectLinkId = (url: string): string | null  => {
    try {
        // Parse the URL
        const parsedUrl = new URL(url);
        
        // Get the value of the 'id' query parameter
        const id = parsedUrl.searchParams.get('id');
        
        return id;
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}

//This function rounds numbers up
export const round = (value: number, precision: number): number => {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

//This function extracts main zip from a zip+4 code
export const extractMainZipCode = (zipCode: string): string | null => {
    // Check if the input is just a 5-digit ZIP code
    if (/^\d{5}$/.test(zipCode)) {
      return zipCode;  // Return the 5-digit ZIP code as it is
    }
  
    // Regular expression to match the 9-digit ZIP+4 code
    const match = zipCode.match(/^(\d{5})-\d{4}$/);
    
    if (match) {
      // Return the main 5-digit ZIP code (first capture group)
      return match[1];
    } else {
      // Return null if the input is not a valid ZIP or ZIP+4 code
      return null;
    }
  }

//This function calculates the delivery fee for a product in USD
export const getDeliveryFee = (weight: number, country: string) => {
    
    let deliveryFee: number
    const clientCountry = countryList.find((c) => c.name?.common === country)
    const baseNumber = clientCountry?.delivery?.baseNumber ? clientCountry?.delivery?.baseNumber : 9
    const feePerKg = clientCountry?.delivery?.feePerKg ? clientCountry.delivery.feePerKg : 0.9

    //console.log("Total W: ", weight, baseNumber, feePerKg, clientCountry, country)

    if (weight <= minKg) {
        //deliveryFee = minKg * deliveryFeePerKg
        deliveryFee = baseNumber * feePerKg
    } else {
        //const newWeight = round(weight, 0)
        const xtraWeight = (weight - minKg)
        //console.log("Exra W: ", xtraWeight)
        const baseDeliveryFee = baseNumber * feePerKg
        const extraDeliveryFee = xtraWeight * feePerKg
        deliveryFee = baseDeliveryFee + extraDeliveryFee
    }

    return deliveryFee

    //return 0
}

///This fetches a list of all products
export async function getProducts() {

    try {
      const res = await fetch(`${backend}/product?action=latest`, {
        method: "GET",
        //cache: "force-cache"
      })
  
      if (res.ok) {
        const data = await res.json()
        //console.log("Products: ", data)
        return data
      } else {
        getProducts()
      }
    } catch (error) {
        console.log('Products Error: ', error)
        console.error(error);
    }
  }

///This fetches a list of all reviews
export async function getProductReviews() {

    try {
      const res = await fetch(`${backend}/product-review`, {
        method: "GET",
        //cache: "force-cache"
      })
  
      if (res.ok) {
        const data = await res.json()
        //console.log("Products: ", data)
        return data
      } else {
        getProductReviews()
      }
    } catch (error) {
        console.log('Product Reviews Error: ', error)
        console.error(error);
    }
}

//This function returns only a digit after a dash i.e. `+1-292019` => `292019`
export const extractDigitsAfterDash = (phoneNumber: string): string => {
    
    // Use a regular expression to match and extract the digits after the dash
    const match = phoneNumber.match(/-(\d+)/);
  
    // If a match is found, return the captured digits; otherwise, return an empty string
    return match ? match[1] : '';
}

//This function returns only a digit after a dash i.e. `+1-292019` => `1292019`
export const extractOnlyDigits = (phoneNumber: string): string => {
    return phoneNumber.replace(/\D/g, '');
};

//This function checks if for a state that has 0 extraDeliveryPercent
export const findStateWithZeroExtraDeliveryPercent = (country: ICountry | undefined) => {
    if (country) {
        if (!country.states) {
            return undefined;
        }
    
        for (let state of country.states) {
            if (state.extraDeliveryPercent === 0) {
                return state;
            }
        }
    
        return undefined;
    } 
};

///This contains the sort options for products
export const sortProductOptions = [
    {id: 0, name: "Most Ordered"},
    {id: 1, name: "Newest Arrivals"},
    {id: 2, name: "Price: High to Low"},
    {id: 3, name: "Price: Low to High"},
    {id: 4, name: "Most Recommended"}
]

///This contains the sort options for orders
export const sortOrderOptions = [
    {id: 0, name: "Latest"},
    {id: 1, name: "Oldest"},
    {id: 2, name: "Price: High to Low"},
    {id: 3, name: "Price: Low to High"},
    {id: 4, name: DeliveryStatus.PENDING},
    {id: 4, name: DeliveryStatus.IN_TRANSIT},
    {id: 6, name: DeliveryStatus.DELIVERED},
    {id: 7, name: DeliveryStatus.RETURNED},
    {id: 8, name: DeliveryStatus.EXCEPTION},
    {id: 9, name: DeliveryStatus.CANCELLED}
]

///This decodes a unicode string
export const decodedString = (unicodeString: string) => {
    return unicodeString.replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(dec));
}

///This function capitalizes the first letter of every word
export const capitalizeFirstLetter = (str: string): string => {
    if (str) {
        return str.replace(/\b\w/g, (match) => match.toUpperCase());
    } else {
        return str
    }
  }

  ///This function returns all item with a key in array
export const getItemByKey = <T>(
    array: Array<T>, 
    key: keyof T, 
    value: any
): Array<T> => {
    if (value !== null) {
        return array.filter((arr) => arr[key] === value);
    } else {
        return array
    }
}

//This function converts ["a", "b", "c"] to a, b and c
export const formatArrayToString = (arr: Array<string>): string => {
    if (arr.length === 0) {
      return "";
    } else if (arr.length === 1) {
      return arr[0];
    } else {
      const lastItem = arr.pop();
      const joinedItems = arr.join(", ");
      return `${joinedItems}, and ${lastItem}`;
    }
};

//This function is extracts the main title of a page i.e. `Home | Idealplug` => `Home`
export const extractMainPageTitle = (title: string): string => {
    // Split the string by the '|' character
    const parts = title.split('|');
    
    // Extract the first part and trim any whitespace
    const firstWord = parts[0].trim();
    
    // Return the first word
    return firstWord;
}

  ///This function types check the currency symbol
//   export const getCurrencySymbol = (clientInfo: IClientInfo | null): string => {
//     if (clientInfo === null) {
//         return "&#36;"
//     } else {
//         return clientInfo.currencySymbol as unknown as string
//     }
//   }

   ///This function types check the exchange rate
//    export const getExchangeRate = (clientInfo: IClientInfo | null): number => {
//     if (clientInfo === null) {
//         return 1
//     } else {
//         return clientInfo.exchangeRate as unknown as number
//     }
//   }

///This format mongo db time
export const formatDateMongo = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    
    // Format the date using Intl.DateTimeFormat
    const formattedDate = date.toLocaleDateString(undefined, options);
  
    return `${formattedDate}`;
};

//This function masks a string with asterisks
export const maskString = (input: string): string => {
  // Remove any surrounding whitespace and convert to lowercase
  const cleanInput = input.trim().toLowerCase();

  // If input is too short, return masked version accordingly
  if (cleanInput.length <= 4) {
    return cleanInput[0] + '**' + cleanInput[cleanInput.length - 1];
  }

  const start = cleanInput.slice(0, 2);
  const end = cleanInput.slice(-2);

  return `${start}***${end}`;
}

///This function deletes an item by the key from an array
export const deleteItemByKey = (array: Array<any>, key: string, value: string): Array<any> => {
    return array.filter((arr) => arr[key] !== value);
  }

///This function gets the slashed price depending on the discount
export const slashedPrice = (price: number, discount: number): number => {
    return (price * 100) / (100 - discount)
}

//This function calculates the total slashed price of a cart
export const calculateTotalSlashedPrice = (cart: ICart): number => {
  return cart.cart.reduce((total: number, item: ICartItem): number => {
    // If discountPercent is undefined or 0, slashed price equals subTotalPrice
    if (!item.discountPercent || item.discountPercent === 0) {
      return total + item.subTotalPrice;
    }
    // Calculate slashed price using subTotalPrice and discountPercent
    const slashedPriceForItem = slashedPrice(item.subTotalPrice, item.discountPercent);
    return total + slashedPriceForItem;
  }, 0);
};

///The function delays the code
export const sleep = (seconds: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

///This function sorts the array by orders in descending order
export const sortProductByOrder = (products: Array<IProduct>): Array<IProduct> => {
    // Sort the array based on the orders property in descending order
    const sortedProducts = products.sort((a, b) => {
        // If orders property is present in both objects, sort in descending order
        if (a.orders !== undefined && b.orders !== undefined) {
            return b.orders - a.orders;
        } 
        // If orders property is not present in one of the objects, move it to the end
        else if (a.orders === undefined && b.orders !== undefined) {
            return 1;
        } else if (a.orders !== undefined && b.orders === undefined) {
            return -1;
        } else {
            return 0; // If both orders properties are undefined, maintain current order
        }
    });
    return sortedProducts
}

// Format the time in HH:mm:ss format
export const formatTime = (timeInMilliseconds: number): string => {
    const totalSeconds = Math.floor(timeInMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

//This sorts products by rating from high to low
export const sortProductByRating = (products: Array<IProduct>): Array<IProduct> => {
    return products.slice().sort((a, b) => {
        // If rating is undefined, treat it as 0 for comparison
        const ratingA = a.rating ?? 0;
        const ratingB = b.rating ?? 0;

        // Sort in descending order (highest rating first)
        return ratingB - ratingA;
    });
}

//Generic sorting mongo query function
export const sortMongoQueryByTime = <T extends { createdAt?: string }>(
    items: Array<T>, action: "latest" | "oldest"
): Array<T> => {

    if (items) {
        if (!Array.isArray(items)) {
            return [items]
        }
        
        // Create a copy to avoid mutating the original array
        const sortedItems = [...items].sort((a, b) => {
            // Handle cases where createdAt might be undefined or invalid
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0); // Fallback to epoch
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0); // Fallback to epoch
            // Sort based on action
            return action === "latest" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime(); // Descending order (latest first)
        });

        //console.log("Sorted: ", sortedItems);
        return sortedItems;
    } else {
        return items
    }
};

///This function sorts the array by the price property
export const sortProductByPrice = (products: Array<IProduct>, action: "descend" | "ascend"): Array<IProduct> => {
    ///This function sorts the price property from highest price to lowest price
    if (action === "descend") {
        const sortedProducts = products.sort((a, b) => {
            const priceA = a.pricing?.basePrice ?? 0; // Default to 0 if price is undefined
            const priceB = b.pricing?.basePrice ?? 0; // Default to 0 if price is undefined
            return priceB - priceA;
        });
        return sortedProducts
    } else if (action === "ascend") {
        ///This function sorts the price property from lowest price to highest price
        const sortedProducts = products.sort((a, b) => {
            const priceA = a.pricing?.basePrice ?? 0; // Default to 0 if price is undefined
            const priceB = b.pricing?.basePrice ?? 0; // Default to 0 if price is undefined
            return priceA - priceB;
        });
        return sortedProducts
    } else {
        return products
    }
}

///This function sorts the products by category
// export const sortByCategory = (products: Array<IProduct>, category: string): Array<IProduct> => {
//     const categories_ = categories.map((category) => category.macro)

//     if (category === "All") {
//       return products;
//     } else {
        
//         for (let i: number = 0; i < categories_.length; i++) {
//             if (category === categories_[i]) {
//                 return products.filter(product => product.category?.macro === categories_[i]);
//             } 
//         }
//         return products
//   };
// }

///This removes undefined keys from an object e.g. {age: 30, color: undefined} => {age: 30}
export const removeUndefinedKeys = (obj: { [key: string]: any }): { [key: string]: any } => {
    //Create a new object to store the filtered key-value pairs
    const newObj: { [key: string]: any } = {};

    //Iterate over each key-value pair in the original object
    for (const key in obj) {
        if (obj[key] !== undefined) {
            //Only add the key-value pair to the new object if the value is not undefined
            newObj[key] = obj[key];
        }
    }

    //Return the new object
    return newObj;
}

//This function converts values !== undefined in an object to `(val1, val2, val3)`
export const formatObjectValues = (obj: { [key: string]: any }): string => {
    // Extract all the values from the object that are not undefined
    const values = Object.values(obj).filter(value => value !== undefined);
    
    // If no values are present, return an empty string
    if (values.length === 0) {
        return '';
    }

    // Join the values with a comma and space, and enclose in parentheses
    return `(${values.join(', ')})`;
}

//This function is used to format aliexpress image url to have a better resolution i.e. 960x960
export const formatAliexpressImageUrl = (url: string) => {
    return url.replace(
        /_(\d+x\d+)[a-z\d]*(\.[a-z]+_)/i,
        '_960x960$2'
    );
}

//This removes all non numeric chars liek $, %, &, etc.
export const extractNum = (char: string): number => {
    if (typeof char !== 'string') {
        throw new TypeError('Input must be a string');
    }

    // Remove any non-numeric characters (like $, %, etc.)
    const numericString = char.replace(/[^0-9.-]/g, '');

    // Convert the cleaned string to a number
    const number = parseFloat(numericString);

    if (isNaN(number)) {
        throw new Error('Input string does not contain a valid number');
    }

    return number;
}

/**
 * @notice This gets the current date
 * @returns The current date
 */
export const getCurrentDate = (): string => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    
    // Format the date as desired, e.g., "YYYY-MM-DD"
    const formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
}
  
/**
 * @notice This gets the current time
 * @returns The current time
 */
export const getCurrentTime = (): string => {
    const currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    const meridian = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    // Add leading zeros if necessary
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    // Format the time as desired, e.g., "hh:mm AM/PM"
    const formattedTime = `${formattedHours}:${formattedMinutes} ${meridian}`;

    return formattedTime;
}

///This function removes an item from an array
export const removeProductFromArray = (productToRemove: IProduct, products: Array<IProduct>): Array<IProduct> => {
    // Check if the product exists in the array
    const index = products.findIndex(product => product._id === productToRemove._id);
    
    // If the product exists, remove it from the array
    if (index !== -1) {
        return products.filter((_, i) => i !== index);
    }
    
    // If the product doesn't exist, return the original array
    return products;
};

//This function cleans a product array
export const removeItemsFromArray = (itemA: Array<IProduct>, itemB: Array<IProduct>): Array<IProduct> => {
    // Create a Set of _id values from itemB for quick lookup
    const itemBIds = new Set(itemB.map(item => item._id));

    // Filter out items from itemA whose _id is found in itemBIds
    return itemA.filter(item => !itemBIds.has(item._id));
}

// Sample function to determine similarity between two products
const isSimilarProduct = (productA: IProduct, productB: IProduct, level: number | void): boolean => {
    if (level === 0) {
        return (
            productA.name === productB.name
        )
    } else if (level === 1) {
        return (
            productA.category?.macro === productB.category?.macro &&
            productA.category?.mini === productB.category?.mini &&
            productA.category?.micro === productB.category?.micro &&
            productA.category?.nano === productB.category?.nano
        )
    } else if (level === 2) {
        return (
            productA.category?.macro === productB.category?.macro &&
            productA.category?.mini === productB.category?.mini &&
            productA.category?.micro === productB.category?.micro
        )
    } else if (level === 3) {
        return (
            productA.category?.macro === productB.category?.macro &&
            productA.category?.mini === productB.category?.mini
        )
    } else if (level === 4) {
        return (
            productA.category?.macro === productB.category?.macro
        )
    } else {
        return false
    }
    // } else {
    //     return (
    //         productA.category === productB.category
    //     )
    // }
};

//Function to sort products based on similarity to a target product
export const sortProductsBySimilarity = (products: Array<IProduct>, targetProduct: IProduct): Array<IProduct> => {
    let similarProducts: Array<IProduct> = [];
    let otherProducts: Array<IProduct> = [];
    let onlySimilarNamedProducts: Array<IProduct> = []
    let onlySimilarNanoProducts: Array<IProduct> = []
    let onlySimilarMicroProducts: Array<IProduct> = []
    let onlySimilarMiniProducts: Array<IProduct> = []
    let onlySimilarMacroProducts: Array<IProduct> = []

    //Using the first level of similarity sorting to find similar names
    products.forEach((product) => {
        if (isSimilarProduct(product, targetProduct, 0)) {
            onlySimilarNamedProducts.push(product);
        } 
    });

    //Using the first level of similarity sorting to find only similar nano categories
    products.forEach((product) => {
        if (isSimilarProduct(product, targetProduct, 1)) {
            onlySimilarNanoProducts.push(product);
        }
    });

    //Using the first level of similarity sorting to find only similar micro categories
    products.forEach((product) => {
        if (isSimilarProduct(product, targetProduct, 2)) {
            onlySimilarMicroProducts.push(product);
        }
    });

    //Using the second level of similarity sorting to find only similar mini categories
    products.forEach((product) => {
        if (isSimilarProduct(product, targetProduct, 3)) {
            onlySimilarMiniProducts.push(product);
        }
    });

    //Using the second level of similarity sorting to find only similar macro categories
    products.forEach((product) => {
        if (isSimilarProduct(product, targetProduct, 4)) {
            onlySimilarMacroProducts.push(product);
        }
    });

    //Sorting/Cleaning the products
    let onlySimilarNanoProducts_ = removeItemsFromArray(onlySimilarNanoProducts, onlySimilarNamedProducts)

    let onlySimilarMicroProducts_ = removeItemsFromArray(onlySimilarMicroProducts, onlySimilarNanoProducts)

    let onlySimilarMiniProducts_ = removeItemsFromArray(onlySimilarMiniProducts, onlySimilarMicroProducts)

    let onlySimilarMacroProducts_ = removeItemsFromArray(onlySimilarMacroProducts, onlySimilarMiniProducts)

    let otherProducts_ = removeItemsFromArray(products, onlySimilarMacroProducts)

    return [
        ...shuffleArray(onlySimilarNamedProducts), 
        ...shuffleArray(onlySimilarNanoProducts_), 
        ...shuffleArray(onlySimilarMicroProducts_),
        ...shuffleArray(onlySimilarMiniProducts_), 
        ...shuffleArray(onlySimilarMacroProducts_),
        ...shuffleArray(otherProducts_)
    ];
};

//This function is used to sort products based on active or inactive
export const sortProductByActiveStatus = (products: Array<IProduct>, label: "All" | "Active" | "Inactive", stock: "unshow" | void): Array<IProduct> | undefined => {
    if (products) {
        if (label === "All") {
            return products
        } else if (label === "Active") {
            let products_
            if (stock === "unshow") {
                // Filter products that are active 
                products_ = products.filter((product) => product.active === true)
            } else {
                // Filter products that are active and in stock
                products_ = products.filter((product) => product.active === true && product.pricing?.inStock === true)
            }
            return products_ 
        } else if (label === "Inactive") {
            let products_ = products.filter((product) => product.active === undefined || product.active === false)
            return products_
        }
    } else {
        return
    }
}

//This function converts web stream to node stream
export const convertToNodeReadableStream = (webStream: ReadableStream<Uint8Array>): Readable => {
    const reader = webStream.getReader();
    const stream = new Readable({
        async read() {
            const { done, value } = await reader.read();
            if (done) {
                this.push(null); // No more data
            } else {
                this.push(Buffer.from(value)); // Push data into the Node.js stream
            }
        },
    });
    return stream;
}

//This fetches a product by id
export const getProduct = async (id: string) => {
    try {
      const res = await fetch(`${backend}/product/${id}`, {
        method: "GET",
        cache: "no-store",
        //next: { revalidate: 120 },
      })
  
      if (res.ok) {
        const data = await res.json()
        //console.log("Product: ", data)
        return data
      } else {
        console.log("not refetching")
        //getProduct(id)
      }
      
    } catch (error) {
        console.error(error);
    }
}

//This fetches all reviews by the product id
export const getProductReviewsByProductId = async (id: string) => {
    try {
      const res = await fetch(`${backend}/product-review/${id}?src=productId`, {
        method: "GET",
        cache: "no-store",
        //next: { revalidate: 120 },
      })
  
      if (res.ok) {
        const data = await res.json()
        console.log("Product Reviews: ", data)
        return data
      } else {
        console.log("not refetching")
        //getProduct(id)
      }
      
    } catch (error) {
        console.error("Product Reviews: ", error);
    }
}

//Calculate the mean rating of a product reviews
export const calculateMeanRating = (reviews: Array<IProductReview>): number => {
  // Filter out reviews with undefined or null ratings
  const validRatings = reviews
    .filter(review => typeof review.rating === 'number')
    .map(review => review.rating!);

  // If no valid ratings, return 0
  if (validRatings.length === 0) {
    return 0;
  }

  // Calculate mean and round to 1 decimal place
  const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
  const mean = sum / validRatings.length;
  return Number(mean.toFixed(1));
}

//This checks if a checks if a country exists and then returns the country object
export const getCountryInfo = (countryName: string): ICountry | undefined => {
    // Find the country in the countryList
    const country = countryList.find((c) => c.name?.common === countryName || c.name?.abbreviation === countryName);
    
    // If the country is found, return it; otherwise, return undefined
    return country;
}

//This function converts an amount in whatever currency it is to cents
export const convertUnitAmountToCent = (unitAmount: number, currency: string, exchangeRate: number): number => {
    if (currency === "USD") {
        return unitAmount
    } else {
        // Convert from smallest unit to major unit (e.g. Kobo to Naira)
        const amountMajorUnit = unitAmount / 100;

        // Convert to USD using the exchange rate
        const amountInUsd = amountMajorUnit / exchangeRate;

        // Convert to USD cents and round
        const amount = Math.round(amountInUsd * 100);
        return amount
    }
}

//This function gets the min stripe amount depending on the currency
export const getMinimumStripeAmount = (currency: string, exchangeRate: number): number => {
    let minimumAmount = 0.5
    if (currency === "USD") {
        return minimumAmount
    } else {
        const newAmount = minimumAmount * exchangeRate
        return newAmount
    }
} 

//This function helps get custom based pricing
export const getCustomPricing = (product: IProduct, sizeId: number, country: string): number => {
    //console.log("custom pricing...")
    const clientCountry = countryList.find((c) => c.name?.common === country)
    //console.log("Client: ", country)
    const size = product.specification?.sizes
    let customPrice
    //console.log("Customm P: ", product)

    const variant = product.pricing?.variantPrices?.find((c) => c.country === clientCountry?.name?.common || c.country === clientCountry?.name?.abbreviation)
    //console.log("Variants: ", variant)
    if (variant && clientCountry) {
        customPrice = variant.amount! //* clientCountry?.currency?.exchangeRate!
    } else {
        customPrice = product.pricing?.basePrice!
    }
    //console.log('Custom Price: ', customPrice)

    if (size) {
        const _size = size[sizeId]
        if (_size) {
            if (typeof _size === "string") {
                //console.log('Custom Price 2: ', customPrice)
                //return customPrice
            } else {
                if (_size?.percent === 0) {
                    //console.log('Custom Price 2: ', customPrice)
                    //return customPrice
                } else {
                    const xtraPrice = (_size?.percent! / 100) * customPrice
                    const newPrice = xtraPrice + customPrice
                    //console.log('Custom Price 2: ', newPrice)
                    customPrice = newPrice
                }
            }
        } else {
            //console.log('Custom Price 2: ', customPrice)
            //return customPrice
            
        }
    } else {
        //console.log('Custom Price 2: ', customPrice)
        //return customPrice
    }

    //This calculates delivery fee
    if (product.addDelivery === false && product.addDelivery !== undefined) {
        customPrice = customPrice
    } else {
        let deliveryFee = getDeliveryFee(product.specification?.weight!, clientCountry?.name?.common!)
        customPrice = customPrice + deliveryFee
    }
        
    //console.log('Custom Price 3: ', customPrice)
    return customPrice
    // const inflation = clientCountry?.priceInflation ? clientCountry.priceInflation : 0
    
    // if (inflation === 0) {
    //     customPrice = product.pricing?.basePrice!
    // } else {
    //     customPrice = ((inflation / 100) * product.pricing?.basePrice!) + product.pricing?.basePrice!
    // }

    

    
}

//This function sends event data to meta-capi api 
export const sendMetaCapi = async (eventData: IMetaWebEvent, userId: string, OS: ClientOS, Device: ClientDevice) => {
    try {
        const res = await axios.post(`${backend}/meta-capi`, eventData, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log("Meta Response: ", res.data)
    } catch (error) {
        console.log("Error Meta CAPI: ", error)
    }
    
    try {
        //Sending data to my excel sheet
        const data = eventData.data[0]
        const info: IEventResearch = {
            ID: userId,
            EventName: data.event_name,
            Data: JSON.stringify(data),
            Date: getCurrentDate(),
            Time: getCurrentTime(),
            OS: OS,
            Device: Device
        }
        await storeEventInfo(info) 
    } catch (error) {
        console.log("Error Excel Event Store: ", error)
    }
}

//This function keeps track of what product is added/deleted to cart
export const storeWishInfo = async (_action: string, clientInfo: IClientInfo, product: IProduct) => {
    if (clientInfo) {
        try {
            //Arranging the query research info
            const wishListInfo: IWishlistResearch = {
                ID: clientInfo._id!,
                IP: clientInfo?.ipData?.ip!,
                City: clientInfo?.ipData?.city!,
                Region: clientInfo?.ipData?.region!,
                Country: clientInfo?.ipData?.country!,
                Product_Name: product.name!,
                Action: _action,
                Date: getCurrentDate(),
                Time: getCurrentTime(),
                OS: getOS(),
                Device: getDevice()
            }

            const sheetInfo: ISheetInfo = {
                sheetId: statSheetId,
                sheetRange: "Wishlist!A:K",
                data: wishListInfo
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
}

//This function is used to extract JSON data from a markdown string
export const extractJsonFromMarkdown = (markdownString: string): any => {
    // Use a regular expression to extract the JSON content
    const jsonMatch = markdownString.match(/```json\s*([\s\S]*?)\s*```/);

    if (!jsonMatch || !jsonMatch[1]) {
        throw new Error('No valid JSON found in the Markdown string');
    }

    // Parse the extracted JSON string into an object
    const parsedJson = JSON.parse(jsonMatch[1])
    return parsedJson;
}

//This function keeps track of what product is added/deleted to cart
export const storeCartInfo = async (_action: string, clientInfo: IClientInfo, productName: string) => {
    if (clientInfo) {
        try {
            //Arranging the query research info
            const cartInfo: IWishlistResearch = {
                ID: clientInfo._id!,
                IP: clientInfo?.ipData?.ip!,
                City: clientInfo?.ipData?.city!,
                Region: clientInfo?.ipData?.region!,
                Country: clientInfo?.ipData?.country!,
                Product_Name: productName,
                Action: _action,
                Date: getCurrentDate(),
                Time: getCurrentTime(),
                OS: getOS(),
                Device: getDevice()
            }

            const sheetInfo: ISheetInfo = {
                sheetId: statSheetId,
                sheetRange: "Cart!A:K",
                data: cartInfo
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
}

//This function is used to hash a value
export function hashValue(value: string, algorithm: 'sha256' | 'sha512' | 'md5' = 'sha256'): string {
    if (!value || typeof value !== 'string') {
        console.log("Non hashable value")
        return value;
    }

    return createHash(algorithm).update(value, 'utf8').digest('hex');
}

//Convert the file to a buffer and then to a stream
// export const convertFileToBuffer = async (file: File): Promise<Buffer> => {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//             resolve(Buffer.from(reader.result as ArrayBuffer));
//         };
//         reader.onerror = reject;
//         reader.readAsArrayBuffer(file);
//     });
// }

/**
 * Converts an array of strings to a single comma-separated string.
 * @param arr - The array of strings to convert.
 * @returns A comma-separated string.
 */
export const arrayToString = (arr: string[]): string => {
    if (arr) {
        return arr.join('. ');
    } else {
        return arr
    }
    
}

/**
 * Converts a comma-separated string to an array of strings.
 * @param str - The string to convert.
 * @returns An array of strings.
 */
export const stringToArray = (str: string): string[] => {
    return str.split('. ').map(item => item.trim());
}

//This converts size percent to array
export const sizePercentToArray = (input: string): Array<{ size: string, percent: number }> => {
    return input.split('. ').map(pair => {
        const [size, percent] = pair.split(', ').map(item => item.trim());
        return { size, percent: percent !== undefined ? parseFloat(percent) : 0 };
    });
}

//This converts size percent to array
export const stringNumToArray = (input: string): Array<{ country: string, amount: number }> => {
    return input.split('. ').map(pair => {
        const [country, amount] = pair.split(', ').map(item => item.trim());
        return { country, amount: amount !== undefined ? parseFloat(amount) : 0 };
    });
} 

//This converts size percent to string
export const sizePercentToString = (input: Array<{ size: string, percent: number } | string>): string => {
    return input.map(item => {
        if (typeof item === 'string') {
            return `${item}, 0`; // Default percent to 0 for string inputs
        } else {
            return `${item.size}, ${item.percent}`;
        }
    }).join('. ');
}

//This converts size percent to array
export const stringNumToString = (input: Array<{ country?: string, amount?: number }>): string => {
    return input.map(item => {
        if (typeof item === 'string') {
            return `${item}, 0`; // Default percent to 0 for string inputs
        } else {
            return `${item.country}, ${item.amount}`;
        }
    }).join('. ');
} 

//This function gets random ratings from [4.7, 4.8, 4.9]
export const getRating = () => {
    const numbers = [4.7, 4.8, 4.9];
    const randomIndex = Math.floor(Math.random() * numbers.length);
    return numbers[randomIndex];
}

//This function gets a random item e.g ["a", "b", "c"] => "a"
export const getRandomItem = <T>(items: Array<T>): T => {
    if (items.length === 0) {
        throw new Error("Array is empty");
    }
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

//This function keeps track of clicked buttons
export const storeButtonInfo = async (info: IButtonResearch) => {
    try {
        const sheetInfo: ISheetInfo = {
            sheetId: statSheetId,
            sheetRange: "Button!A:M",
            data: info
        }

        const res = await fetch(`${backend}/sheet`, {
            method: "POST",
            body: JSON.stringify(sheetInfo),
        });
        //console.log("Google Stream: ", res)
    } catch (error) {
        console.log("Store Error: ", error)
    }
}

//This function keeps track of events
export const storeEventInfo = async (info: IEventResearch) => {
    console.log("Event Info: ", info)

    try {
        const sheetInfo: ISheetInfo = {
            sheetId: statSheetId,
            sheetRange: "Events!A:G",
            data: info
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

//This function helps fetch orders based on user id
export const getUserOrders = async (userId: string) => {
    if (!userId) {
        return
    }

    try {
      const res = await fetch(`${backend}/order?userId=${userId}`, {
        method: "GET",
        cache: "no-store",
      })
  
      if (res.ok) {
        return await res.json()
      } else {
        getUserOrders(userId)
      }
    } catch (error) {
        console.error(error);
    }
}

//This function calculates each cart item's discount information
export const getEachCartItemDiscount = (cart: ICart, cartId: number) => {
    const cartItem = cart.cart[cartId]
    const weightPercent = cartItem.subTotalWeight / cart.totalWeight // => 0.1 for 10% 
    const cartDiscountPrice = weightPercent * cart.totalDiscount //discount
    const newCartSubTotalPrice = cartItem.subTotalPrice - cartDiscountPrice
    const newDiscountPercent = (cartDiscountPrice / cartItem.subTotalPrice) * 100 // => 10 for 10% 
    const itemDiscount: ICartItemDiscount = {
        img: cartItem.image,
        oldPrice: cartItem.subTotalPrice,
        discountedPrice: cartDiscountPrice,
        newPrice: newCartSubTotalPrice,
        newXtraDiscount: newDiscountPercent
    }
    return itemDiscount
}

//This function downloads the image using the src url
export const downloadImageURL = async (url: string): Promise<string> => {
    //const domainName = process.env.NEXT_PUBLIC_DOMAIN_NAME

    return new Promise((resolve, reject) => {
        // Generate filename from URL or timestamp
        const urlObj = new URL(url);
        let filename = path.basename(urlObj.pathname);
        if (!filename || !path.extname(filename)) {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            filename = `image_${timestamp}_${random}.jpg`;
        }

        https.get(url, (response: IncomingMessage) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }

            let filePath: string
            if (domainName?.includes("http://localhost")) {
                filePath = path.resolve(__dirname, filename);
            } else {
                filePath = path.join("/tmp", filename); // Use /tmp for temporary storage in production
            }
            
            const fileStream = fs.createWriteStream(filePath);
            
            response.pipe(fileStream);
            
            fileStream.on('finish', () => {
                fileStream.close();
                resolve(filePath);
            });
            
            fileStream.on('error', (error) => {
                fs.unlink(filePath, () => {});
                reject(error);
            });
            
        }).on('error', (error: NodeJS.ErrnoException) => {
            reject(error);
        });
    });
}

export const categories: Array<ICategoryInfo> = [
    {
        macro: "Health & Personal Care",
        minis: [
            {
                mini: "Medical Supplies & Accessories",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1r0603-JC2w1l8dGz8vCwOFzM5xJ4lY_K",
                    width: 816,
                    height: 1224
                },
                micros: [
                    {
                        micro: "Healthcare Devices & Equipments",
                        nanos: [
                            "Monitoring Devices",
                            "Laboratory Equipments",
                            "Imaging Devices",
                            "First Aid Kits",
                            "Surgical Instruments",
                            "Point of Care Devices",
                            "Respiratory & Cardiovascular Devices",
                            "Others"
                        ]
                    },
                    {
                        micro: "Mobility Aids",
                        nanos: [
                            "Canes & Walking Sticks",
                            "Walkers & Rollators",
                            "Wheelchairs",
                            "Mobility Scooters",
                            "Crutches",
                            "Others",
                        ]
                    },
                    {
                        micro: "Accessories & Others",
                        nanos: [
                            "Braces & Supports",
                            "Massagers",
                            "Personal Protective Equipment",
                            "Hygiene and Sanitization",
                            "Others"
                        ]
                    },
                ]
            },
            {
                mini: "Sports & Outdoors",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1yUxV7sxKy1YT9MVj3HWCK_D_UxhT4-zD",
                    width: 1224,
                    height: 852
                },
                micros: [
                    {
                        micro: "Sports Equipments & Accessories",
                        nanos: [
                            "Strength Training Equipments",
                            "Cardio Equipments",
                            "Boxing & Martial Arts",
                            "Accessories & Others"
                        ]
                    },
                    {
                        micro: "Sports Nutrition",
                        nanos: [
                            "Protein Supplements",
                            "Hydration",
                            "Others"
                        ]
                    },
                    {
                        micro: "Outdoor Recreation",
                        nanos: [
                            "Camping & Hiking",
                            "Fishing",
                            "Hunting",
                            "Climbing",
                            "Accessories & Others"
                        ]
                    }
                ]
            },
            {
                mini: "Medicines & Supplements",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1xA-dXOkufSpoBOKqiyvZ-H9G5bLNGjGO",
                    width: 1224,
                    height: 816
                },
                micros: [
                    {
                        micro: "Medicines",
                        nanos: [
                            "Prescription Medicines",
                            "Over The Counter Medicines",
                            "Others"
                        ]
                    },
                    {
                        micro: "Supplements",
                        nanos: [
                            "Dietary Supplements",
                            "Herbal Supplements",
                            "Others"
                        ]
                    }
                ]
            },
            {
                mini: "Personal Care & Hygiene",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1QfOWPAigKDg18MPWgu6Jy8bO5qoyLuU8",
                    width: 1224,
                    height: 796
                },
                micros: [
                    {
                        micro: "Body Hygiene",
                        nanos: [
                            "Oral Care",
                            "Body Care",
                            'Others'
                        ]
                    },
                    {
                        micro: "Sexual Health",
                        nanos: [
                            "Condoms & Contraceptives",
                            "Sex Toys",
                            "Sanitary Pads & Tampons",
                            "Others"
                        ]
                    }
                ]
            }
        ]
    },
    {
        macro: "Beauty & Fashion",
        minis: [
            {
                mini: "Cosmetics & Lotions",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1j1BL0CBYsfZTtK8iDTODxa673Hk42lQV",
                    width: 1224,
                    height: 816
                },
                micros: [
                    {
                        micro: "Bath & Body",
                        nanos: [
                            "Body Wash, Shower Gels & Soaps",
                            "Moisturizer & Lotions",
                            "Scrubs & Exfoliants",
                            "Hair Creams & Accessories",
                            "Accessories & Others"
                        ]
                    },
                    {
                        micro: "Face Care",
                        nanos: [
                            "Face Scrubs & Wash",
                            "Face Mask & Peels",
                            "Facial Mosturizers & Serums",
                            "Eye Creams",
                            "Lip Balms & Treatments",
                            "Others"
                        ]
                    },
                    {
                        micro: "Makeup",
                        nanos: [
                            "Face Makeup",
                            "Eye Makeup",
                            "Lip Makeup",
                            "Nail Makeup",
                            "Costume Makeup",
                            "Makeup Accessories"
                        ]
                    }
                ]
            },
            {
                mini: "Fragances",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1pOu1Cyzv928urlC-zdIon6jYNDb5YUwY",
                    width: 626,
                    height: 626
                },
                micros: [
                    {
                        micro: "Perfumes",
                        nanos: [
                            "Parfum",
                            "Eau de Parfum",
                            "Eau de Toilette",
                            "Eau de Cologne",
                            "Eau Fraiche"
                        ]
                    },
                    {
                        micro: "Body Sprays & Mists",
                        nanos: [
                            "Fragrance Mists",
                            "Aromatherapy Sprays",
                            "Shimmer & Glitter Mists"
                        ]
                    },
                    {
                        micro: "Scented Oils & Roll-Ons",
                        nanos: [
                            "Perfume Oils",
                            "Roll-On Fragrances",
                            "Aromatherapy Oils"
                        ]
                    }
                ]
            },
            {
                mini: "Clothes",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1v9bLHpMNp_UAF6YsuFqzRhiMkqrS8caG",
                    width: 1054,
                    height: 1224
                },
                micros: [
                    {
                        micro: "Men's Clothing",
                        nanos: [
                            "Tops",
                            "Bottoms",
                            "Suits",
                            "Outerwears",
                            "Traditional Wears",
                            "Underwears",
                            "Sleepwears",
                            "Others"
                        ]
                    },
                    {
                        micro: "Women's Clothing",
                        nanos: [
                            "Tops",
                            "Bottoms",
                            "Dresses",
                            "Traditional Wears",
                            "Outerwears",
                            "Underwears",
                            "Sleepwears",
                            "Others"
                        ]
                    },
                    {
                        micro: "Unisex Clothing",
                        nanos: [
                            "Tops",
                            "Bottoms",
                            "Sleepwears",
                            "Others"
                        ]
                    }
                ]
            },
            {
                mini: "Footwears",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1pF7VoPC-9jhO7NRxFn8UTBwZbccc4r2K",
                    width: 1224,
                    height: 816
                },
                micros: [
                    {
                        micro: "Men's Footwears",
                        nanos: [
                            "Sneakers",
                            "Dress Shoes",
                            "Boots",
                            "Loafers",
                            "Sandals",
                            "Slippers",
                            "Others"
                        ]
                    },
                    {
                        micro: "Women's Footwears",
                        nanos: [
                            "Flats",
                            "Heels",
                            "Sandals",
                            "Sneakers",
                            "Boots",
                            "Slippers",
                            "Others"
                        ]
                    },
                    {
                        micro: "Accessories & Others",
                        nanos: [
                            "Shoe Care",
                            "Insoles & Inserts",
                            'Laces',
                            "Others"
                        ]
                    }
                ]
            },
            {
                mini: "Jewelries & Cloth Accessories",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1qtMCbPrYl06-O-AiIjDMZlF9cOd7wVms",
                    width: 1164,
                    height: 1224
                },
                micros: [
                    {
                        micro: "Jewelries",
                        nanos: [
                            "Necklaces",
                            'Watches',
                            'Earrings',
                            "Bracelets",
                            "Rings",
                            "Anklets",
                            "Brooches & Pins",
                            "Others"
                        ]
                    },
                    {
                        micro: "Eyewears & Frames",
                        nanos: [
                            "Eyeglasses",
                            "Frames",
                            "Lens",
                            "Others"
                        ]
                    },
                    {
                        micro: "Accessories & Others",
                        nanos: [
                            "Hats",
                            "Belts",
                            "Scarves",
                            "Gloves",
                            "Bath",
                            "Handbags",
                            "Ties & Bow Ties",
                            "Socks & Hoisery",
                            "Wallets",
                            "Others"
                        ]
                    },
                ]
            }
        ]
    },
    {
        macro: "Home, Office & Construction",
        minis: [
            {
                mini: "Home, Office & Appliances",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1XzRV8cb-FUkq4zaxAwREBdw5d3CkuJ0u",
                    width: 1100,
                    height: 1224
                },
                micros: [
                    {
                        micro: "Home Appliances",
                        nanos: [
                            "Generic Room Appliances",
                            "Smart Home Devices",
                            "Vacuum Cleaners & Floor Care",
                            "Spare Parts & Accessories",
                            "Household Essentials",
                            "Others"
                        ]
                    },
                    {
                        micro: "Furnitures & Accessories",
                        nanos: [
                            "Living Room Furnitures",
                            "Bedroom Furnitures",
                            "Dining Room Furnitures",
                            "Bathroom Furnitures",
                            "Office Furnitures",
                            "Lighting",
                            "Others"
                        ]
                    },
                    {
                        micro: "Kitchen Wares & Appliances",
                        nanos: [
                            "Kitchen Appliances",
                            "Cook & Bake Wares",
                            "Dining Wares",
                            "Spare Parts & Accessories",
                            "Kitchen Tools & Gadgets",
                            "Others"
                        ]
                    },
                    {
                        micro: "Garden & Outdoors",
                        nanos: [
                            "Garden Furnitures",
                            "Grills & Outdoor Cooking",
                            "Lawn & Garden Care",
                            "Pools & Tubs",
                            "Others"
                        ]
                    }
                ]
            },
            {
                mini: "Building Hardware & Decors",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1p7RSwDIQzSEGCbA1933pCoShZm1t2f_O",
                    width: 1224,
                    height: 816
                },
                micros: [
                    {
                        micro: "Hardwares & Materials",
                        nanos: [
                            "Roofings & Ceilings Materials",
                            "Flooring & Tiles",
                            "Doors & Windows",
                            "Plumbing & Pipes",
                            "Electricals & Wiring",
                            "Others"
                        ]
                    },
                    {
                        micro: "Decors & Arts",
                        nanos: [
                            "Paints & Accessories",
                            "Wallpapers",
                            "Ornaments",
                            "Vases",
                            "Flowers",
                            "Others"
                        ]
                    }
                ]
            }
        ]
    },
    {
        macro: "Phones, Computers & Electonics",
        minis: [
            {
                mini: "Phones, Tablets & Accessories",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1Kaf1P7SSA_YOJxHBKLzlNjqbJnc4wxyt",
                    width: 640,
                    height: 640
                },
                micros: [
                    {
                        micro: "Phones",
                        nanos: [
                            "Basic",
                            "Smartphones",
                            "Landlines",
                            "Spare Parts",
                            "Others"
                        ]
                    },
                    {
                        micro: "Tablets",
                        nanos: [
                            "Androids",
                            "iPads",
                            "Windows",
                            "E-Readers",
                            "Spare Parts",
                            "Others"
                        ]
                    },
                    {
                        micro: "Wearables & Accessories",
                        nanos: [
                            "Wearables",
                            "Accessories"
                        ]
                    }
                ]
            },
            {
                mini: "Computers & Accessories",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=11_O3sYu15fZWuZDYHYY1MGfxT_UEOdvQ",
                    width: 800,
                    height: 620
                },
                micros: [
                    {
                        micro: "Laptops",
                        nanos: [
                            "Chromebooks",
                            "Macbooks",
                            "Generic Purpose Laptops",
                            "Ultrabooks",
                            "Gaming Laptops",
                            "Spare Parts",
                            "Convertible (2-in-1) Laptops",
                            "Others"
                        ]
                    },
                    {
                        micro: "Desktops",
                        nanos: [
                            "Gaming Desktops",
                            "Generic Purpose PC",
                            "Workstations",
                            "Desktop Servers",
                            "Spare Parts",
                            "Others"
                        ]
                    },
                    {
                        micro: "Supercomputers & Others",
                        nanos: [
                            "Supercomputers",
                            "Mainframes",
                            "Quantum Computers",
                            "Spare Parts",
                            "Others"
                        ]
                    },
                    {
                        micro: "Accessories & Others",
                        nanos: [
                            "Softwares",
                            "Peripheral Devices",
                            "Routers & Switches",
                            "Processors & Storages",
                            "Cables & Adapters",
                            "Others"
                        ]
                    }
                ]
            },
            {
                mini: "Electronics & Gadgets",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1DMHNu7vBHWcVdKzn7SYN7NhTu-SU-sdi",
                    width: 1886,
                    height: 1886
                },
                micros: [
                    {
                        micro: "Gaming",
                        nanos: [
                            "Gaming Consoles",
                            "Accessories & Others"
                        ]
                    },
                    {
                        micro: "Audio & Musical Instruments",
                        nanos: [
                            "Speakers",
                            "Recording Instruments",
                            "Others"
                        ]
                    },
                    {
                        micro: "Photo & Video Instruments",
                        nanos: [
                            "Photo Cameras",
                            "Video Cameras",
                            "Others"
                        ]
                    },
                    {
                        micro: "Gadgets & Others",
                        nanos: [
                            "Drones",
                            "Robots & Smart Devices",
                            "Others"
                        ]
                    }
                ]
            }
        ]
    },
    {
        macro: "Education & Arts",
        minis: [
            {
                mini: "Arts & Board Games",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1eHPcHup1rHFflrJsaIo8ueBeFP5Kmml5",
                    width: 894,
                    height: 680
                },
                micros: [
                    {
                        micro: "Arts & Crafts",
                        nanos: [
                            "Paintings",
                            "Sketches",
                            "Sculptures",
                            "Art Accessories",
                            "Theatre Arts"
                        ]
                    },
                    {
                        micro: "Board Games & Puzzles",
                        nanos: [
                            "Board Games",
                            "Puzzles",
                            "Role Playing Games",
                            "Others"
                        ]
                    },
                ]
            },
            {
                mini: "Books & School Supplies",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1pSKlKXTLxvjO-JmklVEexJwyxNIRJy8E",
                    width: 800,
                    height: 800
                },
                micros: [
                    {
                        micro: "Books & Educational Materials",
                        nanos: [
                            "Textbooks & Workbooks",
                            "Fiction Books",
                            "Non-Fiction Books",
                            "Graphic Novels & Comics",
                            "Others"
                        ]
                    },
                    {
                        micro: "School Supplies",
                        nanos: [
                            "Stationeries",
                            "School Furnitures",
                            "Accessories & Others"
                        ]
                    }
                ]
            }
        ]
    },
    {
        macro: "Baby, Kids & Toys",
        minis: [
            {
                mini: "Baby Essentials & Toys",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1sErZTeV0-CTl_30KGu3G34zGOX1V-agy",
                    width: 2000,
                    height: 2000
                },
                micros: [
                    {
                        micro: "Baby Essentials & Gears",
                        nanos: [
                            "Diapers & Wipers",
                            "Strollers & Carriers",
                            'Nutrition & Feeding',
                            "Baby Proofing & Monitors",
                            "Baby Furnitures",
                            "Accessories & Others"
                        ]
                    },
                    {
                        micro: "Toys & Games",
                        nanos: [
                            "Building & Educational Toys",
                            "Dolls & Action Figures",
                            "Board Games & Puzzles",
                            "Outdoor Toys",
                            "Electronic Toys",
                            'Others'
                        ]
                    },
                ]
            },
            {
                mini: "Baby & Kids Clothings",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1jkXlsY64Qvmxp1Ow5TT_TwLZjdXVt0P5",
                    width: 768,
                    height: 768
                },
                micros: [
                    {
                        micro: "Baby Clothings & Accessories",
                        nanos: [
                            "Sleepwears",
                            "Outerwears",
                            "Onesies & Bodysuits",
                            "Shoes",
                            'Others'
                        ]
                    },
                    {
                        micro: "Kids Clothings & Accessories",
                        nanos: [
                            "Tops & T-Shirts",
                            "Dresses & Skirts",
                            "Pants & Trousers",
                            "Shoes",
                            'Others'
                        ]
                    }
                ]
            }
        ]
    },
    {
        macro: "Vehicles",
        minis: [
            {
                mini: "Bicycles, Motorcycles & Parts",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=15GmVwAgHuqCLg5ASROxBVHnpKeA3Tmu3",
                    width: 800,
                    height: 400
                },
                micros: [
                   {
                        micro: "Bicycles",
                        nanos: [
                            "Mountain Bicycles",
                            "BMX Bicycles",
                            "Road Bicyles",
                            "Electric Bicycles",
                            "Specialty Bicycles",
                            "Spare Parts & Accessories",
                            "Others"
                        ]
                   },
                   {
                        micro: "Motorcycles & Scooters",
                        nanos: [
                            "Motorcycles",
                            "Scooters",
                            "All-Terain Vehicles",
                            "Utility-Tasks Vehicles",
                            "Spare Parts & Accessories",
                            "Others"
                        ]
                   }
                ]
            },
            {
                mini: "Automobiles & Parts",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1SQTVZ0hS2eatxzlUtadhwVcwgkkxX4g4",
                    width: 1330,
                    height: 570
                },
                micros: [
                    {
                        micro: "Cars",
                        nanos: [
                            "Sedans",
                            "Hatchbacks",
                            "SUVs",
                            "Coupes",
                            "Spare Parts & Accessories",
                            "Others"
                        ]
                   },
                   {
                        micro: "Trucks",
                        nanos: [
                            "Pickup Trucks",
                            "Commercial Trucks",
                            "Box Trucks",
                            "Tow Trucks",
                            "Dump Trucks",
                            "Spare Parts & Accessories",
                            "Others"
                        ]
                    },
                    {
                        micro: "Buses",
                        nanos: [
                            "Mini Buses",
                            "City Buses",
                            "Tour Buses",
                            "Spare Parts & Accessories",
                            "Others"
                        ]
                    },
                    {
                        micro: "Vans",
                        nanos: [
                            "Mini Vans",
                            "Cargo Vans",
                            "Passenger Vans",
                            "Camper Vans",
                            "Spare Parts & Accessories",
                            "Others"
                        ]
                    },
                    // {
                    //     micro: "Specialty Vehicles & Others",
                    //     nanos: [
                    //         "Emergency Vehicles",
                    //         "Agricultural Vehicles",
                    //         "Construction Vehicles",
                    //         "Golf Carts",
                    //         // "Militar",
                    //         "Spare Parts & Accessories",
                    //         "Others"
                    //     ]
                    // },
                ]
            },
            {
                mini: "Watercrafts & Parts",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1gvniWE-DnnY9lZ6NFYwM5hzrQB5acPt5",
                    width: 612,
                    height: 350
                },
                micros: [
                    {
                        micro: "Jet Skis, Canoes & Boats",
                        nanos: [
                            "Jet Skis",
                            "Kayaks",
                            'Canoes',
                            "Boats",
                            "Spare Parts & Accessories",
                            "Others"
                        ]
                    },
                    {
                        micro: "Yatchs & Catamarans",
                        nanos: [
                            "Yatchs",
                            "Catamarans",
                            "Trimarans",
                            "Spare Parts & Accessories",
                            "Others"
                        ]
                    },
                    {
                        micro: "Ferries, Ships & Commercial",
                        nanos: [
                            "Ferries",
                            "Ships",
                            "Workboats",
                            "Fishing Vessels",
                            "Spare Parts & Accessories",
                            'Others'
                        ]
                    }
                ]
            },
            {
                mini: "Aircrafts & Parts",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1fd1DW1vaKldArACrZOlG6ZKV5Z9LbLJr",
                    width: 681,
                    height: 360
                },
                micros: [
                    {
                        micro: "Light Aircrafts & Helicopters",
                        nanos: [
                            "Powered Parachutes",
                            "Gliders",
                            "Light Aircrafts",
                            "Helicopters",
                            "Spare Parts & Accessories",
                            "Others"
                        ]
                    },
                    {
                        micro: "Jets & Planes",
                        nanos: [
                            "Jets",
                            "Planes",
                            "Spare Parts & Accessories",
                            "Others"
                        ]
                    }
                ]
            },
        ]
    },
    {
        macro: "Groceries & Food",
        minis: [
            {
                mini: "Food & Spices",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1ilA4kZXNNXe4Oxd0oKVuN4rXjHQ3fIED",
                    width: 612,
                    height: 406
                },
                micros: [
                    {
                        micro: "Fruits & Vegetables",
                        nanos: [
                            "Fruits",
                            "Vegetables",
                            "Herbs & Spices",
                            "Others"
                        ]
                    },
                    {
                        micro: "Sauces, Oils & Canned Foods",
                        nanos: [
                            "Canned Goods",
                            "Oils",
                            "Sauces",
                            "Others"
                        ]
                    },
                    {
                        micro: "Cereals & Grains",
                        nanos: [
                            "Cereals",
                            "Pasta & Noodles",
                            "Grains",
                            "Others"
                        ]
                    }
                ]
            },
            {
                mini: "Drinks & Smoke",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1VXJuwXj9T7FAZpZpr54Ap086mIwuMB33",
                    width: 720,
                    height: 1440
                },
                micros: [
                    {
                        micro: "Drinks",
                        nanos: [
                            "Alcoholic Drinks",
                            "Dairies",
                            "Juice",
                            "Soft Drinks",
                            "Others"
                        ]
                    },
                    {
                        micro: "Smoke & Accessories",
                        nanos: [
                            "Tobacco",
                            "Cannabis",
                            "Accessories & Others"
                        ]
                    },
                ]
            }
        ]
    },
    {
        macro: "Industrial, Commercial & Energy",
        minis: [
            {
                mini: "Energy",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1ptninjVaRJTgl0T1EecSv0T9nbcKWJK4",
                    width: 612,
                    height: 459
                },
                micros: [
                    {
                        micro: "Non-Renewable Energy",
                        nanos: [
                            "Generators",
                            "Spare Parts & Accessories",
                            "Others"
                        ]
                    },
                    {
                        micro: "Renewable Energy",
                        nanos: [
                            "Solar Panels",
                            "Inverters",
                            "Batteries",
                            "Spare Parts & Accessories",
                            "Others"
                        ]
                    },
                ]
            },
            {
                mini: "Raw Materials",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=1HP0kIzDMqdq2c1kJ9go6cpbVQJQDNpfK",
                    width: 600,
                    height: 398
                },
                micros: [
                    {
                        micro: "Fabric & Textiles",
                        nanos: [
                            "Wool",
                            "Cotten",
                            "Linen",
                            "Silk",
                            "Denim",
                            "Leather",
                            "Synthetics",
                            "Others"
                        ]
                    },
                    {
                        micro: "Agriculture",
                        nanos: [
                            "Seads",
                            "Oil",
                            "Others"
                        ]
                    },
                    {
                        micro: "Metals & Alloys",
                        nanos: [
                            "Pure Metals",
                            "Alloys",
                            "Others"
                        ]
                    },
                    {
                        micro: "Chemicals, Rubbers & Plastics",
                        nanos: [
                            "Chemicals",
                            "Rubbers",
                            "Plastics"
                        ]
                    },
                ]
            },
            {
                mini: "Commercial & Tools",
                image: {
                    src: "https://drive.google.com/uc?export=download&id=15vPyFOUyMg5eBIofXMEYKVbxRkrTLX84",
                    width: 612,
                    height: 377
                },
                micros: [
                    {
                        micro: "Commercial Machines & Materials",
                        nanos: [
                            "Catering & Kitchen",
                            "Packaging & Printing",
                            "Manufacturing & Construction",
                            "Others"
                        ]
                    },
                    {
                        micro: "Tools & Equipments",
                        nanos: [
                            "Safety & Security",
                            "Testing & Measuring",
                            "Nails, Screws & Fasteners",
                            "Adhesives & Sealants",
                            "Hinges & Brackets",
                            "Material Handling",
                            "Others"
                        ]
                    },
                ]
            }
        ]
    }
]

///This contains a list of colors for delivery status text
// export const deliveryStatuses: Array<IEventStatus> = [
//     {
//         status: "Pending",
//         color: "orange"
//     },
//     {
//         status: "In Transit",
//         color: "yellow"
//     },
//     {
//         status: "Exception",
//         color: "red"
//     },
//     {
//         status: "Delivered",
//         color: "green"
//     },
//     {
//         status: "Returned",
//         color: "red"
//     },
//     {
//         status: "Cancelled",
//         color: "red"
//     }
// ]

///This contains a list of colors for delivery status text
export const deliveryStatuses: Array<IEventStatus> = [
    {
        status: DeliveryStatus.PENDING,
        color: {
            text: styles.pendingColor1,
            background: styles.pendingColor2
        }
    },
    {
        status: DeliveryStatus.IN_TRANSIT,
        color: {
            text: styles.pendingColor1,
            background: styles.pendingColor2
        }
    },
    {
        status: DeliveryStatus.DELIVERED,
        color: {
            text: styles.successColor1,
            background: styles.successColor2
        }
    },
    {
        status: DeliveryStatus.CANCELLED,
        color: {
            text: styles.cancelColor1,
            background: styles.cancelColor2
        }
    },
    {
        status: DeliveryStatus.RETURNED,
        color: {
            text: styles.cancelColor1,
            background: styles.cancelColor2
        }
    },
    {
        status: DeliveryStatus.EXCEPTION,
        color: {
            text: styles.cancelColor1,
            background: styles.cancelColor2
        }
    }
]

///This contains a list of colors for delivery status text
export const paymentStatuses: Array<IEventStatus> = [
    {
        status: PaymentStatus.PENDING,
        color: {
            text: styles.pendingColor1,
            background: styles.pendingColor2
        }
    },
    {
        status: PaymentStatus.SUCCESS,
        color: {
            text: styles.successColor1,
            background: styles.successColor2
        }
    },
    {
        status: PaymentStatus.FAILED,
        color: {
            text: styles.cancelColor1,
            background: styles.cancelColor2
        }
    },
    {
        status: PaymentStatus.REFUND,
        color: {
            text: styles.cancelColor1,
            background: styles.cancelColor2
        }
    }
]

//This function converts data for sheets
export const convertDataToSheet = (data: { [key: string]: any }) => {
    const convertedData: [string, string][] = Object.entries(data).map(([key, value]) => [key, value]);
    return convertedData
}

// Updated products:  {
//     '$__': InternalCache {
//       activePaths: ctor { paths: [Object], states: [Object] },
//       skipId: true
//     },
//     '$isNew': false,
//     _doc: {
//       category: {
//         macro: 'Beauty & Fashion',
//         mini: 'Clothes',
//         micro: 'Unisex Clothing',
//         nano: 'Others'
//       },
//       pricing: {
//         extraDiscount: [Object],
//         basePrice: 6.8,
//         discount: 38,
//         inStock: true,
//         variantPrices: []
//       },
//       specification: {
//         dimension: {},
//         brand: 'Others',
//         itemCount: 1,
//         itemForm: 'Polyvinyl Chloride (PVC)',
//         userAgeRange: 'Above 10 years old',
//         gender: 'Unisex',
//         ingredients: [Array],
//         productOrigin: 'China',
//         prescription: [Array],
//         benefits: [Array],
//         colors: [Array],
//         sizes: [Array],
//         weight: 1
//       },
//       _id: new ObjectId('66866e38e8f02e72be95ee5a'),
//       subCategory: 'Accessories',
//       name: 'PVC Rain Coat',
//       images: [ [Object], [Object], [Object] ],
//       videos: [],
//       price: 6.8,
//       extraDiscount: true,
//       discount: 38,
//       rating: 4.9,
//       freeOption: false,
//       orders: 0,
//       description: 'PVC Rain Coat is a durable and waterproof outer garment designed to keep you dry in wet weather conditions. Made from high-quality PVC material, this rain coat is lightweight, flexible and perfect for outdoor activities, commuting or simply running errands on rainy days.',
//       createdAt: 2024-07-04T09:41:12.356Z,
//       updatedAt: 2024-08-24T15:54:38.153Z,
//       __v: 0,
//       colors: [ 'yellow', 'green', 'blue' ],
//       sizes: [ 'L', 'XL', 'XXL', 'XXXL' ],
//       active: true
//     },
//     orders: 3
//   }