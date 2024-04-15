"use client"
///Modal component

///Libraries -->
import styles from "./modal.module.scss"
import { useModalBackgroundStore } from "@/config/store";
import { MouseEvent } from "react";

///Commencing the code 

/**
 * @title Modal Component
 * @returns The Modal component
 */
const Modal = ({ children }: { children: React.ReactNode }) => {
    const setModal = useModalBackgroundStore(state => state.setModalBackground);
    const modalBackground = useModalBackgroundStore(state => state.modal);

    ///This function is triggered when the background of the modal is clicked
    const closeModal = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        setModal(false)
    }

  return (
    <div className={styles.main} style={{ display: modalBackground ? "flex" : "none"}}>
        {children}
    </div>
  );
};

export default Modal;