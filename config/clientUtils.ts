"use client"
///This contains utility functions that are strictly for client based components

///Libraries -->
import { toast } from 'react-toastify';
import { MouseEvent } from 'react';

///Commencing the code
//console.log("Domain: ", domainName)

///This function triggers a notification when called
export const notify = (type: string, message: string): void => {
    switch (type) {
        case "info":
            toast.info(message, {
                position: toast.POSITION.TOP_CENTER,
                style: { backgroundColor: 'white', color: '#1170FF' },
            });
            break
        case "error":
            toast.error(message, {
                position: toast.POSITION.TOP_CENTER,
                style: { backgroundColor: 'white', color: '#1170FF' },
            });
            break
        case "success":
            toast.success(message, {
                position: toast.POSITION.TOP_CENTER,
                style: { backgroundColor: 'white', color: '#1170FF' },
            }); 
            break
        case "warn":
            toast.warn(message, {
                position: toast.POSITION.TOP_CENTER,
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
export const visitSocialLink = (e:  MouseEvent<SVGSVGElement, globalThis.MouseEvent> | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, social: string) => {
    e.preventDefault()

    if (window) {
        if (social === "instagram") {
            window.open("https://www.instagram.com/official.idealplug", '_blank');
        } else if (social === "facebook") {
            window.open("https://web.facebook.com/profile.php?id=61559971113003", "_blank")
        } else if (social === "twitter") {
            window.open("https://twitter.com/favoursyre", "_blank")
        } else if (social === "linkedin") {
            window.open("https://www.linkedin.com/in/favour-ndubuisi-7b019786/", "_blank")
        } else if (social === "github") {
            window.open("https://github.com/favoursyre", "_blank")
        } else if (social === "whatsapp") {
            window.open("https://api.whatsapp.com/send?phone=14244282169", "_blank")
        } else {
            undefined
        }
    } else {
        undefined
    }
}