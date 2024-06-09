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
            <div className={styles.brief}>
                <h2>
                    <strong>Our Vision</strong>
                </h2>
                <span>
                We aim to be the leading ecommerce platform known for innovation, quality and customer-centricity. We aspire to create a global community of satisfied customers who trust us for all their shopping needs. By continually evolving and adapting to the latest trends and technologies, we aim to set new standards in the ecommerce industry.
                </span>
            </div>
            <div className={styles.image}>
                <Image 
                    className={styles.img}
                    src={"https://drive.google.com/uc?export=download&id=1g4TFVlmEsL9B6tDBASAUs1z66rns5qhl"}
                    alt=""
                    width={2048}
                    height={1366}
                />
            </div>
        </main>
    );
};
  
export default Vision;