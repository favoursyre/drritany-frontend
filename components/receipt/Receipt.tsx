"use client"
///Order Receipt component

///Libraries -->
import Image from 'next/image';
import { useState, useEffect, MouseEvent, FormEvent } from 'react';
import styles from "./receipt.module.scss"
import { usePathname, useRouter } from 'next/navigation';
import { DeliveryStatus, ICountry, IEventStatus, IOrder, PaymentStatus, IButtonResearch, ICartItemDiscount, IClientInfo } from '@/config/interfaces';
import { formatDateMongo, companyName, deliveryPeriod, round, deliveryStatuses, paymentStatuses, deliveryDuration, getEachCartItemDiscount, storeButtonInfo, getCurrentDate, getCurrentTime, extractBaseTitle, userIdName, clientInfoName, calculateTotalSlashedPrice } from '@/config/utils';
import { useClientInfoStore, useModalBackgroundStore, useCartItemDiscountModalStore } from "@/config/store";
import { Remove, Add, DiscountOutlined } from '@mui/icons-material';
import { countryList } from '@/config/database';
import { getItem, getOS, getDevice } from '@/config/clientUtils';
//import { deliveryStatuses } from '@/config/clientUtils';

///Commencing the code 
/**
 * @title Order Receipt Component
 * @returns The Order Receipt component
 */
