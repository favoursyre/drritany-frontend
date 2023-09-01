"use client"
///Story component

///Libraries -->
import styles from "./story.module.scss"

///Commencing the code 
  
/**
 * @title Story Component
 * @returns The Story component
 */
const Story = () => {

    return (
        <main className={`${styles.main}`}>
            <div className={styles.brief}>
            <h2><strong>Our Story</strong></h2>
            <span>
                Our journey began when we realized that many people struggle with health issues that are caused by toxins in their bodies. We discovered that detoxifying the body can be a powerful way to improve overall health, boost energy levels, and prevent chronic illnesses.
            </span>
            </div>
            
        </main>
    );
};
  
export default Story;