"use client"
///Cart Product Discount Modal component

///Libraries -->
import styles from "./cartProductModal.module.scss"
import { useModalBackgroundStore, useCartItemDiscountModalStore, useClientInfoStore } from "@/config/store";
import { MouseEvent, useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { round } from "@/config/utils";
import { IClientInfo } from "@/config/interfaces";
import { getItem } from "@/config/clientUtils";
import { clientInfoName } from "@/config/utils";

///Commencing the code 

/**
 * @title Cart Product Modal Component
 * @returns The Cart Product Modal component
 */
const CartProductDiscountModal = () => {
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setCartItemDiscountModal = useCartItemDiscountModalStore(state => state.setCartItemDiscountModal);
    const cartItemDiscountModal = useCartItemDiscountModalStore(state => state.modal);
    const cartItem = useCartItemDiscountModalStore(state => state.cartItem);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    //const clientInfo = useClientInfoStore(state => state.info)
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo!)
  
    //Updating client info
    useEffect(() => {
        //console.log("Hero: ", _clientInfo, clientInfo)
  
        let _clientInfo_
        
        if (!clientInfo) {
            //console.log("Client info not detected")
            const interval = setInterval(() => {
                _clientInfo_ = getItem(clientInfoName)
                //console.log("Delivery Info: ", _deliveryInfo)
                setClientInfo(_clientInfo_)
            }, 100);
    
            //console.log("Delivery Info: ", deliveryInfo)
        
            return () => {
                clearInterval(interval);
            };
        } else {
            //console.log("Client info detected")
        }  
  
    }, [clientInfo])

    ///This function is triggered when the background of the modal is clicked
    const closeModal = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()

        setModalBackground(false)
        setCartItemDiscountModal(false)
        //console.log("modal closed: ", discountProduct.freeOption)
    }

  return (
    <div className={styles.main} style={{ display: cartItemDiscountModal ? "flex" : "none"}}>
          <div className={styles.image}>
            {cartItem ? (
                <Image
                    className={styles.img}
                    src={cartItem?.img?.src!}
                    alt=""
                    width={cartItem?.img?.width!}
                    height={cartItem?.img?.height!}
                />
            ) : (
                <></>
            )}
          </div>
          <div className={styles.text}>
            <header>
              <button onClick={(e) => closeModal(e)}>
                <CloseIcon />
              </button>
            </header>
            <div className={styles.brief}>
            <span className={styles.brief_1}>Don&apos;t miss out! The more you shop, the more you save!</span>
                {clientInfo && cartItem ? (
                    <ul>
                        <li>Extra {round(cartItem.newXtraDiscount, 1).toLocaleString("en-US")}% discount</li>
                        <li>You save {clientInfo.country?.currency?.symbol}{round(cartItem.discountedPrice * clientInfo?.country?.currency?.exchangeRate!, 1).toLocaleString("en-US")}</li>
                        <li>Old Price: {clientInfo.country?.currency?.symbol}{round(cartItem.oldPrice * clientInfo?.country?.currency?.exchangeRate!, 1).toLocaleString("en-US")}</li>
                        <li>New Price: {clientInfo.country?.currency?.symbol}{round(cartItem.newPrice * clientInfo?.country?.currency?.exchangeRate!, 1).toLocaleString("en-US")}</li>
                    </ul>
                ) : (
                    <></>
                )}
              {/* <span id={styles.brief_2}> The more you shop, the more you save! Start adding to your cart now and unlock exclusive discounts.</span> */}
            </div>
            <button className={styles.continue} onClick={(e) => closeModal(e)}>Continue Shopping</button>
          </div>
        </div>
  );
};

export default CartProductDiscountModal;