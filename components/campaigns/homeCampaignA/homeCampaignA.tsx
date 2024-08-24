"use client"
///Home Campaign A component

///Libraries -->
import styles from "./homeCampaignA.module.scss"
import { routeStyle } from "@/config/utils";
import { usePathname } from "next/navigation";
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
 * @title Home Campaign A Component
 * @returns The Home Campaign A component
 */
const HomeCampaignA = () => {
    const routerPath = usePathname()

    return (
        <main className={`${styles.main} ${routeStyle(routerPath, styles)}`}>
            <div className={styles.container}>
                
            </div>
        </main>
    );
};
  
export default HomeCampaignA;