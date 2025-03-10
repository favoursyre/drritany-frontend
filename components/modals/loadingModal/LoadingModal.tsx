"use client"
///Loading Modal component

///Libraries -->
import styles from "./loadingModal.module.scss"
import { useModalBackgroundStore, useLoadingModalStore } from "@/config/store";
import { MouseEvent, useState, useEffect } from "react";
import Loading from "@/components/loadingCircle/Circle";

///Commencing the code 

/**
 * @title Loading Modal Component
 * @returns The Loading Modal component
 */
const LoadingModal = () => {
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const loadingModal = useLoadingModalStore(state => state.modal);
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal);

    useEffect(() => {
        //console.log("Client: ", clientInfo)
        // const interval = setInterval(() => {
        //     setCart(() => getItem(cartName))
        // }, 100);
    
        // return () => {
        //     clearInterval(interval);
        // };
        
    }, []);

    ///This function is triggered when the background of the modal is clicked
    const closeModal = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()
        
        setModalBackground(false)
        //setImportProductModal(false)
        //console.log("modal closed")
    }

  return (
    <div className={styles.main} style={{ display: loadingModal ? "flex" : "none"}}>
        <Loading height="20px" width="20px" />
    </div>
  );
};

export default LoadingModal;