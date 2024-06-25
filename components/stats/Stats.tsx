"use client"
///Stats component

///Libraries -->
import styles from "./stats.module.scss"
import Image from "next/image";
import PublicIcon from '@mui/icons-material/Public';
import BoltIcon from '@mui/icons-material/Bolt';
import GppGoodIcon from '@mui/icons-material/GppGood';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

///Commencing the code 
  
/**
 * @title Stats Component
 * @returns The Stats component
 */
const Stats = () => {

    return (
        <main className={styles.main}>
            <div className={styles.stat1}>
                <div className={styles.iconCircle}>
                    <PublicIcon className={styles.icon} />
                </div>
                <h4>Delivery to 170+ Countries</h4>
                <span>We deliver to over 170 countries worldwide, ensuring global accessibility.</span>
            </div>
            <div className={styles.stat2}>
                <div className={styles.iconCircle}>
                    <BoltIcon className={styles.icon} />
                </div>
                <h4>Fast & Free Delivery</h4>
                <span>Enjoy fast delivery services on your orders, delivery is absolutely free.</span>
            </div>
            <div className={styles.stat3}>
                <div className={styles.iconCircle}>
                    <GppGoodIcon className={styles.icon} />
                </div>
                <h4>Top Quality Products</h4>
                <span>We offer only the highest quality products, guaranteed to meet your expectations.</span>
            </div>
            <div className={styles.stat4}>
                <div className={styles.iconCircle}>
                    <SupportAgentIcon className={styles.icon} />
                </div>
                <h4>Customer Centricity</h4>
                <span>Our customers are our priority, your satisfaction drives our business.</span>
            </div>
        </main>
    );
};
  
export default Stats;