"use client"
///Order Invoice component

///Libraries -->
import Image from 'next/image';
import { useState, useEffect, MouseEvent, FormEvent } from 'react';
import styles from "./invoice.module.scss"
import { usePathname, useRouter } from 'next/navigation';
import { IOrder } from '@/config/interfaces';
import { formatDateMongo, companyName, deliveryPeriod, round } from '@/config/utils';
import { useClientInfoStore } from "@/config/store";

///Commencing the code 
/**
 * @title Order Invoice Component
 * @returns The Order Invoice component
 */
const OrderInvoice = ({ cart_ }: { cart_: IOrder }) => {
    const router = useRouter()
    const [cart, setCart] = useState<IOrder | undefined>(cart_)
    const [deliveryDate, setDeliveryDate] = useState<string>("")
    const routerPath = usePathname()
    const clientInfo = useClientInfoStore(state => state.info)

    //console.log("cart: ", cart)

    useEffect(() => {
        console.log("cart: ", cart)

        const createdAt = cart?.createdAt as unknown as string
        // Convert the string to a Date object
        const date = new Date(createdAt);

        // Add 4 days to the date
        date.setDate(date.getDate() + deliveryPeriod);

        // Format the date
        const formattedDate = `${date.toLocaleString('en-US', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;

        // Print the formatted date
        console.log(formattedDate);
        setDeliveryDate(() => formattedDate)
    }, [cart?.createdAt])

    //console.log("cart: ", cart ? formatDateMongo(cart?.createdAt) : "")

  return (
    <div className={styles.main}>
        <h2><strong>Order Invoice</strong></h2>
        <span className={styles.mainBrief}>Thank&apos;s for patronizing {companyName}</span>
        <div className={styles.container}>
            <div className={styles.orderSection}>
                <div className={styles.orderId}>
                    <span><strong>ID:</strong></span>
                    <span className={styles.span2}>{cart ? cart._id : ""}</span>
                </div>
                <div className={styles.orderDate}>
                    <span><strong>Date:</strong></span>
                    <span>{cart && cart.createdAt ? formatDateMongo(cart.createdAt) : ""}</span>
                </div>
            </div>
            <div className={styles.deliverySection}>
                <div className={styles.deliveryDate}>
                    <span><strong>Estimated Delivery Date</strong></span>
                    <span>{deliveryDate}</span>
                </div>
                <div className={styles.deliveryAddress}>
                    <span><strong>Delivery Info</strong></span>
                    {cart && cart.customerSpec ? (
                        <>
                            <span>{cart.customerSpec.fullName}</span>
                            <span>{cart?.customerSpec.email}</span>
                            <span>{cart?.customerSpec.phoneNumbers[0]}</span>
                            <span>{cart?.customerSpec.deliveryAddress}</span>
                            <span>{cart?.customerSpec.state}, {cart?.customerSpec.country}</span>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div className={styles.cartList}>
                {cart && cart.productSpec ? cart.productSpec.cart.map((c, id) => (
                    <div className={styles.cartItem} key={id}>
                        <div className={styles.cartImage}>
                            <Image
                                className={styles.img}
                                src={c.image.src}
                                alt=''
                                width={c.image.width}
                                height={c.image.height}
                            />
                        </div>
                        <div className={styles.cartName}>
                            <span>{c.name}</span>
                        </div>
                        <div className={styles.cartPriceQuantity}>
                            <span>
                                {clientInfo ? (
                                    <span>{clientInfo?.country?.currency?.symbol}</span>
                                ) : (
                                    <></>
                                )}
                                {clientInfo?.country?.currency?.exchangeRate ? (
                                    <span>
                                        {round(c.subTotalPrice * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")}
                                    </span> 
                                ) : (
                                    <></>
                                )}
                            </span>
                            <span>Qty: {c.quantity}</span>
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
                        {clientInfo ? (
                            <span>{clientInfo?.country?.currency?.symbol}</span>
                        ) : (
                            <></>
                        )}
                        {cart && clientInfo?.country?.currency?.exchangeRate ? (
                            <span>
                                {round(cart.productSpec.totalPrice * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")}
                            </span> 
                        ) : (
                            <></>
                        )}
                    </span>
                </div>
                <div className={styles.discount}>
                    <span><strong>Discount</strong></span>
                    <span>
                        {clientInfo ? (
                            <span>{clientInfo?.country?.currency?.symbol}</span>
                        ) : (
                            <></>
                        )}
                        {cart && clientInfo?.country?.currency?.exchangeRate ? (
                            <span>
                                {round(cart.productSpec.totalDiscount * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")}
                            </span> 
                        ) : (
                            <></>
                        )}
                    </span>
                </div>
                <div className={styles.deliveryFee}>
                    <span><strong>Delivery Fee</strong></span>
                    <span>
                        {clientInfo ? (
                            <span>{clientInfo?.country?.currency?.symbol}</span>
                        ) : (
                            <></>
                        )}
                        {cart && clientInfo?.country?.currency?.exchangeRate ? (
                            <span>
                                {round(cart.productSpec.deliveryFee * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")}
                            </span> 
                        ) : (
                            <></>
                        )}
                    </span>
                </div>
                <div className={styles.total}>
                    <span><strong>Total</strong></span>
                    <span>
                        {clientInfo ? (
                            <span>{clientInfo?.country?.currency?.symbol}</span>
                        ) : (
                            <></>
                        )}
                        {cart && clientInfo?.country?.currency?.exchangeRate ? (
                            <span>
                                {round((cart.productSpec.totalPrice - cart.productSpec.totalDiscount + cart.productSpec.deliveryFee) * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")}
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