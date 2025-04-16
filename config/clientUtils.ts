"use client"
///This contains utility functions that are strictly for client based components

///Libraries -->
import { toast } from 'react-toastify';
import { MouseEvent } from 'react';
import { companyEmail, getCurrentDate, getCurrentTime, storeButtonInfo, extractBaseTitle } from './utils';
import { ClientDevice, ClientOS, DeliveryStatus, IClientInfo, IEventStatus, PaymentStatus, IButtonResearch, ICacheData } from './interfaces';
import { analytics } from 'googleapis/build/src/apis/analytics';

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
    await storeButtonInfo(info)

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
            window.open("https://api.whatsapp.com/send?phone=14244282169", "_blank")
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
