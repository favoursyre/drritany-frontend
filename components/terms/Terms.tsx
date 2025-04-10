"use client"
///Terms of use component

///Libraries -->
import styles from "./terms.module.scss"
import { companyName, clientInfoName } from "@/config/utils";
import Image from "next/image";
import { getItem } from "@/config/clientUtils";
import { useLoadingModalStore, useModalBackgroundStore } from "@/config/store";
import { IClientInfo } from "@/config/interfaces";
import { useEffect, useState } from "react";

///Commencing the code 
  
/**
 * @title Terms Component
 * @returns The Terms component
 */
const Terms = () => {
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal)
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo!)

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
            }, 200);
    
            //console.log("Delivery Info: ", deliveryInfo)
        
            return () => {
                clearInterval(interval);
            };
        } else {
            setModalBackground(false)
            setLoadingModal(false)
            //console.log("Client info detected")
        }  

    }, [clientInfo])

    //This was used to update all the products
    // useEffect(() => {
    //     const _name = "updateProduct"
    //     const stat = getItem(_name)
    //     console.log("stat: ", stat)
    //     if (!stat) {
    //         //Want to add 2 to every price of goods
    //         const updateProducts = async () => {
    //             const getProducts = async (): Promise<Array<IProduct> | undefined> => {
    //                 try {
    //                     const res = await fetch(`${backend}/product?action=order`, {
    //                     method: "GET",
    //                     cache: "no-store",
    //                     //next: { revalidate: 120 }
    //                     })
                    
    //                     if (res.ok) {
    //                     return res.json()
    //                     } else {
    //                     getProducts()
    //                     }
    //                 } catch (error) {
    //                     console.error(error);
    //                 }
    //             }
                
    //             const products = await getProducts()
    //             if (products) {
    //                 //const p = products[0]
    //                 let _n = 1
    //                 for (const p of products) {
    //                     const { pricing } = p
    //                     console.log("Old: ", p, pricing?.basePrice)
    //                     const _price = pricing?.basePrice! + 2
    //                     console.log('Price: ', _price)
    //                     const _pricing: IPricing = { ...pricing, basePrice: _price, }
    //                     console.log('Pricing: ', _pricing)
    //                     p.pricing = _pricing
    //                     console.log("New: ", p)
    //                     const res = await fetch(`${backend}/product/${p._id}`, {
    //                         method: "PATCH",
    //                         body: JSON.stringify(p),
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                         },
    //                     })
                    
    //                     if (res.ok) {
    //                         console.log(`Update ${_n}: `, await res.json())
    //                         _n = _n + 1
    //                         //notify("success", "Product Updated Successfully")
    //                         //return
    //                     }
    //                 }
                    
    //                 setItem(_name, true)
    //             }
    //         }

    //         updateProducts()
    //     }
        
    // })

    return (
        <>
            <div className={`${styles.termsHero}`}>
                <div className={styles.gradientOverlay}></div>
                <Image 
                    className={styles.image}
                    src={"https://drive.google.com/uc?export=download&id=1F0sG-uI_LcbEZUt6tiwHUXWXNmIN0YMd"}
                    alt=""
                    width={2048}
                    height={1035}
                />
                <div className={styles.brief}>
                    <span className={styles.brief1}>Terms of Use</span>
                    <span className={styles.brief2}>Welcome to {companyName}, your everyday marketplace. These terms of use (&apos;Terms&apos;) govern your access and use of the website, products 
                    and services offered by {companyName} (&apos;we&apos;, &apos;us&apos; or &apos;our&apos;) through this website.</span>
                </div>
            </div>
            <main className={`${styles.main}`}>
                <span>
                        By accessing and using our website, you agree to be bound by the following terms;
                    </span>
                    <ol id="personal_data">
                        <li><strong>Website Use:</strong> Our website is intended for informational and e-commerce purposes only. You are prohibited from using our website for any illegal or unauthorized purposes.</li>
                        <li><strong>Personal Data:</strong> In other to purchase products from our website, you will be required to provide us with personal information. We respect your privacy and would only share it with the required 3rd party companies involved in the shipping process.</li>
                        <li><strong>Product Orders:</strong> When you place an order for a product on our website, the free shipping may vary depending on your location. On some occasion delivery might take longer than stipulated due to some unforseen issues, if for some reason, after 90days you still haven&apos;t received your orders, we would have to refund you. Also, you alone are responsible for all applicable tariffs associated with your purchase as required by the jurisdiction of your country. We would also not be held responsible for any extra fee that would arise as a result of giving us the wrong address for your orders.</li>
                        <li><strong>Product Information:</strong> We make every effort to provide accurate and complete product information on our website.</li>
                        <li><strong>Price Fluctuation:</strong> On rare occasions, prices of goods may change within the period of you placing an order for it. If the price reduces, you will be refunded the surplus else you will need to pay the deficit.</li>
                        <li><strong>Medical Information:</strong> Our website may provide general medical information, but it is not intended to be a substitute for professional medical advice, diagnosis or treatment. You should always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition</li>
                        <li><strong>Intellectual Property:</strong> Our website and its contents, including but not limited to text, graphics, images and software are protected by copyright, trademark and other intellectual property laws. You may not copy, modify, distribute or reproduce any part of our website without our prior written consent.</li>
                        <li><strong>Disclaimer of Warranty:</strong> OUR WEBSITE AND THE PRODUCTS AND SERVICES OFFERED THROUGH OUR WEBSITE ARE PROVIDED “AS IS” WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.</li>
                        <li><strong>Limitation of Liability:</strong> IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF OUR WEBSITE OR THE PRODUCTS OR SERVICES OFFERED THROUGH OUR WEBSITE.</li>
                        <li><strong>Indemnification:</strong> You agree to indemnify, defend, and hold us harmless from any claims, damages, liabilities, and expenses (including attorneys&apos; fees) arising out of or related to your use of our website or the products or services offered through our website.</li>
                        <li><strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is incorporated.</li>
                        <li><strong>Modification:</strong> We reserve the right to modify these Terms at any time, and such modifications shall be effective immediately upon posting on our website.</li>
                        <li><strong>Termination:</strong> We may terminate these Terms and your access to our website at any time, with or without cause or notice.</li>
                        <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and us regarding your use of our website and the products and services offered through our website.</li>
                    </ol>
            </main>
        </>
    );
};
  
export default Terms;