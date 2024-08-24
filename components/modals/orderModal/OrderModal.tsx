"use client"
///Order Modal component

///Libraries -->
import styles from "./orderModal.module.scss"
import { useModalBackgroundStore, useOrderModalStore, useClientInfoStore } from "@/config/store";
import { MouseEvent, useState, FormEvent, useEffect } from "react";
import Loading from "@/components/loadingCircle/Circle";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { extraDeliveryFeeName, cartName, deliveryName, backend } from "@/config/utils";
import { ICart, ICustomerSpec, IClientInfo, IOrder, IDelivery, DeliveryStatus, IPayment, PaymentStatus } from "@/config/interfaces";
import { getItem, notify, removeItem, setItem } from "@/config/clientUtils";

///Commencing the code 

/**
 * @title Order Modal Component
 * @returns The Order Modal component
 */
const OrderModal = () => {
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setOrderModal = useOrderModalStore(state => state.setOrderModal);
    const orderModal = useOrderModalStore(state => state.modal);
    const [submit, setSubmit] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()
    const [cart, setCart] = useState<ICart | null>(getItem(cartName))
    const extraDeliveryFee__ = getItem(extraDeliveryFeeName)
    const [extraDeliveryFee, setExtraDeliveryFee] = useState<number>(extraDeliveryFee__ ? extraDeliveryFee__ : 0)
    const deliveryInfo__ = getItem(deliveryName)
    const [deliveryInfo, setDeliveryInfo] = useState<ICustomerSpec | undefined>(deliveryInfo__)
    const clientInfo = useClientInfoStore(state => state.info)

    useEffect(() => {
        //console.log("Client: ", clientInfo)
        const interval = setInterval(() => {
            setCart(() => getItem(cartName))
        }, 100);
    
        return () => {
            clearInterval(interval);
        };
        
    }, [cart]);

    ///This function is triggered when the background of the modal is clicked
    const closeModal = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()

        if (submit) {
            notify("info", "Redirecting you to homepage")
            router.push("/")
        }
        
        setModalBackground(false)
        setOrderModal(false)
        //console.log("modal closed")
    }

    ///This function processes the order
    const processOrder = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()
        setSubmit(true)

        if (cart) {
            setIsLoading(() => true)

            //Send the order to the backend
            try {
                //console.log('Clicked')
                const newDeliveryFee = cart.deliveryFee + extraDeliveryFee
                cart.deliveryFee = Number(newDeliveryFee.toFixed(2))
                setCart(() => ({ ...cart }))
                const productSpec: ICart = cart
                const clientInfo_ = clientInfo as unknown as IClientInfo
                const customerSpec: ICustomerSpec = deliveryInfo as unknown as ICustomerSpec
                const deliverySpec: IDelivery = {
                    status: DeliveryStatus.PENDING
                }
                const paymentSpec: IPayment = {
                    status: PaymentStatus.PENDING,
                    exchangeRate: clientInfo_.country?.currency?.exchangeRate!
                }
                const order: IOrder = { customerSpec, productSpec, deliverySpec, paymentSpec }
                const orderSpec = { order, clientInfo_}
                console.log("Order_: ", orderSpec)
                const res = await fetch(`${backend}/order`, {
                    method: 'POST',
                    //body: JSON.stringify({ customerSpec, productSpec, clientInfo_ }),
                    body: JSON.stringify(orderSpec),
                    headers: {
                    'Content-Type': 'application/json',
                    },
                });
                    
                const data = await res.json();
            
                console.log("Data: ", data);

                if (res.ok) {
                    
                    notify("success", `Your order was logged successfully`)
                    //setItem(cartName, undefined)
                    //setItem(cartName, undefined)
                    removeItem(cartName)
                    //console.log("cleared cart")
                    //setModalBackground(true)
                    //setOrderModal(true)

                    setIsLoading(() => false)

                    //Clear the cart
                    // const _cart_: ICart = {
                    //     totalPrice: 0,
                    //     totalDiscount: 0,
                    //     totalWeight: 0,
                    //     deliveryFee: 0,
                    //     cart: []
                    // }

                    
                } else {
                    //setModalState(() => false)
                    //notify("error", `Something went wrong`)
                    throw Error(`${data}`)
                }
                
                //setItem(orderName, order)

                //Send the user an email

                //Setting the modal state to true
                //setModalState(true)
            } catch (error) {
                console.log("error: ", error)
                setModalBackground(false)
                setOrderModal(false)
                notify("error", `${error}`)
            }

            //setModalState(() => false)
            setIsLoading(() => false)
        } else {
            notify('error', "Cart is empty")
            return
        }
    }

  return (
    <div className={styles.main} style={{ display: orderModal ? "flex" : "none"}}>
        <div className={styles.modal_head}>
            <button onClick={(e) => closeModal(e)} >
                <CloseIcon className={styles.icon} />
            </button>
        </div>
        {submit ? (
            <div className={styles.successContainer}>
                {isLoading ? (
                    <>
                        <Loading height="50px" width="50px" />
                        <span className={styles.loading}>Processing... Please wait</span>
                    </>
                ) : (
                    <>
                        <div className={styles.image}>
                            <Image
                                className={styles.img} 
                                src="https://drive.google.com/uc?export=download&id=16aHqsYZeXgATabkyTI_HN6jdglBYwvjz"
                                alt=""
                                width={221}
                                height={216}
                            />
                        </div>
                        <span>Order sucessfully processed! 🎉 Thanks for choosing us. Any questions? Just contact us</span>
                    </>
                )}
            </div>
        ) : (
            <div className={styles.checkContainer}>
                <span className={styles.span1}>Payment on Delivery</span>
                <span className={styles.span2}>By clicking <strong>Continue</strong>, you agree that you are fully physically and financially prepared to receive your delivery</span>
                <div className={styles.buttons}>
                    <button className={styles.button1} onClick={(e) => closeModal(e)}><span>Cancel</span></button>
                    <button className={styles.button2} onClick={(e) => processOrder(e)}><span>Continue</span></button>
                </div>
            </div>
        )}
    </div>
  );
};

export default OrderModal;