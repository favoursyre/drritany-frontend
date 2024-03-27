"use client"
///Testimony component

///Libraries -->
import { useState, useEffect, MouseEvent, useRef } from "react"
import styles from "./testimony.module.scss"
import { ITestimony } from "@/app/utils/interfaces"

///Commencing the code 
  
/**
 * @title Testimony Component
 * @returns The Testimony component
 */
const Testimony = ({ testimonial_ }: { testimonial_: Array<ITestimony> }) => {
    const [activeTestifier, setActiveTestifier] = useState(0)
    const [testimony, setTestimony] = useState(testimonial_)
    const [testimonyText, setTestimonyText] = useState<string | undefined>(testimony ? testimony[activeTestifier].testimony : undefined)
    const containerRef = useRef<HTMLDivElement>(null);
    

    ///This function triggers when someone opens an accordian
  const handleClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | void, index: any) => {
    if (e) {
        e.preventDefault()
    }
    

    setTestimonyText(testimony[index].testimony)
    setActiveTestifier(index === activeTestifier ? null : index);
  };

  ///This handles the changing of the testifiers and their testimony
  useEffect(() => {
    const interval = setInterval(() => {
        const isLastSlide = activeTestifier === testimony.length - 1;
        const newIndex = isLastSlide ? 0 : activeTestifier + 1;
        setTestimonyText(testimony[newIndex].testimony)
        setActiveTestifier(newIndex)
        //console.log("Active identifier: ", activeTestifier)
      }, 9000);
  
      return () => {
        clearInterval(interval);
      };
    
  }, [testimony, activeTestifier, testimonyText]);

///This handles the scroll effect of the testimony side
  useEffect(() => {
    const interval = setInterval(() => {
        
        const handleScroll = (scrollOffset: number) => {
            if (containerRef.current) {
                //console.log("Scroll: ", containerRef.current.scrollTop)
                if (containerRef.current.scrollTop >= 240) {
                    containerRef.current.scrollTop = 0
                } else {
                    containerRef.current.scrollTop += scrollOffset;
                }
            }
          };
        handleScroll(20)
      }, 3350);
  
      return () => {
        clearInterval(interval);
      };
    
  }, []);

  //console.log("test: ", JSON.stringify("name"))

    return (
        <main className={`${styles.main}`}>
           <div className={styles.testimony_brief}>
                <h3>What Our Customers Are Saying</h3>
           </div>
           <div className={styles.testimonyContainer}>
                <div className={styles.testifierInfo}>
                    <div className={styles.info}>
                    <div className={styles.top_blur}></div>
                    <div ref={containerRef} className={styles.testifier_slide}>
                    {testimony ? testimony.map((t, _id) => (
                        <button key={_id} className={`${styles.testifier} ${activeTestifier === _id ? styles.activeTestifier : styles.inactiveTestifier}`} onClick={(e) => handleClick(e, _id)} >
                            <div className={styles.testifier_image}>
                                <img 
                                    src={t.image}
                                    alt=""
                                />
                            </div>
                            <div className={styles.testifier_bio}>
                                <span className={styles.testifier_name}>{t.name}</span>
                                <span className={styles.testifier_profession}>{t.profession}</span>
                            </div>
                        </button>
                    )) : (
                        <div>Loading...</div>
                    )}
                        
                    </div>
                    <div className={styles.bottom_blur}></div>
                    </div>
                    <div className={styles.mobileInfo}>
                        <div className={styles.testifier_image}>
                            <img 
                                src={testimony ? testimony[activeTestifier].image : ""}
                                alt=""
                            />
                        </div>
                        <span className={styles.testifier_name}><strong>{testimony ? testimony[activeTestifier].name : ""}</strong></span>
                        <span className={styles.testifier_profession}>{testimony ? testimony[activeTestifier].profession : ""}</span>
                    </div>
                    
                </div>
                <div className={styles.testimony}>
                    {testimonyText}
                </div>
           </div>
        </main>
    );
};
  
export default Testimony;