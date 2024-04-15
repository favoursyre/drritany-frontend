"use client"
///Story component

///Libraries -->
import styles from "./story.module.scss"
import Image from "next/image";

///Commencing the code 
  
/**
 * @title Story Component
 * @returns The Story component
 */
const Story = () => {

    return (
        <main className={`${styles.main}`}>
            <Image 
                className={styles.background}
                src={"https://drive.google.com/uc?export=download&id=1U24xYbeAj3jbmEVaEyXVJ82bHVQ7TIMi"}
                alt=""
                width={1440}
                height={416}
            />
            <div className={styles.brief}>
            <h2><strong>Our Story</strong></h2>
            <span>
            Our journey began with a deep understanding of the health challenges that people from various part of the world go through on a daily basis, we discovered the profound impact of nurturing the body with healthy natural remedies — an empowering path to enhance overall well-being, elevate energy levels and fortify against chronic ailments.
            </span>
            </div>
            
        </main>
    );
};
  
export default Story;