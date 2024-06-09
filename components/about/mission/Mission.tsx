"use client"
///Mission component

///Libraries -->
import styles from "./mission.module.scss"
import Image from "next/image";

///Commencing the code 
  
/**
 * @title Mission Component
 * @returns The Miission component
 */
const Mission = () => {

    return (
        <main className={styles.main}>
            <div className={styles.image}>
                <Image
                    className={styles.background} 
                    src={"https://drive.google.com/uc?export=download&id=19eI2s25pxLUP49L1uPpYX_xXrRwICgWJ"}
                    alt=""
                    width={1224}
                    height={904}
                />
            </div>
            <div className={styles.brief}>
                <h2><strong>Our Mission</strong></h2>
                <span>
                    We aim to offer a wide range of high-quality products at competitive prices, backed by outstanding customer service. We believe in the power of choice and strive to bring you a curated selection that meets your diverse needs and preferences. Our goal is to make your shopping experience seamless, enjoyable, and rewarding.
                </span>
            </div>
        </main>
    );
};
  
export default Mission;