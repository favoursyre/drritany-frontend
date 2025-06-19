"use client"
///Order Modal component

///Libraries -->
import styles from "./orderModal.module.scss"
import { useModalBackgroundStore, useOrderModalStore, useClientInfoStore, useLoadingModalStore } from "@/config/store";
import { MouseEvent, useState, FormEvent, useEffect } from "react";
import Loading from "@/components/loadingCircle/Circle";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { extraDeliveryFeeName, cartName, deliveryName, backend, round, sleep, stripePublishableKey, clientInfoName, orderName, userIdName, transactionIdName, hashValue, extractBaseTitle, extractOnlyDigits, sendMetaCapi } from "@/config/utils";
import { ICart, ICustomerSpec, IClientInfo, IOrder, IDelivery, DeliveryStatus, IPayment, PaymentStatus, IMetaWebEvent, MetaActionSource, MetaStandardEvent } from "@/config/interfaces";
import { getItem, notify, removeItem, setItem, getFacebookCookies, getOS, getDevice } from "@/config/clientUtils";
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams } from 'next/navigation';
import { v4 as uuid } from "uuid";
import { countryList } from "@/config/database";
import { sendGTMEvent } from "@next/third-parties/google";

///Commencing the code
/**
 * @title Order Modal Component
 * @returns The Order Modal component
 */
