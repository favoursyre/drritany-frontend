"use client"
///Quote component

///Libraries -->
import styles from "./quote.module.scss"
import { useState, useEffect, MouseEvent } from "react"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { shuffleArray } from "@/config/utils";
import { quotes as q } from "@/config/database"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { IQuoteState } from "@/config/interfaces";

///Commencing the code 

/**
 * @title Quote Component
 * @returns The Quote component
 */
const Quote = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [quotes, setQuotes] = useState<Array<IQuoteState>>(shuffleArray(q))

    ///This function slides the quote to the right
    const goToPrev = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | void): void => {
        //console.log("right clicked")
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? quotes.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
       // console.log("right clicked: ", isFirstSlide)
    }

    ///This function slides the quote to the left
    const goToNext = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | void): void => {
        const isLastSlide = currentIndex === quotes.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
        //console.log("left clicked: ", isLastSlide)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const isLastSlide = currentIndex === quotes.length - 1;
            const newIndex = isLastSlide ? 0 : currentIndex + 1;
            setCurrentIndex(newIndex);
            //console.log("Current Index: ", currentIndex)
          }, 10000);
      
          return () => {
            clearInterval(interval);
          };
        
      }, [quotes, currentIndex]);

    return (
        <main className={`${styles.main}`}>
            <span className={styles.heading}>Did you know?</span>
            <div className={styles.container}>
            <button className={styles.btn1} onClick={(e) => goToPrev(e)}>
                <ArrowBackIosIcon className={styles.icon} />
            </button>
            <div className={styles.quote_section}>
                <div className={styles.open_quote}>
                    <FormatQuoteIcon className={styles.icon} />
                </div>
                <div className={styles.quote_text}>
                    {quotes && quotes.length !== 0 ? (
                        <span>{quotes[currentIndex].quote}</span>
                    ) : (
                        <span>Loading...</span>
                    )}
                    {/* <span>{quotes ? quotes[currentIndex].quote : ""}</span> */}
                </div>
                
                <div className={styles.close_quote}>
                    <FormatQuoteIcon className={styles.icon} />
                </div>
            </div>
            <button className={styles.btn2} onClick={(e) => goToNext(e)}>
                <ArrowForwardIosIcon className={styles.icon} />
            </button>
            </div>
        </main>
    );
};
  
export default Quote;