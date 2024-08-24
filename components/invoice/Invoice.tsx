"use client"
///Order Invoice component

///Libraries -->
import Image from 'next/image';
import { useState, useEffect, MouseEvent, FormEvent } from 'react';
import styles from "./invoice.module.scss"
import { usePathname, useRouter } from 'next/navigation';
import { DeliveryStatus, ICountry, IEventStatus, IOrder, PaymentStatus } from '@/config/interfaces';
import { formatDateMongo, companyName, deliveryPeriod, round, deliveryStatuses, paymentStatuses } from '@/config/utils';
import { useClientInfoStore } from "@/config/store";
import { Remove, Add } from '@mui/icons-material';
import { countryList } from '@/config/database';
//import { deliveryStatuses } from '@/config/clientUtils';

///Commencing the code 
/**
 * @title Order Invoice Component
 * @returns The Order Invoice component
 */
const OrderInvoice = ({ order_ }: { order_: IOrder }) => {
    const router = useRouter()
    const [order, setOrder] = useState<IOrder>(order_)
    const [deliveryDate, setDeliveryDate] = useState<string>("")
    const routerPath = usePathname()
    const [deliveryStatus, setDeliveryStatus] = useState<IEventStatus>()
    const [paymentStatus, setPaymentStatus] = useState<IEventStatus>()
    const [country, setCountry] = useState<ICountry | undefined>(countryList.find((country) => country?.name?.common === order.customerSpec.country))
    const clientInfo = useClientInfoStore(state => state.info)

    //console.log("cart hh: ", paymentStatus)

    useEffect(() => {
        console.log("cart: ", order)

        const createdAt = order?.createdAt as unknown as string
        // Convert the string to a Date object
        const date = new Date(createdAt);

        // Add 4 days to the date
        date.setDate(date.getDate() + deliveryPeriod);

        // Format the date
        const formattedDate = `${date.toLocaleString('en-US', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;

        // Print the formatted date
        console.log(formattedDate);
        setDeliveryDate(() => formattedDate)

        if (order.deliverySpec && order.paymentSpec) {
            const deliveryStatus_ = deliveryStatuses.find((status) => status.status === order.deliverySpec.status)
            setDeliveryStatus(() => deliveryStatus_)

            const paymentStatus_ = paymentStatuses.find((status) => status.status === order.paymentSpec.status)
            setPaymentStatus(() => paymentStatus_)
        }
    }, [order?.createdAt, deliveryStatus, paymentStatus])

    //console.log("order: ", order ? formatDateMongo(order?.createdAt) : "")

  return (
    <div className={styles.main}>
        <h2><strong>Order Invoice</strong></h2>
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
                        <span><strong>Delivered On/Before</strong></span>
                        <span>{deliveryDate}</span>
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
                            <span>{order.customerSpec.fullName}</span>
                            <span>{order?.customerSpec.email}</span>
                            <span>{order?.customerSpec.phoneNumbers[0]}</span>
                            <span>{order?.customerSpec.deliveryAddress}</span>
                            <span>{order?.customerSpec.state}, {order?.customerSpec.country}</span>
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
                        <div className={styles.cartPriceQuantity}>
                            <span>
                                {country ? (
                                    <span>{country?.currency?.symbol}</span>
                                ) : (
                                    <></>
                                )}
                                {order.paymentSpec ? (
                                    <span>
                                        {round(p.subTotalPrice * order.paymentSpec.exchangeRate, 1).toLocaleString("en-US")}
                                    </span> 
                                ) : (
                                    <></>
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
                    <span><strong>Subtotal</strong></span>
                    <span>
                        {country ? (
                            <span>{country?.currency?.symbol}</span>
                        ) : (
                            <></>
                        )}
                        {order && order.paymentSpec ? (
                            <span>
                                {round(order.productSpec.totalPrice * order.paymentSpec.exchangeRate, 1).toLocaleString("en-US")}
                            </span> 
                        ) : (
                            <></>
                        )}
                    </span>
                </div>
                <div className={styles.discount}>
                    <span><strong>Discount</strong></span>
                    <div className={styles.amount}>
                        <Remove className={styles.minus} style={{ fontSize: "1rem" }} />
                        {country ? (
                            <span>{country?.currency?.symbol}</span>
                        ) : (
                            <></>
                        )}
                        {order && order.paymentSpec ? (
                            <span>
                                {round(order.productSpec.totalDiscount * order.paymentSpec.exchangeRate, 1).toLocaleString("en-US")}
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
                                {round(order.productSpec.deliveryFee * order.paymentSpec.exchangeRate, 1).toLocaleString("en-US")}
                            </span> 
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <div className={styles.total}>
                    <span><strong>Total</strong></span>
                    <span>
                        {country ? (
                            <span>{country?.currency?.symbol}</span>
                        ) : (
                            <></>
                        )}
                        {order && order.paymentSpec ? (
                            <span>
                                {round((order.productSpec.totalPrice - order.productSpec.totalDiscount + order.productSpec.deliveryFee) * order.paymentSpec.exchangeRate, 1).toLocaleString("en-US")}
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

export default OrderInvoice;