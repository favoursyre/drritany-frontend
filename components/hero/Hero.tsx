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
                    Our exclusive natural health collections! Elevate your health with our handpicked essentials crafted to rejuvenate your body, soul and mind. Experience the transformative power of nature's finest ingredients and embark on a journey to renewed vitality. Don't miss out, shop now and prioritize your health with confidence and joy!
                </p>
            </div>
            <div className={styles.right_section}>
                <Image
                    className={styles.img}
                    src="https://drive.google.com/uc?export=download&id=10-TEdesP7Z4kxVgMWqyfnJO5jnUpUrHN"
                    alt=""
                    width={599}
                    height={590}
                />
            </div>
        </main>
    );
};
  
export default Hero;