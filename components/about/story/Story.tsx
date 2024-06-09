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
            <div className={styles.brief}>
                <h2>
                    <strong>Our Story</strong>
                </h2>
                <span>
                Our journey began with a simple idea, to create a shopping experience that blends convenience, quality and exceptional service. Every step of our journey has been inspired by our desire to make shopping more enjoyable and fulfilling for you.
                </span>
            </div>
            <div className={styles.image}>
                <Image 
                    className={styles.img}
                    src={"https://drive.google.com/uc?export=download&id=1V3sWqZxc6hEDuIoVxWI4pH64X3yaDNmA"}
                    alt=""
                    width={1224}
                    height={816}
                />
            </div>
        </main>
    );
};
  
export default Story;