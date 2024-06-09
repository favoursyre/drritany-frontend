"use client"
///Time bar component

///Libraries -->
import { useRouter } from 'next/navigation';
import { useState, useEffect, MouseEvent } from 'react';
import styles from "./timeBar.module.scss"
import { IProduct, IClientInfo } from '@/config/interfaces';
import { groupList, sortOptions as sortOption, sortProductByOrder, sortProductByLatest, sortProductByPrice, categories, sortByCategory } from '@/config/utils'
import TuneIcon from '@mui/icons-material/Tune';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Image from 'next/image';
import { useClientInfoStore } from "@/config/store";
import ProductCard from '@/components/cards/product/ProductCard';
import CategoryIcon from '@mui/icons-material/Category';
import { notify } from '@/config/clientUtils';

///Commencing the code 
/**
 * @title Time bar Component
 * @returns The Time bar component
 */
const TimeBar = () => {
    const [timeLeft, setTimeLeft] = useState<number>(54400);

    useEffect(() => {
        if (timeLeft === 0) {
            setTimeLeft(86400);
            }

        const intervalId = setInterval(() => {
            setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);

    ///
    // useEffect(() => {
    //     if (timeLeft === 0) {
    //     setTimeLeft(86400);
    //     }
    // }, [timeLeft]);

    ///This function formats time
    const formatTime = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hrs}h: ${mins < 10 ? '0' : ''}${mins}m: ${secs < 10 ? '0' : ''}${secs}s`;
    };

    return (
        <main className={`${styles.main}`}>
            <div className={styles.time_section}>
                <span>Time remaining: {formatTime(timeLeft)}</span>
            </div>
        </main>
    );
};
  
export default TimeBar;