const OrderReceipt = ({ order_ }: { order_: IOrder }) => {
    const router = useRouter()
    const [order, setOrder] = useState<IOrder>(order_)
    const [startDeliveryDate, setStartDeliveryDate] = useState<string>("")
    const [endDeliveryDate, setEndDeliveryDate] = useState<string>("")
    const routerPath = usePathname()
    const [deliveryStatus, setDeliveryStatus] = useState<IEventStatus>()
    const [paymentStatus, setPaymentStatus] = useState<IEventStatus>()
    const [country, setCountry] = useState<ICountry | undefined>(countryList.find((country) => country?.name?.common === order.customerSpec.country))
    //const clientInfo = useClientInfoStore(state => state.info)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setCartItemDiscountModal = useCartItemDiscountModalStore(state => state.setCartItemDiscountModal)
    //const cartItemDiscountModal = useCartItemDiscountModalStore(state => state.modal)
    const setCartItemDiscount = useCartItemDiscountModalStore(state => state.setCartItemDiscount)
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo!)

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

    useEffect(() => {
        console.log("cart: ", order_)

        const createdAt = order?.createdAt as unknown as string
        // Convert the string to a Date object
        const date = new Date(createdAt);

        // Add 4 days to the date
        date.setDate(date.getDate() + deliveryPeriod);

        // Format the date
        const formattedDate = `${date.toLocaleString('en-US', { month: 'long' })} ${date.getDate()}`;

        date.setDate(date.getDate() + deliveryDuration);

        // Format the new date
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
        const formattedDate_ = date.toLocaleDateString('en-US', options);

        // Print the formatted date
        console.log(formattedDate);
        setStartDeliveryDate(() => formattedDate)
        setEndDeliveryDate(() => formattedDate_)

        if (order.deliverySpec && order.paymentSpec) {
            const deliveryStatus_ = deliveryStatuses.find((status) => status.status === order.deliverySpec.status)
            setDeliveryStatus(() => deliveryStatus_)

            const paymentStatus_ = paymentStatuses.find((status) => status.status === order.paymentSpec.status)
            setPaymentStatus(() => paymentStatus_)
        }
    }, [order, deliveryStatus, paymentStatus])

    //This function is trigered when a user wants to view the discount offer on each cart item
    const viewCartItemDiscount = async (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent> | MouseEvent<HTMLDivElement, globalThis.MouseEvent>, cartId: number) => {
        e.preventDefault()

        const cartItem: ICartItemDiscount = getEachCartItemDiscount(order.productSpec, cartId)
        console.log("Item: ", cartItem)
        setCartItemDiscount(cartItem)
        setModalBackground(true)
        setCartItemDiscountModal(true)

        //Storing this info in button research
        const info: IButtonResearch = {
            ID: clientInfo?._id!,
            IP: clientInfo?.ipData?.ip!,
            City: clientInfo?.ipData?.city!,
            Region: clientInfo?.ipData?.region!,
            Country: clientInfo?.ipData?.country!,
            Button_Name: "viewCartItemDiscount()",
            Button_Info: `Clicked discount icon in invoice`,
            Page_Title: extractBaseTitle(document.title),
            Page_URL: routerPath,
            Date: getCurrentDate(),
            Time: getCurrentTime(),
            OS: getOS(),
            Device: getDevice()
        }
        storeButtonInfo(info)
    }

  return (
    <div className={styles.main}>
        <h2><strong>Order Receipt</strong></h2>
        <span className={styles.mainBrief}>Thanks for patronizing {companyName}</span>
        <div className={styles.container}>
            <div className={styles.orderSection}>
                <div className={styles.orderId}>
                    <span><strong>ID:</strong></span>
                    <span className={styles.span2}>{order ? order._id : ""}</span>
                </div>
                <div className={styles.orderDate}>
                    <span><strong>Date:</strong></span>
                    <span>{order && order.createdAt ? formatDateMongo(order.createdAt) : ""}</span>
                </div>
            </div>
            <div className={styles.deliverySection}>
                <div className={styles.deliveryInfo}>
                    <div className={styles.deliveryDate}>
                        <span><strong>Delivered by</strong></span>
                        <span>{startDeliveryDate}-{endDeliveryDate}</span>
                    </div>
                    {deliveryStatus ? (
                        <div className={styles.deliveryStatus}>
                            <span><strong>Delivery Status</strong></span>
                            <span className={styles.text} style={{ color: deliveryStatus.color?.text, backgroundColor: deliveryStatus.color?.background, fontWeight: "600px" }}>{deliveryStatus.status}</span>
                        </div>
                    ) : (
                        <></>
                    )}
                    {paymentStatus ? (
                        <div className={styles.paymentStatus}>
                            <span><strong>Payment Status</strong></span>
                            <span className={styles.text} style={{ color: paymentStatus.color?.text, backgroundColor: paymentStatus.color?.background, fontWeight: "600px" }}>{paymentStatus.status}</span>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div className={styles.deliveryAddress}>
                    <span className={styles.title}><strong>Delivery Info</strong></span>
                    {order && order.customerSpec ? (
                        <>
                            <span className={styles.span}>{order.customerSpec.fullName}</span>
                            <span className={styles.span}>{order?.customerSpec.email}</span>
                            <span className={styles.span}>{order?.customerSpec.phoneNumbers[0]}</span>
                            <span className={styles.span}>{order?.customerSpec.deliveryAddress}</span>
                            <span className={styles.span}>{order?.customerSpec.municipality}, {order?.customerSpec.state}, {countryList.find((country) => country.name?.common === order?.customerSpec.country)?.name?.abbreviation}. {order.customerSpec.postalCode}</span>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div className={styles.cartList}>
                {order && order.productSpec ? order.productSpec.cart.map((p, id) => (
                    <div className={styles.cartItem} key={id}>
                        <div className={styles.cartImage}>
                            <Image
                                className={styles.img}
                                src={p.image.src}
                                alt=''
                                width={p.image.width}
                                height={p.image.height}
                            />
                        </div>
                        <div className={styles.cartSpecs}>
                            <span className={styles.cartName}>{p.name}</span>
                            {p.specs?.color ? (
                                <div className={styles.cart_color}>
                                    <strong>Color:</strong>
                                    {typeof p?.specs?.color === "string" ? (
                                        <div className={styles.color} style={{ backgroundColor: `${p?.specs?.color}` }}></div>
                                    ) : (
                                        <div className={styles.image}>
                                            <Image
                                                className={styles.img}
                                                src={p?.specs?.color.src!}
                                                alt=""
                                                width={p?.specs?.color.width!}
                                                height={p?.specs?.color.height!}
                                            /> 
                                        </div>
                                    )}
                                </div>
                            ) : (<></>)}
                            {p.specs?.size ? (
                                <div className={styles.cart_size}>
                                    <strong>Size:</strong>
                                    <span className={styles.size}>{typeof p.specs?.size === "string" ? p.specs?.size : p.specs?.size.size}</span>
                                </div>
                            ) : (<></>)}
                        </div>
                        <div className={styles.cartPriceQuantity} onClick={(e) => viewCartItemDiscount(e, id)}>
                            <span>
                                {country ? (
                                    <span>{country?.currency?.symbol}</span>
                                ) : (
                                    <></>
                                )}
                                {order.paymentSpec ? (
                                    <span>
                                        {round(p.subTotalPrice * order.paymentSpec.exchangeRate, 2).toLocaleString("en-US")}
                                    </span> 
                                ) : (
                                    <></>
                                )}
                                {getEachCartItemDiscount(order.productSpec, id).newXtraDiscount <= 0 ? (
                                    <></>
                                ) : (
                                    <DiscountOutlined className={styles.discountIcon} onClick={(e) => viewCartItemDiscount(e, id)} />
                                )}
                            </span>
                            <span>Qty: {p.quantity}</span>
                        </div>
                    </div>
                )) : (
                    <></>
                )}
                
            </div>
            <div className={styles.totalSection}>
                <div className={styles.subTotal}>
                    <span><strong>Gross Total</strong></span>
                    <span>
                        {country ? (
                            <span>{country?.currency?.symbol}</span>
                        ) : (
                            <></>
                        )}
                        {order && order.paymentSpec ? (
                            <span>
                                {round(calculateTotalSlashedPrice(order.productSpec) * order.paymentSpec.exchangeRate, 2).toLocaleString("en-US")}
                            </span> 
                        ) : (
                            <></>
                        )}
                    </span>
                </div>
                <div className={styles.discount}>
                    <span><strong>Total Discount</strong></span>
                    <div className={styles.amount}>
                        <Remove className={styles.minus} style={{ fontSize: "1rem" }} />
                        {country ? (
                            <span>{country?.currency?.symbol}</span>
                        ) : (
                            <></>
                        )}
                        {order && order.paymentSpec ? (
                            <span>
                                {round(order.productSpec.totalDiscount * order.paymentSpec.exchangeRate, 2).toLocaleString("en-US")}
                            </span> 
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <div className={styles.deliveryFee}>
                    <span><strong>Delivery Fee</strong></span>
                    <div className={styles.amount}>
                        <Add className={styles.add} style={{ fontSize: "1rem" }} />
                        {country ? (
                            <span>{country?.currency?.symbol}</span>
                        ) : (
                            <></>
                        )}
                        {order && order.paymentSpec ? (
                            <span>
                                {round(order.productSpec.deliveryFee * order.paymentSpec.exchangeRate, 2).toLocaleString("en-US")}
                            </span> 
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <div className={styles.tax}>
                    <span><strong>Tax</strong></span>
                    <div className={styles.amount}>
                        <Add className={styles.add} style={{ fontSize: "1rem" }} />
                        {country ? (
                            <span>{country?.currency?.symbol}</span>
                        ) : (
                            <></>
                        )}
                        {order && order.paymentSpec ? (
                            <span>
                                {round(order.productSpec.tax! * order.paymentSpec.exchangeRate, 2).toLocaleString("en-US")}
                            </span> 
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <div className={styles.total}>
                    <span><strong>Overall Total</strong></span>
                    <span>
                        {country ? (
                            <span>{country?.currency?.symbol}</span>
                        ) : (
                            <></>
                        )}
                        {order && order.paymentSpec ? (
                            <span>
                                {round(order.productSpec.overallTotalPrice! * order.paymentSpec.exchangeRate, 2).toLocaleString("en-US")}
                            </span> 
                        ) : (
                            <></>
                        )}
                    </span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default OrderReceipt;