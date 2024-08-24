"use client"
///Stats component

///Libraries -->
import styles from "./stats.module.scss"
import Image from "next/image";
import PublicIcon from '@mui/icons-material/Public';
import { BoltOutlined, VerifiedOutlined } from "@mui/icons-material";
import BoltIcon from '@mui/icons-material/Bolt';
import GppGoodIcon from '@mui/icons-material/GppGood';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PriceCheckIcon from '@mui/icons-material/LocalAtm';

///Commencing the code 
const stats = [1, 2]
  
/**
 * @title Stats Component
 * @returns The Stats component
 */
const Stats = () => {

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.stat1}>
                    <PriceCheckIcon className={styles.icon} />
                    {/* <h4>Delivery to 170+ Countries</h4>
                    <span>We deliver to over 170 countries worldwide, ensuring global accessibility.</span> */}
                    <div className={styles.text}>
                        <span className={styles.span1}>Best Prices</span>
                        <span className={styles.span2}>Best prices and offers</span>
                    </div>
                </div>
                <div className={styles.stat2}>
                    <BoltOutlined className={styles.icon} />
                    <div className={styles.text}>
                        <span className={styles.span1}>Fast Delivery</span>
                        <span className={styles.span2}>Delivery within 1-3 days</span>
                    </div>
                </div>
                <div className={styles.stat3}>
                    <VerifiedOutlined className={styles.icon} />
                    <div className={styles.text}>
                        <span className={styles.span1}>Top Quality Products</span>
                        <span className={styles.span2}>We sell only original products</span>
                    </div>
                </div>
                <div className={styles.stat4}>
                    <SupportAgentIcon className={styles.icon} />
                    <div className={styles.text}>
                        <span className={styles.span1}>Customer Centricity</span>
                        <span className={styles.span2}>Friendly 24/7 customer support</span>
                    </div>
                </div>
            </div>
        </main>
    );
};
  
export default Stats;