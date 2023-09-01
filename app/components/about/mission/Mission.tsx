"use client"
///Mission component

///Libraries -->
import styles from "./mission.module.scss"

///Commencing the code 
  
/**
 * @title Mission Component
 * @returns The Miission component
 */
const Mission = () => {

    return (
        <main className={styles.main}>
            <div className={styles.image}>
                {/* <img 
                    src="./images/mission.png"
                    alt=""
                /> */}
            </div>
            <div className={styles.brief}>
                <h2><strong>Our Mission</strong></h2>
                <span>
                    With that, we decided to research a line of detoxifying products that are safe, effective, and easy to use. Our products are made from high-quality, natural ingredients that are carefully selected to help remove toxins from the body and support optimal health.
                </span>
            </div>
        </main>
    );
};
  
export default Mission;