"use client"
///Loading component

///Libraries -->
import styles from "./circle.module.scss"

///Commencing the code 

/**
 * @title Loading Component
 * @returns The Loading component
 */
const Loading = ({ width, height}: { width: string, height: string}) => {
  //console.log('Current page:', routerPath);

  return (
    <div className={styles.main}>
        <div className={styles.circle} style={{ width: width, height: height }}></div>
    </div>
  );
};

export default Loading;