const OrderModal = () => {
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setOrderModal = useOrderModalStore(state => state.setOrderModal);
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal);
    const orderModal = useOrderModalStore(state => state.modal);
    const [submit, setSubmit] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()
    const [cart, setCart] = useState<ICart | null>(getItem(cartName))
    const extraDeliveryFee__ = getItem(extraDeliveryFeeName)
    const [extraDeliveryFee, setExtraDeliveryFee] = useState<number>(extraDeliveryFee__ ? extraDeliveryFee__ : 0)
    const deliveryInfo__ = getItem(deliveryName)
    const [deliveryInfo, setDeliveryInfo] = useState<ICustomerSpec | undefined>(deliveryInfo__)
    const searchParams = useSearchParams()
    //const clientInfo = useClientInfoStore(state => state.info)
    const _userId = getItem(userIdName)
    const stripePromise = loadStripe(stripePublishableKey as string); 
    const [userId, setUserId] = useState<string | undefined>(_userId)
    const [txSessionId, setTxSessionId] = useState<string>("")
    const [paymentStatus, setPaymentStatus] = useState<string>("");
    const [paymentSuccess, setPaymentSuccess] = useState<"success" | "failed" | null>(null)
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo!)
    const [orderSent, setOrderSent] = useState<boolean>(false)

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

    ///This function processes the order
    const processOrder = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | void) => {
        if (e) {
            e.preventDefault()
        }

        if (orderSent) {
            console.log("order sent already")
            return
        }
        
        if (e) {
            setSubmit(true)
        }

        if (cart) {
            //setIsLoading(() => true)

            setModalBackground(true)

            //Send the order to the backend
            try {
                console.log("Testing: ", )
                const _deliveryFee = getItem("deliveryFee")
                //console.log('Clicked')
                //const newDeliveryFee = cart.deliveryFee + extraDeliveryFee
                cart.deliveryFee = _deliveryFee
                setCart(() => ({ ...cart }))
                
                const productSpec: ICart = cart
                const clientInfo_ = clientInfo as unknown as IClientInfo
                const customerSpec: ICustomerSpec = deliveryInfo as unknown as ICustomerSpec
                customerSpec.userId = getItem(userIdName)
                const deliverySpec: IDelivery = {
                    status: DeliveryStatus.PENDING
                }
                const paymentSpec: IPayment = {
                    txId: getItem(transactionIdName),
                    status: PaymentStatus.SUCCESS,
                    exchangeRate: clientInfo_.countryInfo?.currency?.exchangeRate!
                }
                console.log("Testing: ", _deliveryFee, getItem(transactionIdName), getItem(userIdName))
                const order: IOrder = { customerSpec, productSpec, deliverySpec, paymentSpec }
                const orderSpec = { order, clientInfo_}
                setModalBackground(true)
                console.log("Order_: ", orderSpec)
                //return
                const res = await fetch(`${backend}/order`, {
                    method: 'POST',
                    //body: JSON.stringify({ customerSpec, productSpec, clientInfo_ }),
                    body: JSON.stringify(orderSpec),
                    headers: {
                    'Content-Type': 'application/json',
                    },
                });
                setModalBackground(true)
                    
                const data = await res.json();
            
                console.log("Data: ", data);

                if (res.ok) {
                    setItem("orderId", data._id)
                    setModalBackground(true)
                    if (!orderSent) {
                        notify("success", `Your order was logged successfully`)
                    }
                    
                    setOrderSent(() => true)

                    //Deleting cart
                    removeItem(cartName)
                    removeItem("deliveryFee")
                    removeItem(transactionIdName)

                    //Adding this order to localstorage
                    // const _orders_ = getItem(orderName)
                    // if (_orders_) {
                    //     const newOrders = [..._orders_, data]
                    //     setItem(orderName, newOrders)
                    // } else {
                    //     setItem(orderName, data)
                    // }

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
                console.error("error: ", error)
                //setModalBackground(false)
                //setOrderModal(false)
                //notify("error", `${error}`)
            }

            //setModalState(() => false)
            //setIsLoading(() => false)
        } else {
            notify('error', "Cart is empty")
            return
        }
    }

    //Checking the url to know if stripe payment session is active
    useEffect(() => {
        const sessionId = searchParams.get('session_id')
        if (sessionId && !paymentStatus) {
            setSubmit(true)
            setIsLoading(true)

            //Checking the status of the payment
            const checkStatus = async () => {
                const response = await fetch(`${backend}/stripe-payment-status`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ sessionId: sessionId }),
                });
                const { status, error } = await response.json();
        
                if (error) {
                    setPaymentStatus(`error`);
                    notify("error", `${error}`)
                    setSubmit(false)
                    setIsLoading(false)
                    setOrderModal(false)
                    router.push("/cart")
                } else if (status === 'paid') {
                    setPaymentStatus('success');
                    setModalBackground(true)
                    await processOrder()
                    setModalBackground(true)

                    //Sending a purchase event
                    const countryInfo_ = clientInfo?.countryInfo //countryList.find((country) => country.name?.common === clientInfo?.ipData?.country)
                    const stateInfo_ = countryInfo_?.states?.find((state) => state.name === deliveryInfo?.state)
                    const eventTime = Math.round(new Date().getTime() / 1000)
                    const eventId = uuid()
                    const userAgent = navigator.userAgent
                    const { fbp, fbc } = getFacebookCookies();
                    const eventData: IMetaWebEvent = {
                        data: [
                            {
                                event_name: MetaStandardEvent.Purchase,
                                event_time: eventTime,
                                event_id: eventId,
                                action_source: MetaActionSource.website,
                                custom_data: {
                                    content_name: extractBaseTitle(document.title),
                                    content_ids:  cart?.cart.map((item) => item._id),
                                    content_type: cart?.cart.length === 1 ? "product" : "product_group",
                                    value: round((cart?.overallTotalPrice! * countryInfo_?.currency?.exchangeRate!), 2),
                                    currency: countryInfo_?.currency?.abbreviation,
                                    order_id: getItem("orderId"),
                                    contents: cart?.cart.map((item) => ({
                                        id: item._id,
                                        //name: item.name,
                                        quantity: item.quantity,
                                        item_price: item.subTotalPrice,
                                    }))
                                },
                                user_data: {
                                    client_user_agent: userAgent,
                                    client_ip_address: clientInfo?.ipData?.ip!,
                                    external_id: hashValue(clientInfo?._id!),
                                    fbc: fbc!,
                                    fbp: fbp!,
                                    ct: hashValue(deliveryInfo?.municipality?.trim().toLowerCase()!),
                                    st: hashValue(stateInfo_?.abbreviation?.trim().toLowerCase()!),
                                    country: hashValue(countryInfo_?.name?.abbreviation?.trim().toLowerCase()!),
                                    em: [hashValue(deliveryInfo?.email.trim().toLowerCase()!)],
                                    ph: [hashValue(extractOnlyDigits(deliveryInfo?.phoneNumbers[0]!).trim())],
                                    zp: hashValue(deliveryInfo?.postalCode?.trim()!)
                                },
                                original_event_data: {
                                    event_name: MetaStandardEvent.Purchase,
                                    event_time: eventTime,
                                }
                            }
                        ]
                    } 
                    sendGTMEvent({ event: eventData.data[0].event_name, value: eventData.data[0] })
                    await sendMetaCapi(eventData, clientInfo?._id!, getOS(), getDevice())

                    //setIsLoading(false)
                    //notify('success', "Payment was successful")

                    notify("info", "Redirecting you to orders")
                    removeItem("orderId")
                    await sleep(3)
                    router.push(`/order?userId=${userId}`)
                    
                    // setModalBackground(false)
                    // setOrderModal(false)
                } else if (status === 'canceled') {
                    setPaymentStatus('fail');
                    setSubmit(false)
                    setIsLoading(false)
                    setOrderModal(false)
                    notify('error', "Payment was cancelled, try again later!")
                    router.push("/cart")
                }
                console.log("Payment Status: ", status)
                //notify("info", status)
            };
    
            checkStatus();
        } else if (!sessionId || paymentStatus) {
            return
        }
    }, [paymentStatus, router, searchParams]);

    useEffect(() => {
        //console.log("Client: ", clientInfo)
        const interval = setInterval(() => {
            setCart(() => getItem(cartName))
        }, 100);
    
        return () => {
            clearInterval(interval);
        };
        
    }, [cart]);

    // Check session status after redirect
