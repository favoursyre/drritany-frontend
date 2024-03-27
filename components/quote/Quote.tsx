"use client"
///Quote component

///Libraries -->
import styles from "./quote.module.scss"
import { useState, useEffect, MouseEvent } from "react"
import { IQuoteState } from "@/app/utils/interfaces"

///Commencing the code 

/**
 * @title Quote Component
 * @returns The Quote component
 */
const Quote = ({ quote_ }: { quote_: Array<IQuoteState> }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [quotes, setQuotes] = useState<Array<IQuoteState>>(quote_)

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
            <button className={styles.btn1} onClick={(e) => goToPrev(e)}>
                <img 
                    src="https://drive.google.com/uc?export=download&id=184h4e-pY-XR0Voxo6KqlwkHSvbpBnQLq"
                    alt=""
                />
            </button>
            <div className={styles.quote_section}>
                <div className={styles.open_quote}>
                    <img 
                        src="https://drive.google.com/uc?export=download&id=18AYwVU8Hre9ThTdoT4vnL1hp6uuWA2cx"
                        alt=""
                    />
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
                    <img 
                        src="https://drive.google.com/uc?export=download&id=1uKKyYJ423CaZOQMuHS-iQBI3t8CwApjH"
                        alt=""
                    />
                    </div>
            </div>
            <button className={styles.btn2} onClick={(e) => goToNext(e)}>
                <img 
                    src="https://drive.google.com/uc?export=download&id=1uGvoWpKNitWrHeI8vKDSWYIAVDuXOyk3"
                    alt=""
                />
            </button>
        </main>
    );
};
  
export default Quote;