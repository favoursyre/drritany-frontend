"use client"
///Modal component

///Libraries -->
import styles from "./modal.module.scss"
import { useModalBackgroundStore } from "@/config/store";
import { MouseEvent, Suspense } from "react";
import ContactModal from "../contactModal/ContactModal";
import DiscountModal from "../discountModal/DiscountModal";
import OrderModal from "../orderModal/OrderModal";
import OrderFormModal from "../orderFormModal/OrderFormModal";
import ConfirmationModal from "../confirmationModal/ConfirmationModal";
import ImportProductModal from "../importProductModal/importProductModal";
import LoadingModal from "../loadingModal/LoadingModal";
import ReturnModal from "../returnModal/ReturnModal";
import CartProductDiscountModal from "../cartProductModal/CartProductModal";
import Loading from "@/components/loadingCircle/Circle";

///Commencing the code 
function Fallback() {
  return <Loading width="20px" height="20px" />
}

/**
 * @title Modal Component
 * @returns The Modal component
 */
const Modal = () => {
    const setModal = useModalBackgroundStore(state => state.setModalBackground);
    const modalBackground = useModalBackgroundStore(state => state.modal);

    ///This function is triggered when the background of the modal is clicked
    const closeModal = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        //setModal(false)
    }

  return (
    <div className={styles.main} style={{ display: modalBackground ? "flex" : "none" }} onClick={(e) => closeModal(e)}>
        <DiscountModal />
        <ContactModal />
        <ConfirmationModal />
        <OrderFormModal />
        <Suspense fallback={<Fallback />}>
            <OrderModal />
        </Suspense>
        {/* <OrderModal /> */}
        <ImportProductModal />
        <ReturnModal />
        <CartProductDiscountModal />
        <LoadingModal />
    </div>
  );
};

export default Modal;