///This acts as store for generally used state variables

///Libraries -->
import { create } from "zustand";
import { IModalBackgroundStore, IAdminSideBarStore, IImportProductModalStore, IProduct, IContactModalStore, IDiscountModalStore, IOrderModalStore, IClientInfoStore, IOrderFormModalStore, IConfirmationModalStore, ILoadingModalStore,IReturnPolicyModalStore, ICartItemDiscountModalStore } from "@/config/interfaces";
import { getItem } from "./clientUtils";
import { clientInfoName } from "./utils";

//Commencing code -->

//Modal Background state store
export const useModalBackgroundStore = create<IModalBackgroundStore>((set) => ({
    modal: true,
    setModalBackground: (status) => set(() => ({ modal: status }))
}))

//Contact Modal state store
export const useContactModalStore = create<IContactModalStore>((set) => ({
    modal: false,
    setContactModal: (status) => set(() => ({ modal: status }))
}))

//Contact Modal state store
export const useConfirmationModalStore = create<IConfirmationModalStore>((set) => ({
    modal: false,
    choice: false,
    setConfirmationModal: (status) => set(() => ({ modal: status })),
    setConfirmationChoice: (status) => set(() => ({ choice: status }))
}))

//Return Policy Modal state store
export const useReturnPolicyModalStore = create<IReturnPolicyModalStore>((set) => ({
    modal: false,
    setReturnPolicyModal: (status) => set(() => ({ modal: status })),
}))

//Loading Modal state store
export const useLoadingModalStore = create<ILoadingModalStore>((set) => ({
    modal: true,
    setLoadingModal: (status) => set(() => ({ modal: status }))
}))

//Order state store
export const useOrderModalStore = create<IOrderModalStore>((set) => ({
    modal: false,
    setOrderModal: (status) => set(() => ({ modal: status }))
}))

//Import Product state store
export const useImportProductModalStore = create<IImportProductModalStore>((set) => ({
    modal: false,
    setImportProductModal: (status) => set(() => ({ modal: status }))
}))

//Order Form state store
export const useOrderFormModalStore = create<IOrderFormModalStore>((set) => ({
    modal: false,
    setOrderFormModal: (status) => set(() => ({ modal: status }))
}))

//Discount Modal state store
export const useDiscountModalStore = create<IDiscountModalStore>((set) => ({
    modal: false,
    product: { data: undefined!, poppedUp: false },
    setDiscountModal: (status) => set(() => ({ modal: status })),
    setDiscountProduct: (product) => set(() => ({ product: product }))
}))

//Cart Item Discount Modal state store
export const useCartItemDiscountModalStore = create<ICartItemDiscountModalStore>((set) => ({
    modal: false,
    cartItem: undefined!,
    setCartItemDiscountModal: (status) => set(() => ({ modal: status })),
    setCartItemDiscount: (cartItem) => set(() => ({ cartItem: cartItem }))
}))

//Client Info State Store
export const useClientInfoStore = create<IClientInfoStore>((set) => ({
    info: undefined,
    setClientInfo: (info) => set(() => ({ info: info }))
})) 

//Admin Menu Bar State Store
export const useAdminSideBarStore = create<IAdminSideBarStore>((set) => ({
    status: false,
    setAdminSideBar: (status) => set(() => ({ status: status }))
})) 