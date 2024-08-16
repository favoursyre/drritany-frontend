"use client"
///Confirmation Modal component

///Libraries -->
import styles from "./confirmationModal.module.scss"
import { useModalBackgroundStore, useConfirmationModalStore } from "@/config/store";
import { MouseEvent, useState, Fragment } from "react";
import Loading from "@/components/loadingCircle/Circle";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";

///Commencing the code 

/**
 * @title Confirmation Modal Component
 * @returns The Confirmation Modal component
 */
const ConfirmationModal = () => {
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()
    const setConfirmationModal = useConfirmationModalStore(state => state.setConfirmationModal);
    const setConfirmationChoice = useConfirmationModalStore(state => state.setConfirmationChoice);
    const confirmationModal = useConfirmationModalStore(state => state.modal);

    ///This function is triggered when the background of the modal is clicked
    const chooseChoice = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, choice: boolean): void => {
        e.preventDefault()
        
        setConfirmationChoice(choice)
        setModalBackground(false)
        setConfirmationModal(false)
        //console.log("modal closed")
    }

  return (
    <div className={styles.main} style={{ display: confirmationModal ? "flex" : "none"}}>
        <div className={styles.modal_head}>
            <button onClick={(e) => chooseChoice(e, false)} >
                <CloseIcon className={styles.icon} />
            </button>
        </div>
        <div className={styles.container}>
            {isLoading ? (
                <Loading width="20px" height="20px" />
            ) : (
                <Fragment>
                    <span className={styles.span2}>Are you sure you want to continue?</span>
                    <div className={styles.buttons}>
                        <button className={styles.button1} onClick={(e) => chooseChoice(e, false)}><span>No</span></button>
                        <button className={styles.button2} onClick={(e) => chooseChoice(e, true)}><span>Yes</span></button>
                    </div>
                </Fragment>
            )}
        </div>
    </div>
  );
};

export default ConfirmationModal;