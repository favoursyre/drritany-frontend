"use client"
///Map component

///Libraries -->
import styles from "./map.module.scss"
import Image from "next/image";

///Commencing the code 
  
/**
 * @title Map Component
 * @returns The Map component
 */
const Map = () => {

    return (
        <main className={styles.main}>
            <div className={styles.map_section}>
                <img
                    src="https://drive.google.com/uc?export=download&id=1t96yzWmkApyieoIjB0rvmBTt5X-Jkpc0"
                    alt=""
                />
            </div>
        </main>
    );
};
  
export default Map;