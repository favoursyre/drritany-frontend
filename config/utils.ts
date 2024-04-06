//"use client"
///This contains all the utilities

///Libraries --> 
import React from 'react';
import { IClientInfo, IOrderSheet, IProduct } from './interfaces';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import credentials from "../drritany-f60889c0b640.json"

///Commencing the code
export const companyName: string = "Dr Ritany"

export const nairaSymbol: string = "&#8358;"

export const nairaRate: number = 1250

export const discount: number = 33

export const domainName: string = "http://localhost:3000"
//export const domainName: string = "https://dr-ritany.vercel.app"

export const orderSheetId: string = "1sRUnpH6idKiS3pFH50DAPxL29PJpPXEgFHipC7O5kps"

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
export const backend = "https://drritany-web-backend-2b4e96f65eb5.herokuapp.com"
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

///This function gets the slashed price depending on the discount
export const slashedPrice = (price: number, discount: number): number => {
    return (price * 100) / (100 - discount)
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

///This function sorts the array from latest to oldest
export const sortProductByLatest = (products: Array<IProduct>): Array<IProduct> => {
    // Sort the array based on the createdAt property in descending order
    const sortedProducts = products.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }); 
    return sortedProducts
}

///This function sorts the array by the price property
export const sortProductByPrice = (products: Array<IProduct>, action: string): Array<IProduct> => {
    ///This function sorts the price property from highest price to lowest price
    if (action === "descend") {
        const sortedProducts = products.sort((a, b) => {
            const priceA = a.price ?? 0; // Default to 0 if price is undefined
            const priceB = b.price ?? 0; // Default to 0 if price is undefined
            return priceB - priceA;
        });
        return sortedProducts
    } else if (action === "ascend") {
        ///This function sorts the price property from lowest price to highest price
        const sortedProducts = products.sort((a, b) => {
            const priceA = a.price ?? 0; // Default to 0 if price is undefined
            const priceB = b.price ?? 0; // Default to 0 if price is undefined
            return priceA - priceB;
        });
        return sortedProducts
    } else {
        return products
    }
}

///This function allows us to perform CRUD operation using Google Sheet
export class GoogleSheetDB {
    private doc: GoogleSpreadsheet
    private auth: JWT

    constructor(sheetId: string) {
        this.auth = new JWT({
            // env var values here are copied from service account credentials generated by google
            // see "Authentication" section in docs for more info
            email: credentials.client_email,
            key: credentials.private_key,
            scopes: [
              'https://www.googleapis.com/auth/spreadsheets',
            ],
          });
        this.doc = new GoogleSpreadsheet(sheetId, this.auth)
    }

    ///This function gets a row using the ID property
    public async getRow(cartId: string, sheetIndex: number) {
        // load the documents info
        await this.doc.loadInfo();

        // Index of the sheet
        let sheet = this.doc.sheetsByIndex[sheetIndex];

        // Get all the rows
        let rows = await sheet.getRows();

        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            if (row.get("CartId") === cartId) {
                console.log(row);
                return row
            }
        };
    }

    ///This function deletes a row using the ID property
    public async deleteRow(sheetIndex: number, cartId: string) {
        await this.doc.loadInfo();

        // Index of the sheet
        let sheet = this.doc.sheetsByIndex[sheetIndex];
    
        let rows = await sheet.getRows();
    
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            if (row.get("CartId") === cartId) {
                await row.delete();
                break; 
            }
        };
    }

    ///This function adds new row to the sheet
    public async addRow(sheetIndex: number, rows: Array<IOrderSheet>) {
        await this.doc.loadInfo();

        // Index of the sheet
        let sheet = this.doc.sheetsByIndex[sheetIndex];
        console.log("Sheet: ", sheet)

        for (let index = 0; index < rows.length; index++) {
            const row = rows[index] as unknown as any;
            console.log("Add: ", row)

            await sheet.addRow(row);
        }
    }

    ///This function updates a row in the sheet using the ID property
    public async updateRow(sheetIndex: number, cartId: string, data: IOrderSheet) {
        await this.doc.loadInfo();

        // Index of the sheet
        let sheet = this.doc.sheetsByIndex[sheetIndex];

        let rows = await sheet.getRows();

        for (let index = 0; index < rows.length; index++) {
            const row = rows[index]
            //console.log("Row: ", row.get("CartId"))
            if (row.get("CartId") === cartId) {
                const data_ = Object.entries(data)
                for (let i = 0; i < data_.length; i++) {
                    row.set(data_[i][0], data_[i][1])
                    await row.save();
                }
                break; 
            }
        };
    }
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