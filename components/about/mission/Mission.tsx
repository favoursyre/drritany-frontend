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
                    src={"https://drive.google.com/uc?export=download&id=1x2qiEubZJOmhSBVpReihZQ8duwEnm9IF"}
                    alt=""
                    width={928}
                    height={416}
                />
            </div>
            <div className={styles.brief}>
                <h2><strong>Our Mission</strong></h2>
                <span>
                    With that, we decided to research a line of healthy 100% natural products that are safe, effective and easy to use. Our products are made from high-quality, natural ingredients that are carefully and professionally selected to help remove toxins from the body, cure chronic illness, boost overall appearance and support optimal health.
                </span>
            </div>
        </main>
    );
};
  
export default Mission;