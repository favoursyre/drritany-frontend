"use client"
///Return Modal component

///Libraries -->
import styles from "./returnModal.module.scss"
import { useModalBackgroundStore, useReturnPolicyModalStore, useContactModalStore } from "@/config/store";
import { MouseEvent, useState, FormEvent } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { extraDiscount, domainName } from "@/config/utils";

///Commencing the code 

/**
 * @title Return Modal Component
 * @returns The Return Modal component
 */
const ReturnModal = () => {
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setReturnPolicyModal = useReturnPolicyModalStore(state => state.setReturnPolicyModal);
    const setContactModal = useContactModalStore(state => state.setContactModal);
    const returnPolicyModal = useReturnPolicyModalStore(state => state.modal);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    ///This function is triggered when the background of the modal is clicked
    const closeModal = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()

        setModalBackground(false)
        setReturnPolicyModal(false)
        //console.log("modal closed: ", discountProduct.freeOption)
    }

    //This function is triggered when a user clicks on the link in the refund policy
    const viewLink = (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>, label: "terms" | "contact") => {
        e.preventDefault()

        //setting off the refund modal
        setReturnPolicyModal(false)

        if (label === "terms") {
            setModalBackground(false)
            window.open(`${domainName}/terms`, "_blank")
        } else if (label === "contact") {
            setContactModal(true)
        }
    }

  return (
    <div className={styles.main} style={{ display: returnPolicyModal ? "flex" : "none"}}>
          <div className={styles.text}>
            <header>
              <button onClick={(e) => closeModal(e)}>
                <CloseIcon />
              </button>
            </header>
            <div className={styles.brief}>
            <span className={styles.brief_1}>Return & Refund Policy</span>
                <ul>
                    <li>Refund if items arrived damaged, damaged goods should be reported & returned within 10days of receipt</li>
                    <li>Refund for packages lost in transit</li>
                    <li>Refund if not delivered with no tracking updates within 30 days</li>
                    <li>Refund if not delivered in 60 days</li>
                    <li>To learn more, check our <span className={styles.spanLink} onClick={(e) => viewLink(e, "terms")}>Terms</span> or <span className={styles.spanLink} onClick={(e) => viewLink(e, "contact")} >Contact</span> us</li>
                </ul>
                
              {/* <span id={styles.brief_2}> The more you shop, the more you save! Start adding to your cart now and unlock exclusive discounts.</span> */}
            </div>
            <button className={styles.continue} onClick={(e) => closeModal(e)}>Continue Shopping</button>
          </div>
        </div>
  );
};

export default ReturnModal;