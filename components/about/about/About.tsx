"use client"
///About component

///Libraries -->
import styles from "./about.module.scss"
import Image from 'next/image';
import { companyName, getDeliveryFee } from "@/config/utils"
import { useEffect } from "react";

///Commencing the code 
  
/**
 * @title About Component
 * @returns The About component
 */
const About = () => {
    
    useEffect(() => {
        if (typeof window !== undefined) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        //I needed to inspect the delivery fees here
        // let country_ = "United States"

        // function getDeliveryFeesForRange(country: string) {
        //     const result = [];
          
        //     for (let weight = 0.5; weight <= 150; weight += 0.5) {
        //       const price = getDeliveryFee(weight, country);
        //       result.push({ weight: weight, price: price });
        //     }
          
        //     return result;
        // }

        // const results = getDeliveryFeesForRange(country_)
        // console.log('Delivery Fees: ', results)
    })

    return (
        <main className={`${styles.main}`}>
            <div className={styles.gradientOverlay}></div>
            <Image 
                className={styles.background}
                src={"https://drive.google.com/uc?export=download&id=1uy_xi_k3Nq1FLkSGP1FF9zr3P6cPf7xu"}
                alt=""
                width={1224}
                height={816}
            />
            <h2><strong>About Us</strong></h2>
            <span>
            At {companyName}, we pride ourselves in offering a diverse range of items, from everyday essentials to unique finds, ensuring that each customer finds something special. Our commitment to quality and customer satisfaction drives everything we do.
            </span>
        </main>
    );
};
  
export default About;