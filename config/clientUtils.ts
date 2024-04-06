"use client"
///This contains utility functions that are strictly for client based components

///Libraries -->
import { toast } from 'react-toastify';

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