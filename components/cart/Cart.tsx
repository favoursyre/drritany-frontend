"use client"
///Cart component

///Libraries -->
import { useState, useEffect, MouseEvent } from 'react';
import styles from "./cart.module.scss"
import { setItem, getItem, notify } from '@/config/clientUtils';
import { cartName, round, getDeliveryFee, sleep, deliveryName, extraDeliveryFeeName } from '@/config/utils';
import { ICart, ICartItem, IClientInfo, ICustomerSpec } from '@/config/interfaces';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useClientInfoStore, useOrderFormModalStore, useModalBackgroundStore, useOrderModalStore } from "@/config/store";
import { DeleteOutline, AddShoppingCart, ProductionQuantityLimits, LocalShipping, Remove, Add, Close, EditNote } from '@mui/icons-material';

///Commencing the code 
/**
 * @title Cart Component
 * @returns The Cart component
 */
const Cart = () => {
    const cart__ = getItem(cartName)
    const [cart, setCart] = useState<ICart | null>(cart__)
    const extraDeliveryFee__ = getItem(extraDeliveryFeeName)
    const [extraDeliveryFee, setExtraDeliveryFee] = useState<number>(extraDeliveryFee__ ? extraDeliveryFee__ : 0)
    const deliveryInfo__ = getItem(deliveryName)
    const [deliveryInfo, setDeliveryInfo] = useState<ICustomerSpec | undefined>(deliveryInfo__)
    const [deleteIndex, setDeleteIndex] = useState(Number)
    const [deleteModal, setDeleteModal] = useState(false)
    const router = useRouter()
    const routerPath = usePathname();
    const clientInfo = useClientInfoStore(state => state.info)
    const orderForm = useOrderFormModalStore(state => state.modal)
    const setOrderForm = useOrderFormModalStore(state => state.setOrderFormModal)
    const setOrderModal = useOrderModalStore(state => state.setOrderModal)
    const modalBackground = useModalBackgroundStore(state => state.modal);
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
  //const [clientInfo, setClientInfo] = useState<IClientInfo | null>(clientInfo_ ? JSON.parse(clientInfo_) : null)
//   console.log('Current page:', cart.length);

//   if (cart.length === undefined) {
//     console.log("Length: ", cart.length)
//   }

useEffect(() => {
    console.log("Client: ", clientInfo)
    const interval = setInterval(() => {
        //setModalState(() => getModalState())
        //console.log("deliveryInfo has changed: ", {name: "syre", age: 2} === {name: "syre", age: 1})
      }, 100);
  
      return () => {
        clearInterval(interval);
      };
    
  }, [deleteIndex, cart, orderForm, extraDeliveryFee, deliveryInfo]);

    ///This function increases the amount of quantity
    const increaseQuantity = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, index: number): void => {
        e.preventDefault()
        if (cart !== null) {
            cart.cart[index].quantity = cart.cart[index].quantity + 1
            cart.cart[index].subTotalPrice = cart.cart[index].quantity * cart.cart[index].unitPrice
            cart.cart[index].subTotalWeight = cart.cart[index].quantity * cart.cart[index].unitWeight
            cart.cart[index].subTotalDiscount = cart.cart[index].extraDiscount && cart.cart[index].quantity >= 5 ? Number(((10/100) * cart.cart[index].subTotalPrice).toFixed(2)) : 0
            cart.totalPrice = Number((cart.cart.reduce((total: number, cart: ICartItem) => total + cart.subTotalPrice, 0)).toFixed(2));
            cart.totalDiscount = Number((cart.cart.reduce((discount: number, cart: ICartItem) => discount + cart.subTotalDiscount, 0)).toFixed(2));
            cart.totalWeight= Number((cart.cart.reduce((weight: number, cart: ICartItem) => weight + cart.subTotalWeight, 0)).toFixed(2));
            cart.deliveryFee = Number((getDeliveryFee(cart.totalWeight)).toFixed(2))
            setCart(() => ({ ...cart }))
            setItem(cartName, cart)
        }
        //window.location.reload()
    }

    ///This function is triggered when the user wants to reduce the amount
    const decreaseQuantity = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, index: number): void => {
        e.preventDefault()

        if (cart !== null) {
            if (cart.cart[index].quantity === 1) {
                notify("error", '1 is the minimum quantity you can order')
            } else {
                console.log("reduce quantity")
                console.log("before: ", cart)
                cart.cart[index].quantity = cart.cart[index].quantity - 1
                cart.cart[index].subTotalPrice = cart.cart[index].quantity * cart.cart[index].unitPrice
                cart.cart[index].subTotalWeight = cart.cart[index].quantity * cart.cart[index].unitWeight
                cart.cart[index].subTotalDiscount = cart.cart[index].extraDiscount && cart.cart[index].quantity >= 5 ? Number(((10/100) * cart.cart[index].subTotalPrice).toFixed(2)) : 0
                cart.totalPrice = Number((cart.cart.reduce((total: number, cart: ICartItem) => total + cart.subTotalPrice, 0)).toFixed(2));
                cart.totalDiscount = Number((cart.cart.reduce((discount: number, cart: ICartItem) => discount + cart.subTotalDiscount, 0)).toFixed(2));
                cart.totalWeight= Number((cart.cart.reduce((weight: number, cart: ICartItem) => weight + cart.subTotalWeight, 0)).toFixed(2));
                cart.deliveryFee = Number((getDeliveryFee(cart.totalWeight)).toFixed(2))
                setItem(cartName, cart)
                setCart(() => ({ ...cart }))
                console.log("after: ", cart)
            }
        }
        //window.location.reload()
    }

    ///This function is triggered when the checkout button is clicked
    const checkoutOrder = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): Promise<void> => {
        e.preventDefault()

        setModalBackground(true)
        if (deliveryInfo) {
            setOrderModal(true)
        } else {
            notify("error", "Delivery Info is required")
            await sleep(0.3)
            setOrderForm(true)
        }
        
    }

    ///This function is triggered when the user wants to input a delivery info
    const editDeliveryInfo = async (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        setModalBackground(!modalBackground)
        await sleep(0.2)
        setOrderForm(!orderForm)
        console.log("Order form: ", orderForm)
    }

    ///This function triggers with the first remove button
    const removeItem = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, index: number | null, action: number) => {
        e.preventDefault()

        if (action === 0 && index !== null) { ///This represents the first remove button
            setDeleteIndex(() => index)
            setDeleteModal(() => true)
        } else if (action === 1 && cart !== null) { ///This represents the final remove button
            console.log("Cart Index: ", deleteIndex)
            cart?.cart.splice(deleteIndex, 1)
            cart.totalPrice = Number((cart.cart.reduce((total: number, cart: ICartItem) => total + cart.subTotalPrice, 0)).toFixed(2));
            console.log("Updated Cart: ", cart)
            setItem(cartName, cart)
            setDeleteModal(() => false)
        }
        
    }

  return (
    <>
        <main className={`${styles.main}`}>
            {!cart || cart?.cart.length === 0 ? (
                <div className={styles.empty_cart}>
                    <div className={styles.cart_icon}>
                        <ProductionQuantityLimits className={styles.icon} />
                    </div>
                    <span className={styles.brief_1}>Your cart is empty!</span>
                    <span className={styles.brief_2}>Explore our wide range of products and uncover our unbeatable offers</span>
                    <button onClick={() => router.push("/#products")}>
                        <AddShoppingCart className={styles.icon} />
                        <span>Start Shopping</span>
                    </button>
                </div>
            ) : (
                <div className={styles.active_cart}>
                    
                    <div className={styles.cart_list}>
                        <span className={styles.cart_list_title}>Checkout Summary</span>
                        <div className={styles.cart_lists}>
                            {cart ? cart.cart.map((c, cid) => (
                                <div className={styles.cart_item} key={cid}>
                                <div className={styles.list_image}>
                                    <Image
                                        className={styles.img} 
                                        src={c.image.src}
                                        alt=""
                                        width={c.image.width}
                                        height={c.image.height}
                                    />
                                </div>
                                <span className={styles.list_title}>{c.name}</span>
                                <div className={styles.list_quantity}>
                                    <button className={styles.minus_button} onClick={e => decreaseQuantity(e, cid)}>
                                        <Remove style={{ fontSize: "1rem" }} />
                                    </button>
                                    <span>{c.quantity}</span>
                                    <button className={styles.plus_button} onClick={e => increaseQuantity(e, cid)}>
                                        <Add style={{ fontSize: "1rem" }} />
                                    </button>
                                </div>
                                <button className={styles.remove} onClick={e => removeItem(e, cid, 0)}>
                                    <DeleteOutline className={styles.icon} />
                                </button>
                            </div>
                            )) : (<></>)}
                        </div>
                    </div>
                    <div className={styles.order_price}>
                        <span className={styles.heading}>Delivery Info</span>
                        <div className={styles.delivery_info} onClick={(e) => editDeliveryInfo(e)}>
                            {deliveryInfo ? (
                                <div className={styles.info}>
                                    <span className={styles.name}>{deliveryInfo.fullName}</span>
                                    <div className={styles.address}>
                                        <span>{deliveryInfo.deliveryAddress}<br/>{deliveryInfo.state}, {deliveryInfo.country} </span>
                                    </div>
                                    <span className={styles.mobile}>{deliveryInfo.phoneNumbers[0]}</span>
                                    <EditNote className={styles.editIcon} />
                                </div> 
                            ) : (
                                <div className={styles.addInfo}>
                                    <Add className={styles.addIcon} />
                                    <span className={styles.text}>Add Delivery Info</span>
                                </div>
                            )}
                        </div>
                        <div className={styles.price_items}>
                            <div className={styles.subtotal}>
                                <span className={styles.title}>Subtotal</span>
                                <div className={styles.amount}>
                                    {clientInfo?.country?.currency?.symbol ? (
                                        <span>{clientInfo?.country?.currency?.symbol}</span>
                                    ) : (
                                        <></>
                                    )}
                                    {cart && clientInfo?.country?.currency?.exchangeRate ? (
                                        <span>
                                            {round(cart.totalPrice * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                    
                                </div>
                            </div>
                            <div className={styles.discount}>
                                <span className={styles.title}>Discount</span>
                                <div className={styles.amount}>
                                    <Remove className={styles.minus} style={{ fontSize: "1rem" }} />
                                    {clientInfo?.country?.currency?.symbol ? (
                                        <span>{clientInfo.country?.currency?.symbol}</span>
                                    ) : (
                                        <></>
                                    )}
                                    {cart && clientInfo?.country?.currency?.exchangeRate ? (
                                        <span>
                                            {round(cart.totalDiscount * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                            <div className={styles.deliveryFee}>
                                <span className={styles.title}>Delivery Fee</span>
                                <div className={styles.amount}>
                                    <Add className={styles.minus} style={{ fontSize: "1rem" }} />
                                    <span>{clientInfo?.country?.currency?.symbol}</span>
                                    {cart && clientInfo?.country?.currency?.exchangeRate ? (
                                        <span>
                                            {round((cart.deliveryFee + extraDeliveryFee) * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                            <div className={styles.total}>
                                <span className={styles.title}>Total</span>
                                <div className={styles.amount}>
                                    <span>{clientInfo?.country?.currency?.symbol}</span>
                                    {cart && clientInfo?.country?.currency?.exchangeRate ? (
                                        <span>
                                            {round((cart.totalPrice - cart.totalDiscount + cart.deliveryFee + extraDeliveryFee) * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button onClick={(e) => checkoutOrder(e)}>
                            <LocalShipping className={styles.icon} />
                            <span>Order Now</span>
                        </button>
                    </div>
                    
                </div>
            )}
        </main>
        <div className={`${styles.modal_container} ${deleteModal ? styles.activeModal : styles.inactiveModa}`}>
            <div className={`${styles.modal}`}>
                <div className={styles.modal_heading}>
                    <span>Remove from cart</span>
                    <button onClick={() => setDeleteModal(() => false)}>
                        <Close className={styles.icon} />
                    </button>
                </div>
                <span className={styles.modal_body}>Are you sure you want to remove this item from your cart?</span>
                <button onClick={e => {
                    removeItem(e, null, 1)
                    window.location.reload()
                }} 
                className={styles.remove_item_button}>
                    <DeleteOutline className={styles.icon} />
                    <span>Remove Item</span>
                </button>
            </div>
        </div>
    </>
  );
};

export default Cart;