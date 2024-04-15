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
                {/* when updating the new map image with new countries, dont forget to update the countries in the order form */}
                <Image
                    className={styles.img}
                    src={"https://drive.google.com/uc?export=download&id=1IxsKDhyI3gvU2p9DE-sAPmbXS_GVT1e-"}
                    alt=""
                    width={722}
                    height={310}
                />
            </div>
        </main>
    );
};
  
export default Map;