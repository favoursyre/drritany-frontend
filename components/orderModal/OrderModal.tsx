"use client"
///Order Modal component

///Libraries -->
import styles from "./orderModal.module.scss"
import { useModalBackgroundStore, useOrderModalStore } from "@/config/store";
import { MouseEvent, useState, FormEvent } from "react";
import Loading from "../loadingCircle/Circle";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { useRouter } from "next/navigation";

///Commencing the code 

/**
 * @title Order Modal Component
 * @returns The Order Modal component
 */
const OrderModal = () => {
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setOrderModal = useOrderModalStore(state => state.setOrderModal);
    const orderModal = useOrderModalStore(state => state.modal);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    ///This function is triggered when the background of the modal is clicked
    const closeModal = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()

        router.push("/")
        setModalBackground(false)
        setOrderModal(false)
        //console.log("modal closed")
    }

  return (
    <div className={styles.main} style={{ display: orderModal ? "flex" : "none"}}>
        <div className={styles.modal_head}>
            <button onClick={(e) => closeModal(e)} >
                <CloseIcon className={styles.icon} />
            </button>
        </div>
        <div className={styles.image}>
            <Image
                className={styles.img} 
                src="https://drive.google.com/uc?export=download&id=16aHqsYZeXgATabkyTI_HN6jdglBYwvjz"
                alt=""
                width={221}
                height={216}
            />
        </div>
        <span className={styles.span1}>Order sucessfully processed! 🎉 Thanks for choosing us. Any questions? Just ask! Happy shopping!</span>
    </div>
  );
};

export default OrderModal;