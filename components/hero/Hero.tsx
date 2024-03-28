"use client"
///Hero component

///Libraries -->
import styles from "./hero.module.scss"
import Image from "next/image";

///Commencing the code 
  
/**
 * @title Hero Component
 * @returns The Hero component
 */
const Hero = () => {
      
    return (
        <main className={styles.main}>
            {/* <Image
                className={styles.background}
                src="https://drive.google.com/uc?export=download&id=1pj3Qwosp72TAarXQchvwtw77Z5y0GpTt"
                alt=""
                width={1440}
                height={1676}
            /> */}
            <div className={styles.left_section}>
                <h3>Get <span>33%</span> off</h3>
                <br />
                <p>
                    On our range of detoxifying products and unlock a healthier you. 
                    Cleanse your body and mind with our all-natural, premium quality products that are designed to rejuvenate and refresh. 
                    Say goodbye to toxins and hello to a healthier you. Shop now and experience the difference
                </p>
            </div>
            <div className={styles.right_section}>
                <Image
                    className={styles.img}
                    src="https://drive.google.com/uc?export=download&id=1Mb0YoVskFKeCTbLxiRm7_E04jWHqFesC"
                    alt=""
                    width={599}
                    height={590}
                />
            </div>
        </main>
    );
};
  
export default Hero;