//   useEffect(() => {
//     const returnedSessionId = searchParams.get('session_id');
//     if (returnedSessionId && returnedSessionId === txSessionId && !paymentStatus) {
//       const checkStatus = async () => {
//         const response = await fetch(`${backend}/stripe-payment-status`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ sessionId: returnedSessionId }),
//         });
//         const { status, error } = await response.json();

//         if (error) {
//           setPaymentStatus(`Error: ${error}`);
//         } else if (status === 'paid') {
//           setPaymentStatus('Payment Successful!');
//         } else if (status === 'canceled') {
//           setPaymentStatus('Payment was canceled.');
//         }
//         console.log("Payment Status: ", status)
//         notify("info", status)
//       };

//       checkStatus();
//       //console.log("Payment Status: ", status)
//     }
//   }, [searchParams, txSessionId, paymentStatus]);

    ///This function is triggered when the background of the modal is clicked
    const closeModal = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): Promise<void> => {
        e.preventDefault()

        setOrderModal(false)

        if (submit && paymentStatus === "success") {
            //Setting loading modal
            //setModalBackground(true)
            setLoadingModal(true)
            
            await sleep(0.3)

            //notify("info", "Redirecting you to products page")
            router.push(`/order?userId=${userId}`)
        }
        
        setModalBackground(false)
        //setOrderModal(false)
        //console.log("modal closed")
    }

    const handlePayment = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        console.log("Processing the payment...")
        const productSpec: ICart = cart!
        const amount_ = round(productSpec.overallTotalPrice!, 2).toString()
        const _amt = productSpec.grossTotalPrice - productSpec.totalDiscount + productSpec.deliveryFee
        //const _amt_ = round((productSpec.grossTotalPrice - getCartDiscount() + getCartDeliveryFee()) * clientInfo?.country?.currency?.exchangeRate!, 1)
        //cart.grossTotalPrice - getCartDiscount() + getCartDeliveryFee()
        //console.log("Amount: ", amount_, productSpec, _amt)
        //console.log("Data: ", productSpec.grossTotalPrice, productSpec.totalDiscount, productSpec.deliveryFee, productSpec.grossTotalPrice - productSpec.totalDiscount + productSpec.deliveryFee)
        //Setting on the loading modal
        //setModalBackground(true)
        //setOrderModal(false)
        //setLoadingModal(true)
        //return
        setSubmit(true)
        setIsLoading(true)

        //Sending an initiate checkout event
        const countryInfo_ = clientInfo?.countryInfo //countryList.find((country) => country.name?.common === clientInfo?.ipData?.country)
        const stateInfo_ = countryInfo_?.states?.find((state) => state.name === deliveryInfo?.state)
        const eventTime = Math.round(new Date().getTime() / 1000)
        const eventId = uuid()
        const userAgent = navigator.userAgent
        const { fbp, fbc } = getFacebookCookies();
        const eventData: IMetaWebEvent = {
            data: [
                {
                    event_name: MetaStandardEvent.InitiateCheckout,
                    event_time: eventTime,
                    event_id: eventId,
                    action_source: MetaActionSource.website,
                    custom_data: {
                        content_name: extractBaseTitle(document.title),
                        content_ids:  cart?.cart.map((item) => item._id),
                        content_type: cart?.cart.length === 1 ? "product" : "product_group",
                        value: round((cart?.overallTotalPrice! * countryInfo_?.currency?.exchangeRate!), 2),
                        currency: countryInfo_?.currency?.abbreviation,
                        num_items: productSpec.cart.reduce((total, item) => total + item.quantity, 0).toString(),
                        contents: productSpec.cart.map((item) => ({
                            id: item._id,
                            //name: item.name,
                            quantity: item.quantity,
                            item_price: item.subTotalPrice,
                        }))
                    },
                    user_data: {
                        client_user_agent: userAgent,
                        client_ip_address: clientInfo?.ipData?.ip!,
                        external_id: hashValue(clientInfo?._id!),
                        fbc: fbc!,
                        fbp: fbp!,
                        ct: hashValue(deliveryInfo?.municipality?.trim().toLowerCase()!),
                        st: hashValue(stateInfo_?.abbreviation?.trim().toLowerCase()!),
                        country: hashValue(countryInfo_?.name?.abbreviation?.trim().toLowerCase()!),
                        em: [hashValue(deliveryInfo?.email.trim().toLowerCase()!)],
                        ph: [hashValue(extractOnlyDigits(deliveryInfo?.phoneNumbers[0]!).trim())],
                        zp: hashValue(deliveryInfo?.postalCode?.trim()!)
                    },
                    original_event_data: {
                        event_name: MetaStandardEvent.InitiateCheckout,
                        event_time: eventTime,
                    }
                }
            ]
        } 
        sendGTMEvent({ event: eventData.data[0].event_name, value: eventData.data[0] })
        await sendMetaCapi(eventData, clientInfo?._id!, getOS(), getDevice())

        try {
          const stripe = await stripePromise;
          if (!stripe) throw new Error('Stripe failed to load');

          const currency = clientInfo?.countryInfo?.currency
          const unitAmount = Math.round(parseFloat(amount_) * 100);
          const txId_ = `idp_tx_${Date.now()}` //Unique id for this payment
          setItem(transactionIdName, txId_)
    
          const response = await fetch(`${backend}/stripe-checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currency: currency, amount: unitAmount, txId: txId_ }),
          });
    
          const { sessionId, error } = await response.json();
          if (error) throw new Error(error);

          console.log('Session ID: ', sessionId)
          setTxSessionId(() => sessionId)
    
          const { error: redirectError } = await stripe.redirectToCheckout({
            sessionId,
          });
    
          if (redirectError) {
            console.error('Redirect error:', redirectError.message);
            throw new Error(redirectError.message);
          }
        } catch (error: any) {
          console.error('Payment error:', error.message);
          notify("error", error.message)
          setSubmit(false)
          setIsLoading(false)
          setOrderModal(false)
          setModalBackground(false)
          //alert(`An error occurred: ${error.message}`);
        } finally {
            //Setting off the laoding modal
            //setModalBackground(false)
            //setLoadingModal(false)
        }

      };

    //This functiion is trigerred when a user clicks on view receipt
    const viewReceipt = (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        //Setting the necessary modals
        setOrderModal(false)
        setLoadingModal(true)

        //Pass the route link here
        //router.push(`/order/receipt/${order}`)
    }

    //This function is used to view terms 
    const viewTerms = (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
        //Setting the necessary modals
        setOrderModal(false)
        setLoadingModal(true)

        //Pass the route link here
        router.push(`/terms`)

        setModalBackground(false)
        setLoadingModal(false)
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
                        <span className={styles.thanks}>Order sucessfully processed! 🎉 Thanks for choosing us.</span>
                    </>
                )}
            </div>
        ) : (
            <div className={styles.checkContainer}>
                <span className={styles.span1}>Payment</span>
                <span className={styles.span2}>By clicking <strong>Continue</strong>, you agree to our <span onClick={(e) => viewTerms(e)} className={styles.terms}><strong>Terms</strong></span> and your delivery information been correct</span>
                <div className={styles.buttons}>
                    <button className={styles.button1} onClick={(e) => closeModal(e)}><span>Cancel</span></button>
                    <button className={styles.button2} onClick={(e) => handlePayment(e)}><span>Continue</span></button>
                </div>
            </div>
        )}
    </div>
  );
};

export default OrderModal;