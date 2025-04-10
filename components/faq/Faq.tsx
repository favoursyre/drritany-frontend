"use client"
///FAQ component

///Libraries -->
import styles from "./faq.module.scss"
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, MouseEvent } from "react";
import { SupportAgent, Add } from "@mui/icons-material";
import { faqs } from "@/config/database";
import { companyName } from "@/config/utils";
import { useModalBackgroundStore, useContactModalStore, useLoadingModalStore } from "@/config/store";
import { getItem } from "@/config/clientUtils";

///Commencing the code 
/**
 * @title FAQ Component
 * @returns The FAQ component
 */
const FAQ = () => {
    //const [faqs, setFaqs] = useState<Array<IFAQState>>(faq_)
    const [activeHeading, setActiveHeading] = useState(0);
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setContactModal = useContactModalStore(state => state.setContactModal);

    ///This function triggers when someone opens an accordian
    const handleHeadingClick = (index: any) => {
        setActiveHeading(index === activeHeading ? null : index);
    };

    ///This function is triggered when the user clicks on contact
    const openContactModal = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        setContactModal(true)
        setModalBackground(true)
    }

    return (
        <>
            <div className={`${styles.faqsHero}`}>
                <div className={styles.gradientOverlay}></div>
                <Image 
                    className={styles.image}
                    src={"https://drive.google.com/uc?export=download&id=1IUijgKEBpZqmRs4uL7lezKLijukfwlnV"}
                    alt=""
                    width={2048}
                    height={1366}
                />
                <div className={styles.brief}>
                    <span className={styles.brief1}>FAQs</span>
                    <span className={styles.brief2}>At {companyName}, we are dedicated to providing our customers with the highest level of service and support. We are always available to answer your questions and help you find the right products for your needs.</span>
                </div>
            </div>
            <div className={styles.faqMain}>
                <div className={styles.accordian}>
                    {faqs.map((faq, index) => ( 
                        <div key={index} className={`${styles.accordianItem} ${activeHeading === index ? styles.activeAccordian : styles.inactiveAccordian}`}>
                            <button
                                className={`${styles.question} ${activeHeading === index ? styles.activeQuestion : styles.inactiveQuestion}`}
                                onClick={() => handleHeadingClick(index)}
                            >
                                {faq.question}
                                <Add className={`${activeHeading === index ? styles.activeSymbol : styles.inactiveSymbol}`} />
                            </button>
                            <div className={`${styles.answer} ${activeHeading === index ? styles.answerActive : ''}`}>
                                {faq.answer} {index === 10 ? <Link href="/terms#personal_data"><span>Learn more</span></Link> : (<></>)}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.contact}>
                    <span className={styles.span1}>Didn&apos;t find an answer to your question or need more clarification on your question?</span>
                    <button onClick={(e) => openContactModal(e)}>
                        <span>Contact Support</span>
                        <SupportAgent className={styles.icon} />
                    </button>
                </div>
            </div>
        </>
    );
};
  
export default FAQ;