"use client"
///Discount Modal component

///Libraries -->
import styles from "./discountModal.module.scss"
import { useModalBackgroundStore, useDiscountModalStore } from "@/config/store";
import { MouseEvent, useState, FormEvent } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

///Commencing the code 

/**
 * @title Discount Modal Component
 * @returns The Discount Modal component
 */
const DiscountModal = () => {
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setDiscountModal = useDiscountModalStore(state => state.setDiscountModal);
    const discountModal = useDiscountModalStore(state => state.modal);
    const discountProduct = useDiscountModalStore(state => state.product);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    ///This function is triggered when the background of the modal is clicked
    const closeModal = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()

        setModalBackground(false)
        setDiscountModal(false)
        console.log("modal closed: ", discountProduct.freeOption)
    }

  return (
    <div className={styles.main} style={{ display: discountModal ? "flex" : "none"}}>
          <div className={styles.image}>
            <Image
              className={styles.img}
              src={"https://drive.google.com/uc?export=download&id=1x1lpe6hIhrMGk5y-9jjs7Ry7cmhX4STS"}
              alt=""
              width={2448}
              height={1800}
            />
          </div>
          <div className={styles.text}>
            <header>
              <button onClick={(e) => closeModal(e)}>
                <CloseIcon />
              </button>
            </header>
            <div className={styles.brief}>
            <span className={styles.brief_1}>Don&apos;t miss out! The more you shop, the more you save!</span>
                <ul>
                    <li>Order 5 or more {discountProduct.name} products and enjoy an extra 10% discount off each item.</li>
                    {/* {discountProduct.freeOption === true ? (
                      <>
                        <li>Order 5 or more {discountProduct.name} products and get 1 extra free product.</li>
                        <li>Order 10 or more {discountProduct.name} products and get 2 extra free products.</li>
                      </>
                    ) : (
                      <></>
                    )} */}
                    
                </ul>
                
              {/* <span id={styles.brief_2}> The more you shop, the more you save! Start adding to your cart now and unlock exclusive discounts.</span> */}
            </div>
            <button className={styles.continue} onClick={(e) => closeModal(e)}>Continue Shopping</button>
          </div>
        </div>
  );
};

export default DiscountModal;