"use client"
///Display bar component

///Libraries -->
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from "./displayBar.module.scss"
import { routeStyle } from '@/config/utils'

///Commencing the code 
/**
 * @title Display bar Component
 * @returns The Display bar component
 */
const DisplayBar = ({ text_ }: { text_: string | undefined }) => {
    const routerPath = usePathname()
    const [text, setText] = useState<string | undefined>(text_)

    return (
        <main className={`${styles.main} ${routeStyle(routerPath, styles)}`}>
            <div className={styles.container}>
                <div className={styles.bar}></div>
                <span className={styles.barTitle}>{text ? text : "Shop Now & Pay on Delivery"}</span>
            </div>
        </main>
    );
};
  
export default DisplayBar;