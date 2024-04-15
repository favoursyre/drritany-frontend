///This acts as store for generally used state variables

///Libraries -->
import { create } from "zustand";
import { IModalBackgroundStore, IContactModalStore, IDiscountModalStore, IOrderModalStore } from "@/config/interfaces";

//Commencing code -->

//Modal Background state store
export const useModalBackgroundStore = create<IModalBackgroundStore>((set) => ({
    modal: false,
    setModalBackground: (status) => set(() => ({ modal: status }))
}))

//Contact Modal state store
export const useContactModalStore = create<IContactModalStore>((set) => ({
    modal: false,
    setContactModal: (status) => set(() => ({ modal: status }))
}))

//Order Modal state store
export const useOrderModalStore = create<IOrderModalStore>((set) => ({
    modal: false,
    setOrderModal: (status) => set(() => ({ modal: status }))
}))

//Discount Modal state store
export const useDiscountModalStore = create<IDiscountModalStore>((set) => ({
    modal: false,
    product: { name: "", freeOption: false, poppedUp: false },
    setDiscountModal: (status) => set(() => ({ modal: status })),
    setDiscountProduct: (product) => set(() => ({ product: product }))
}))