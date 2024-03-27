"use client"
///Vision component

///Libraries -->
import styles from "./vision.module.scss"

///Commencing the code 
  
/**
 * @title Vision Component
 * @returns The Viision component
 */
const Vision = () => {

    return (
        <main className={styles.main}>
        <div className={styles.mobile_image}></div>
            <div className={styles.brief}>
            
                <h2><strong>Our Vision</strong></h2>
                <span>
                    We believe that everyone deserves to feel their best, and that&apos;s why we&apos;re committed to making our products accessible to everyone. We offer a range of affordable detoxifying products that are suitable for people of all ages and lifestyles.
                </span>
            </div>
            <div className={styles.pc_image}>
                {/* <img 
                    src="./images/mission.png"
                    alt=""
                /> */}
            </div>
        </main>
    );
};
  
export default Vision;