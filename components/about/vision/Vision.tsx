"use client"
///Vision component

///Libraries -->
import styles from "./vision.module.scss"
import Image from "next/image";

///Commencing the code 
  
/**
 * @title Vision Component
 * @returns The Viision component
 */
const Vision = () => {

    return (
        <main className={styles.main}>
            <div className={styles.mobile_image}>
                <Image 
                    className={styles.img}
                    src={"https://drive.google.com/uc?export=download&id=1KrkjsbEeRmQxJ3c2sBIIpLyqidBCYmTZ"}
                    alt=""
                    width={653}
                    height={416}
                />
            </div>
            <div className={styles.brief}>
            
                <h2><strong>Our Vision</strong></h2>
                <span>
                    We believe that everyone deserves to feel their best and that&apos;s why we&apos;re committed to making our products easily accessible to everyone. We offer a range of affordable and effective healthy 100% natural products that are suitable for people of all ages and lifestyles.
                </span>
            </div>
            <div className={styles.pc_image}>
                <Image 
                    className={styles.img}
                    src={"https://drive.google.com/uc?export=download&id=1KrkjsbEeRmQxJ3c2sBIIpLyqidBCYmTZ"}
                    alt=""
                    width={653}
                    height={416}
                />
            </div>
        </main>
    );
};
  
export default Vision;