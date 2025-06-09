"use client"
///Terms of use component

///Libraries -->
import styles from "./terms.module.scss"
import { companyName, getProducts, getRandomNumber, backend, getProductReviews } from "@/config/utils";
import Image from "next/image";
import { getItem, setItem } from "@/config/clientUtils";
import { IProduct, IProductReview } from "@/config/interfaces";
import { useLoadingModalStore, useModalBackgroundStore } from "@/config/store";
import { useEffect, useState } from "react";
import axios from "axios";

///Commencing the code 
const getUniqueProductIds = (reviews: IProductReview[]): Array<{ productId: string }> => {
  // Create a Set to store unique productIds
  const uniqueProductIds = new Set<string>();

  // Loop through the reviews and add the productId to the Set
  reviews.forEach(review => {
    if (review.productId) {
      uniqueProductIds.add(review.productId);
    }
  });

  // Convert the Set back to an array of objects
  return Array.from(uniqueProductIds).map(productId => ({ productId }));
};

/**
 * @title Terms Component
 * @returns The Terms component
 */
const Terms = () => {

    //This was used to update all the products
    useEffect(() => {
        const _name = "updateProduct"
        const stat = getItem(_name)
        console.log("Stat: ", stat)
        if (!stat) {
            //Want to increase the number of orders of all products
            const updateProducts = async () => {
                try {
                    const products = await getProducts() as unknown as Array<IProduct>
                    const reviews = await getProductReviews() as unknown as Array<IProductReview>
                    const uniqueids = getUniqueProductIds(reviews)
                    console.log("Unique Ids: ", uniqueids)
                    console.log("Length of Unique Ids: ", uniqueids.length)
        
                    if (products) {
                        //const p = products[0]
                        let _n = 1
                        for (const p of products) {
                            const pExist = uniqueids.some(item => item.productId === p._id)

                            if (!pExist && p.active && p.pricing?.inStock) {
                                console.log("Updating Product: ", p.name)
                                //console.log("Product does not exist: ", p._id)
                                const newOrders = getRandomNumber(107, 593)
                                const productStock = getRandomNumber(4, 36)
                                //const { orders } = p
                                //console.log("Old: ", p, orders)
                                const _orders = newOrders
                                console.log('Orders: ', _orders)
                                p.orders = _orders
                                p.stock = productStock
                                console.log('Product Stock: ', productStock)
                                console.log("New: ", p)
                                const res = await fetch(`${backend}/product/${p._id}`, {
                                    method: "PATCH",
                                    body: JSON.stringify(p),
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                })
                            
                                if (res.ok) {
                                    if (p.active && p.pricing?.inStock) {
                                        let product = p
                                        const reviewRes = await axios.post(`${backend}/ai-review`, product, {
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                        });

                                        console.log("review Response: ", reviewRes)
                                    }

                                    console.log(`Updated ${_n}: `, await res.json())
                                    _n = _n + 1
                                    //notify("success", "Product Updated Successfully")
                                    //return
                                }
                            } else {
                                undefined
                                console.log("Product already updated: ", p._id)
                            }
                        }

                        console.log("All Products Updated Successfully")
                        
                        setItem(_name, true)
                    }
                } catch (error) {
                    console.log("Error Updating: ", error)
                } 
            }

            updateProducts()   
        }
        
    })

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
                        <li><strong>Product Orders:</strong> When you place an order for a product on our website, the free shipping may vary depending on your location. On some rare occasions, delivery might take longer than stipulated due to some uncontrollable/unforseen issues, if for some reason, after 90days you still haven&apos;t received your orders, we would have to refund you. Also, you alone are responsible for all applicable tariffs associated with your purchase as required by the jurisdiction of your country. We would also not be held responsible for any extra fee that would arise as a result of giving us the wrong address for your orders.</li>
                        <li><strong>Product Information:</strong> We make every effort to provide accurate and complete product information on our website.</li>
                        <li><strong>Price Fluctuation:</strong> On some rare occasions, prices of goods may change within the period of you placing an order for it. If the price reduces, you will be refunded the surplus else you will need to pay the deficit.</li>
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