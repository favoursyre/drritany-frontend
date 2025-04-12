"use client"
///Order Card component

///Libraries -->
import styles from "./orderCard.module.scss"
import Image from "next/image";
import { IProduct, IClientInfo, IAdmin, IOrder, ICountry, IEventStatus, PaymentStatus, DeliveryStatus } from "@/config/interfaces";
import { useState, MouseEvent, useEffect, ChangeEvent } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { backend, routeStyle, round, adminName, paymentStatuses, deliveryStatuses, clientInfoName, userIdName } from "@/config/utils";
import { useClientInfoStore, useModalBackgroundStore, useConfirmationModalStore, useLoadingModalStore } from "@/config/store";
import { MoreVert, DeleteOutlined, Edit, ThumbUpOffAlt, PreviewOutlined } from '@mui/icons-material';
import { getItem, notify } from "@/config/clientUtils";
import Loading from "@/components/loadingCircle/Circle";
import { countryList } from "@/config/database";

///Commencing the code 
/**
 * @title Order Card Component
 * @returns The Order Card component
 */
const OrderCard = ({ order_, view }: { order_: IOrder, view: string | undefined }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [order, setOrder] = useState<IOrder>({...order_})
    //const clientInfo = useClientInfoStore(state => state.info)
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo!)
    const router = useRouter()
    const routerPath = usePathname();
    const _userId = getItem(userIdName)
    const [userId, setUserId] = useState<string | undefined>(_userId!)
    const [deliveryStatus, setDeliveryStatus] = useState<IEventStatus>()
    const [paymentStatus, setPaymentStatus] = useState<IEventStatus>()
    const [adminUser, setAdminUser] = useState<IAdmin | null>(getItem(adminName))
    const setConfirmationModal = useConfirmationModalStore(state => state.setConfirmationModal);
    const confirmationModal = useConfirmationModalStore(state => state.modal);
    const confirmationChoice = useConfirmationModalStore(state => state.choice);
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground)
    const [admin, setAdmin] = useState<IAdmin>(getItem(adminName))
    const [totalPrice, setTotalPrice] = useState<number>(order.productSpec.overallTotalPrice!)
    const [clientCountry, setClientCountry] = useState<ICountry>(countryList.find((country) => country.name?.common === order.customerSpec.country)!)
    
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
            setModalBackground(false)
            setLoadingModal(false)
            //console.log("Client info detected")
        }  

    }, [clientInfo])

    useEffect(() => {
        //console.log("Loc: ", clientInfo)
        if (order.deliverySpec && order.paymentSpec) {
            const deliveryStatus_ = deliveryStatuses.find((status) => status.status === order.deliverySpec.status)
            setDeliveryStatus(() => deliveryStatus_)

            const paymentStatus_ = paymentStatuses.find((status) => status.status === order.paymentSpec.status)
            setPaymentStatus(() => paymentStatus_)
        }

        console.log("Choice: ", confirmationChoice)
        setOrder(() => order_)
    }, [clientInfo, order, order_, confirmationModal, confirmationChoice]);

    ///This handles what happens when a product is clicked
    const viewOrder = (e: MouseEvent<HTMLElement | SVGSVGElement, globalThis.MouseEvent>, _id: string) => {
        e.preventDefault()

        //Setting the loading modal
        setModalBackground(true)
        setLoadingModal(true)
        
        router.push(`/order/receipt/${order._id}`);

        //Setting the loading modal
        // setModalBackground(false)
        // setLoadingModal(false)
    }

    ///This handles on change
    const onChange = async (e: ChangeEvent<HTMLSelectElement>, event: string) => {
        e.preventDefault()

        //Set the loading modal
        setModalBackground(true)
        setLoadingModal(true)

        try {
            const _stat = e.target.value
            if (event === "payment") {
                const status = Object.values(PaymentStatus).find(status => status === _stat);
                order.paymentSpec.status = status!
            } else if (event === "delivery") {
                const status = Object.values(DeliveryStatus).find(status => status === _stat);
                order.deliverySpec.status = status!
            }

            //Sending updated data to backend for update
            const res = await fetch(`${backend}/order/${order._id}`, {
                method: 'PATCH',
                //body: JSON.stringify({ customerSpec, productSpec, clientInfo_ }),
                body: JSON.stringify(order),
                headers: {
                'Content-Type': 'application/json',
                },
            });
                
            const data = await res.json();
        
            console.log("Data: ", data);

            if (res.ok) {
                notify("success", "Order was successfully updated")
            }
        } catch (error) {
            notify("error", `${error}`)
            //setModalBackground(false)
        }
        
        //Setting off the loading modal
        setModalBackground(false)
        setLoadingModal(false)
        window.location.reload()
    }

    ///This handles what happens when preview order is clicked
    const previewOrder = async (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent> | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()
        console.log('Here')

        //Checking user priviledge
        if (adminUser && adminUser.superUser) {
            undefined
        } else {
            notify("error", "Permission Denied!")
            return
        }

        setIsLoading(true)
        const choice = confirm("Are you sure you want to delete this product?");
        console.log("Choice: ", choice)
        //setModalBackground(true)
        //setConfirmationModal(true)
        //console.log('Modal: ', confirmationModal)

        if(choice) {
            console.log("yes delete")
            ///Sending a delete request
            try {
                const res = await fetch(`${backend}/order/${order._id}`, {
                  method: "DELETE",
                  cache: "no-store",
                })
            
                if (res.ok) {
                    console.log("Res: ", res.json())
                    notify("success", "Order Deleted Successfully")
                    window.location.reload()
                }
            } catch (error) {
                console.error(error);
            }
        }
        
        setIsLoading(false)
        //router.push(`/admin/hjddkd/products/${p_id}`);
    }

    const getViewClass = (view: string | undefined) => {
        switch (view) {
            case "slide":
                return styles.slideView
            case "query":
                return styles.queryView
            default: 
                undefined
        }
    }

    return (
        <main className={`${styles.main} ${getViewClass(view)}`}>
            <div className={styles.bio} onClick={(e) => viewOrder(e, order._id!)}>
                <span>{order.customerSpec.fullName}</span>
                <span>{order.customerSpec.state}, {order.customerSpec.country}</span>
            </div>
            <div className={styles.price} onClick={(e) => viewOrder(e, order._id!)}>
                {clientInfo ? (
                    <span>{clientInfo?.country?.currency?.symbol}</span>
                ) : (
                    <></>
                )}
                {clientInfo?.country?.currency?.exchangeRate ? (
                    <span>
                        {round(totalPrice! * clientInfo?.country?.currency?.exchangeRate!, 2).toLocaleString("en-US")}
                    </span>
                ) : (
                    <></>
                )}
            </div>
            {paymentStatus ? (
                <div className={styles.paymentStatus} style={{ color: paymentStatus.color?.text, backgroundColor: paymentStatus.color?.background, fontWeight: "600" }}>
                    <span>{paymentStatus.status}</span>
                </div>
            ) : (
                <></>
            )}
            {deliveryStatus ? (
                <div className={styles.deliveryStatus} style={{ color: deliveryStatus.color?.text, backgroundColor: deliveryStatus.color?.background, fontWeight: "600" }}>
                    <span>{deliveryStatus.status}</span>
                </div>
            ) : (
                <></>
            )}
            {/* <span className={`${styles.status} ${product.active ? styles.activeStatus : ""}`}>{product.active ? "Active" : "Inactive"}</span> */}
            <div className={styles.actions_menu}>
                {/* <button className={styles.menu} onClick={(e) => deleteOrder(e)}>
                    {isLoading ? (
                        <Loading width="20px" height="20px" />
                    ) : (
                        <DeleteOutlined className={styles.icon} />
                    )}
                </button> */}
                {/* <button className={styles.menu}><MoreVert className={styles.icon} /></button> */}
                <div className={styles.actions}>
                    {/* <button className={styles.view}></button> */}
                    {/* <button className={styles.edit}><Edit className={styles.icon} /></button> */}
                    <button className={styles.delete}>
                        {isLoading ? (
                            <Loading width="20px" height="20px" />
                        ) : (
                            <PreviewOutlined className={styles.icon} onClick={(e) => viewOrder(e, order._id!)} />
                        )}
                    </button>
                    {/* {!product.active ? (
                        <button className={styles.activate}><ThumbUpOffAlt className={styles.icon} /></button>
                    ) : (<></>)} */}
                </div>
            </div>
        </main>
    );
};
  
export default OrderCard;