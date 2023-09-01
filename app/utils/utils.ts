//"use client"
///This contains all the utilities

///Libraries --> 
import React from 'react';
import { ICountry, IClientInfo } from './interfaces';

///Commencing the code

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

export const getModalState = (): boolean | any => {
    return getItem("modalState")
} 

//Cart name
export const cartName: string = "DrRitanyCart"

//Order name
export const orderName: string = "DrRitanyOrder"
  
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
        case "/terms":
            return styles.termsPage
        case "/order":
            return styles.orderPage
        case "/about":
            return styles.aboutPage
        case "/products/search":
            return styles.searchPage
        default:
            if (router.includes("/products/")) {
                return styles.productInfoPage
            } else if (router.includes("/cart/")) {
                return styles.cartReceiptPage
            } else {
                return styles.others
            }
    }
}

///This contains the number of countries that we operate in
export const countryList: Array<ICountry> = [
    {name: 'United States', dial_code: '+1', code: 'US',  flag: 'https://drive.google.com/uc?export=download&id=1M0gkMQjwoKCUsKlhniy6jKSBIYddfapJ'},
    {name: 'Canada', dial_code: '+1', code: 'CA', flag: 'https://drive.google.com/uc?export=download&id=1q6y6HolsOzkDWxDtdB-Oj9ZiSCWEP2Ql'},
    {name: 'United Kingdom', dial_code: '+44', code: 'GB', flag: 'https://drive.google.com/uc?export=download&id=1CF8YeyOYiv95SHIwzeYv3FHjkHO80ZlY'},
    {name: 'Egypt', dial_code: '+20', code: 'EG', flag: 'https://drive.google.com/uc?export=download&id=1xVq4WCAUahbtXKvxSfeeDqi25BDzqYt4'},
    {name: 'Ghana', dial_code: '+233', code: 'GH', flag: 'https://drive.google.com/uc?export=download&id=1_CF51QMet_fPRH_Mo58zbijjZa1aHIEa'},
    {name: 'Nigeria', dial_code: '+234', code: 'NG', flag: 'https://drive.google.com/uc?export=download&id=1LCz4DZBzTJxKNcBd5NLYQFwwr10LkHGO'},
    {name: 'South Africa', dial_code: '+27', code: 'ZA', flag: 'https://drive.google.com/uc?export=download&id=1iZStelnWq4kYndejJqW5p-pPLbNbiooi'},
    {name: 'Rwanda', dial_code: '+250', code: 'RW', flag: 'https://drive.google.com/uc?export=download&id=1nv3ffhBvKpmXuzXN6g14IuZvR6vlVAEa'},
    {name: 'Uganda', dial_code: '+256', code: 'UG', flag: 'https://drive.google.com/uc?export=download&id=1T3kWn_0S-WVzDDPjKq39eoVb3Jel8fNX'},
    {name: 'Kenya', dial_code: '+254', code: 'KE', flag: 'https://drive.google.com/uc?export=download&id=1y76iXqrFo-dXxck80UdIieBLA41VFzrd'},
    {name: 'Germany', dial_code: '+49', code: 'DE', flag: 'https://drive.google.com/uc?export=download&id=1RwXP8xZfNzdCCLiGU2FBPijWZHe6mjjt'}, 
    {name: 'Australia', dial_code: '+61', code: 'AU', flag: 'https://drive.google.com/uc?export=download&id=1_Q4LIoic4KKoEDlc6ET-aTmzmAVQgANX'},
    {name: 'India', dial_code: '+91', code: 'IN', flag: 'https://drive.google.com/uc?export=download&id=1mR1UlTlPJEGeHJJfRl37RbA1IJRlLMlq'}
]

///This function gets the countryList info of a particular client
// export const getClientCountryInfo = (countryCode: string): ICountry => {

// }

///This function returns a parsed html tag
export const parsedHtml = (htmlTag: string, tagType: string): React.ReactElement => {
    return React.createElement(
        tagType,
        { dangerouslySetInnerHTML: { __html: htmlTag } }
      );
}


///This function exports a array shuffler function
export const shuffleArray = (array: Array<any>): Array<any> => {
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

///The backend api point
export const backend = "https://drritany-backend-dc538d164ca1.herokuapp.com"
//export const backend = "https://localhost:4050"

///This contains the sort orders
export const sortOptions = [
    {id: 0, name: "Most Ordered"},
    {id: 1, name: "Newest Arrivals"},
    {id: 2, name: "Price: High to Low"},
    {id: 3, name: "Price: Low to High"}
]

///This decodes a unicode string
export const decodedString = (unicodeString: string) => {
    return unicodeString.replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(dec));
}

///This function capitalizes the first letter of every word
export const capitalizeFirstLetter = (str: string | undefined): string | undefined => {
    if (str) {
        return str.replace(/\b\w/g, (match) => match.toUpperCase());
    }
  }

  ///This function returns all item with a key in array
export const getItemByKey = (array: Array<any>, key: string, value: string | null): Array<any> => {
    if (value) {
        return array.filter((arr) => arr[key] === value);
    } else {
        return array
    }
  }


  ///This function types check the currency symbol
  export const getCurrencySymbol = (clientInfo: IClientInfo | null): string => {
    if (clientInfo === null) {
        return "&#36;"
    } else {
        return clientInfo.currencySymbol
    }
  }

   ///This function types check the exchange rate
   export const getExchangeRate = (clientInfo: IClientInfo | null): number => {
    if (clientInfo === null) {
        return 1
    } else {
        return clientInfo.exchangeRate
    }
  }

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
  }

    ///This function deletes an item by the key from an array
export const deleteItemByKey = (array: Array<any>, key: string, value: string): Array<any> => {
    return array.filter((arr) => arr[key] !== value);
  }