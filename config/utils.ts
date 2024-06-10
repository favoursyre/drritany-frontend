//"use client"
///This contains all the utilities

///Libraries --> 
import React from 'react';
import { ICategory, IOrderSheet, IProduct } from './interfaces';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
//import credentials from "../drritany-f60889c0b640.json"

///Commencing the code
export const companyName: string = "Idealplug"

export const companyEmail: string = "support@idealplug.com"

export const nairaSymbol: string = "&#8358;"

export const nairaRate: number = 1200

export const discount: number = 33

export const deliveryPeriod: number = 4 //(Unit is in days) This means delivery is within 4 days

//export const domainName: string = "http://localhost:3000"
export const domainName: string = "https://idealplug.com"

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
export const cartName: string = "idealPlugCart"

//Order name
export const orderName: string = "idealPlugOrder"

export const SUPPORT_EMAIL: string = companyEmail
export const SUPPORT_PASSWORD: string = process.env.NEXT_PUBLIC_SENDER_PASSWORD!
  
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
        case "/products":
            return styles.searchPage
        default:
            if (router.includes("/products/")) {
                return styles.productInfoPage
            } else if (router.includes("/order/invoice")) {
                return styles.orderInvoicePage
            } else if (router.includes("/products")) {
                return styles.searchPage 
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
  }

    ///This function deletes an item by the key from an array
export const deleteItemByKey = (array: Array<any>, key: string, value: string): Array<any> => {
    return array.filter((arr) => arr[key] !== value);
  }

///This function gets the slashed price depending on the discount
export const slashedPrice = (price: number, discount: number): number => {
    return (price * 100) / (100 - discount)
}

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

///This function sorts the products by category
export const sortByCategory = (products: Array<IProduct>, category: string): Array<IProduct> => {
    const categories_ = categories.map((category) => category.name)

    if (category === "All") {
      return products;
    } else {
        
        for (let i: number = 0; i < categories_.length; i++) {
            if (category === categories_[i]) {
                return products.filter(product => product.category === categories_[i]);
            } 
        }
        return products
  };
}

///This function allows us to perform CRUD operation using Google Sheet
export class GoogleSheetDB {
    private doc: GoogleSpreadsheet
    private auth: JWT

    constructor(sheetId: string) {
        this.auth = new JWT({
            // env var values here are copied from service account credentials generated by google
            // see "Authentication" section in docs for more info
            email: sheetEmail,
            key: sheetKey,
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

export const categories: Array<ICategory> = [
    {
        name: "Health & Personal Care",
        micros: [
            "Medical Supplies & Devices",
            "Sports & Outdoors",
            "Medicines & Supplements",
            "Wearables",
            "Personal Care & Hygiene"
        ]
    },
    {
        name: "Beauty & Fashion",
        micros: [
            "Cosmetics & Lotions",
            "Fragances",
            "Jewelries",
            "Clothes",
            "Shoes",
            "Accessories",
            "Textiles"
        ]
    },
    {
        name: "Arts & Crafts",
        micros: [
            "Sculptures",
            "Sketches",
            "Paintings"
        ]
    },
    {
        name: "Home, Furnitures & Appliances",
        micros: [
            ""
        ]
    },
    {
        name: "Computer, Gadget & Electronics",
        micros: [
            ""
        ]
    },
    {
        name: "Energy",
        micros: [
            "Generator",
            "Battery",
            "Solar"
        ]
    }
]

///Confidential data -- I know, I'm a fool
export const sheetEmail: string = "dr-ritany@drritany.iam.gserviceaccount.com"

export const sheetKey: string = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDmYVJBqnYFV5bK\nHJRVM79EZhPtJXItZ2AGH3LOeV73KDn/OCNSdl1jrDFj0+lTv0dB1DJDkdCcVQDO\n8Csi4dWl+uQn6FKjJldTrJS9R0dXRpluRR92mQ1cvy94HY8hCaCqE1WNu22w16or\nga4dbVI4Ip6b3TJa9hAZyTNETrZrAVADUsPM9BZ/ZDs6TjpQBrBUPWlFYVdnK6Mg\n2NZ8HpcYwSWRLfmjJnuCx2fh6LGb2KcAIeWttrYF6pxz/tkthftt2mZQkVSHaCIA\ntujx7mEFnV4DUv+TIiSC2UmaV3yZLtqtSTybx1cpJmjTWnoU5nIoeOaCt1MEOd11\ns7xa60tvAgMBAAECggEAJ66exQnQD2aBZinbEPv7V5Q/nWsESjbSrutO0qrMRUVM\nDB6G0wbpWihIT5oqSA8b/oZG7CWbKbpoi7yJqZX9v3vCPe+CAHEzvIlvC1VSQAG8\nnuZQH5UIXK/fxNBOnZGzd2giJeohYEMdoCXTsGTqsxmfeVh1+n4E0vQ5nOvz9uUs\n0ckcXNuxCy1IT9PvVtz7BX77GxiZOLhaBa25jmIZ+XGUHkpGdGOP/8THoIzwhcOv\ns4gzCA5sEkbSAPp3dOgRuhYnwztk8FhOn2CUaFYbHYUkBYhw3dlqdytgDw/cSen7\n5UEWK51jMq9ubvHzKE4aUFjrMpTJyOCB8Hy+/xX8hQKBgQD0EaNnQzfjkI48aT77\nQ2I/kgV131gVm+YREf2HqHhUmlwkb6hXRvcl1XMRdLpA6NiPnbIjLl4rbm9NVczO\nj40cmLf/7BFw15ezmH/k5RnAZRz5rcSG77qHjJnMw6N78POrUcy9BLzsaG8MkWt9\n5fM+oNAUs2v4++N3xHq2jHor4wKBgQDxpGChsfQIxxL3HW7rtmb2kgciWf1SOnLg\nJht4R5NWldqK9YphM9/cwxgM9xK54z4yGByh3pJVTi17uuOwzc+Jb2pFEeQ/LO8m\nOBCmTSgBBy50n9bIOzdBsUyf1QnDOkstYQUoTEr5WZ6PMezxFo3RG9fdK+CcEScP\nqeHZWaDQBQKBgCTswjbuMXdpOEuldJTY9fU+JztVBeOHCYCNozix4TqTe9s7VVGW\n9+8uYtFCQqdtUs4vgnLWIgMaGxatI2Ygy62G4VeDpIPY6ieOq9K6YnH8Gi0f//qW\nLDczq1USSBqJMqQ5pOr324k8p4hUO9n5Pxq7g5+OIYiyuxA0loglqpoXAoGBALYP\n5Yaur3FVnKJ3mLUcLyOkDqABMW4c/6SG0bekJgzcx1Zffi2Sih6pF5vdJEzOPHQ9\n2oTTT2nah0ZsH1V9G9svCOCVhGVdE6q2H0VNaNCteoEAVTFz/EQQs+zQ9JQVfcLp\nEJu2L98DeQXm1eEn3x4oXlIT1x1/hvC0TKgYcaOJAoGANlLZ2xCJL2n2bxHsPZ71\noXHe+zCT3+/8qFDygRYhFR4DLvNwBFJkasaPrRQ0n2qMXVMqJM+tWDvSk4t6lIt3\nMg/BJDsURiHiIDqAT4WhnCnlGNXjyeXhd7rgWiQU8QRkY/Pm/ToUvOBaEpPc0Nhr\nnk4AiOMDyhWAbHVjJca7smU=\n-----END PRIVATE KEY-----\n"