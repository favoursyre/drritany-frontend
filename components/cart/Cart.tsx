"use client"
///Cart component

///Libraries -->
import { useState, useEffect, MouseEvent } from 'react';
import styles from "./cart.module.scss"
import { setItem, getItem, notify, removeItem as removeItem_ , getOS, getDevice } from '@/config/clientUtils';
import { cartName, round, getDeliveryFee, sleep, deliveryName, extraDeliveryFeeName, storeCartInfo, getEachCartItemDiscount, getCurrentDate, getCurrentTime, extractBaseTitle, storeButtonInfo, userIdName, clientInfoName } from '@/config/utils';
import { ICart, ICartItem, ICartItemDiscount, IClientInfo, ICustomerSpec, IButtonResearch } from '@/config/interfaces';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useClientInfoStore, useOrderFormModalStore, useModalBackgroundStore, useOrderModalStore, useLoadingModalStore, useCartItemDiscountModalStore } from "@/config/store";
import { DeleteOutline, AddShoppingCart, ProductionQuantityLimits, LocalShipping, Remove, Add, Close, EditNote, DiscountOutlined, Payment } from '@mui/icons-material';
import { countryList } from '@/config/database';

///Commencing the code 
/**
 * @title Cart Component
 * @returns The Cart component
 */
const Cart = () => {
    const [cart, setCart] = useState<ICart | null>(getItem(cartName))
    const extraDeliveryFee__ = getItem(extraDeliveryFeeName)
    const [extraDeliveryFee, setExtraDeliveryFee] = useState<number>(extraDeliveryFee__ ? extraDeliveryFee__ : 0)
    const [deliveryInfo, setDeliveryInfo] = useState<ICustomerSpec | undefined>(getItem(deliveryName))
    const [deleteIndex, setDeleteIndex] = useState(Number)
    const [deleteModal, setDeleteModal] = useState(false)
    const router = useRouter()
    const [cartDeliveryFee, setCartDeliveryFee] = useState<number>()
    const [cartDiscount, setCartDiscount] = useState<number>()
    const routerPath = usePathname();
    const [cartInitialRender, setCartInitialRender] = useState(false);
    //const clientInfo = useClientInfoStore(state => state.info)
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo!)
    const orderForm = useOrderFormModalStore(state => state.modal)
    const setOrderForm = useOrderFormModalStore(state => state.setOrderFormModal)
    const setOrderModal = useOrderModalStore(state => state.setOrderModal)
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal)
    const modalBackground = useModalBackgroundStore(state => state.modal);
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setCartItemDiscountModal = useCartItemDiscountModalStore(state => state.setCartItemDiscountModal)
    const cartItemDiscountModal = useCartItemDiscountModalStore(state => state.modal)
    const setCartItemDiscount = useCartItemDiscountModalStore(state => state.setCartItemDiscount)
    const searchParams = useSearchParams()

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
    
    //Checking the url to know if stripe payment session is active
    useEffect(() => {
        const sessionId = searchParams.get('session_id')
        //const { session_id } = router.query;
        if (sessionId) {
            setModalBackground(true)
            setOrderModal(true)
        }
    }, [searchParams, setModalBackground, setOrderModal]);

    //Trying to refresh delivery info
    useEffect(() => {
        let _deliveryInfo

        const interval = setInterval(() => {
            _deliveryInfo = getItem(deliveryName)
            //console.log("Delivery Info: ", _deliveryInfo)
            setDeliveryInfo(_deliveryInfo)
        }, 100);

        //console.log("Delivery Info: ", deliveryInfo)
    
        return () => {
            clearInterval(interval);
        };

    }, [deliveryInfo])

    useEffect(() => {
        //console.log('Params: ', searchParams.get('session_id'))
        //console.log("Cart Size: ", cart?.cart[0].specs?.size)
        //console.log("Client: ", clientInfo?.country?.name?.common!)
        //console.log("Cart ob: ", cart)
        //console.log("details: ", cart, getCartDiscount(), getCartDeliveryFee())

        const interval = setInterval(() => {
            //setModalState(() => getModalState())

            const refreshCart = () => {
                //console.log("the cart is running")
                if (cart && clientInfo?.country?.name?.common) {
                    cart.grossTotalPrice = Number((cart.cart.reduce((total: number, cart: ICartItem) => total + cart.subTotalPrice, 0)).toFixed(2));
                    cart.totalDiscount = Number((cart.cart.reduce((discount: number, cart: ICartItem) => discount + cart.subTotalDiscount, 0)).toFixed(2));
                    cart.totalWeight= Number((cart.cart.reduce((weight: number, cart: ICartItem) => weight + cart.subTotalWeight, 0)).toFixed(2));
                    cart.deliveryFee = Number((getDeliveryFee(cart.totalWeight, clientInfo?.country?.name?.common)).toFixed(2))
                    setItem(cartName, cart)
                    const updatedCart = cart
                    setCart(() => ({ ...updatedCart }))
                }
            }
    
            if (!cartInitialRender) {
                setCartInitialRender(true);
                //console.log("Initial: ", cartInitialRender)
    
                refreshCart()
              }

            
            if (deliveryInfo) {
                
                //Checking if the state has extraDeliveryPercent and notifying the client
                //console.log("Test: ", deliveryInfo.state)
                
                const state_ = clientInfo?.country?.states?.find(states => states.name === deliveryInfo.state)
                //console.log("Test 2: ", clientInfo)

                if (state_?.extraDeliveryPercent === 0) {
                    //console.log("Delivery info new 2")
                    setItem(extraDeliveryFeeName, 0)
                    setExtraDeliveryFee(() => 0)
                } else if (state_?.extraDeliveryPercent && cart?.deliveryFee) {
                    //console.log("Delivery info new")
                        const extraDeliveryFee = (state_?.extraDeliveryPercent / 100) * cart?.deliveryFee
                        setExtraDeliveryFee(() => extraDeliveryFee)
                        setItem(extraDeliveryFeeName, extraDeliveryFee)

                        //console.log("Delivery Fee: ", extraDeliveryFee)
                }

                
            }
        }, 100);
    
        return () => {
            clearInterval(interval);
        };
        
    }, [deleteIndex, cart, orderForm, extraDeliveryFee, deliveryInfo, cartInitialRender, clientInfo]);

    //This function calculates the cart discount
    //Generic is for all everyday users while special is for students, military, etc.
    const getCartDiscount = (user: "generic" | "special" = "generic") => {
        let discount
        //console.log("Delivery fees: ", cart?.totalHiddenDeliveryFee, cart?.deliveryFee, getCartDeliveryFee())
        discount = cart?.totalHiddenDeliveryFee! - (cart?.deliveryFee! + extraDeliveryFee)

        if (discount < 0) {
            discount = 0
            return discount
        }

        //I want to deduct about 20% off the discount and reserve the full discount only for students/officers
        if (user === "generic") {
            //console.log("Discounts: ", discount, (80/100) * discount)
            const discount_ = (80/100) * discount
            return discount_
        } else if (user === "special") {
            //Gets the full discount
        }

        // const _genDiscount = (80/100) * discount
        // //const _reservedDiscount = (20/100) * discount
        // discount = _genDiscount
        // console.log("Discounts: ", )
        return discount
    }

    //This function is trigered when a user wants to view the discount offer on each cart item
    const viewCartItemDiscount = async (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent> | MouseEvent<HTMLDivElement, globalThis.MouseEvent>, cartId: number) => {
        e.preventDefault()

        if(cart) {
            //cart.deliveryFee = getCartDeliveryFee()
            cart.totalDiscount = getCartDiscount()
            setItem(cartName, cart)
            setCart(() => ({ ...cart }))
            const cartItem: ICartItemDiscount = getEachCartItemDiscount(cart, cartId)
            //console.log("Item: ", cartItem)
            setCartItemDiscount(cartItem)
            setModalBackground(true)
            setCartItemDiscountModal(true)
            //console.log("Modal: ", cartItemDiscountModal)
        }

        //Storing this info in button research
        const info: IButtonResearch = {
            ID: getItem(userIdName),
            IP: clientInfo?.ip!,
            Country: clientInfo?.country?.name?.common!,
            Button_Name: "viewCartItemDiscount()",
            Button_Info: `Clicked discount icon in cart`,
            Page_Title: extractBaseTitle(document.title),
            Page_URL: routerPath,
            Date: getCurrentDate(),
            Time: getCurrentTime(),
            OS: getOS(),
            Device: getDevice()
        }
        await storeButtonInfo(info)
    }

    //This function calculates the cart delivery fee
    const getCartDeliveryFee = () => {
        let deliveryFee
        let discount
        discount = cart?.totalHiddenDeliveryFee! - (cart?.deliveryFee! + extraDeliveryFee)

        if (discount < 0) {
            deliveryFee = Math.abs(discount)
        } else {
            deliveryFee = 0
        }

        return deliveryFee
    }

    ///This function increases the amount of quantity
    const increaseQuantity = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, index: number): void => {
        e.preventDefault()
        if (cart !== null && clientInfo) {
            cart.cart[index].quantity = cart.cart[index].quantity + 1
            cart.cart[index].subTotalPrice = cart.cart[index].quantity * cart.cart[index].unitPrice
            cart.cart[index].subTotalWeight = cart.cart[index].quantity * cart.cart[index].unitWeight
            cart.cart[index].subTotalHiddenDeliveryFee = cart.cart[index].quantity * cart.cart[index].unitHiddenDeliveryFee
            cart.cart[index].subTotalDiscount = cart.cart[index].extraDiscount?.limit! && cart.cart[index].quantity >= cart.cart[index].extraDiscount?.limit! ? Number((( cart.cart[index].extraDiscount?.percent!/100 ) * cart.cart[index].subTotalPrice).toFixed(2)) : 0
            cart.grossTotalPrice = Number((cart.cart.reduce((total: number, cart: ICartItem) => total + cart.subTotalPrice, 0)).toFixed(2));
            cart.totalDiscount = Number((cart.cart.reduce((discount: number, cart: ICartItem) => discount + cart.subTotalDiscount, 0)).toFixed(2));
            cart.totalWeight= Number((cart.cart.reduce((weight: number, cart: ICartItem) => weight + cart.subTotalWeight, 0)).toFixed(2));
            cart.totalHiddenDeliveryFee = Number((cart.cart.reduce((hiddenDeliveryFee: number, cart: ICartItem) => hiddenDeliveryFee + cart.subTotalHiddenDeliveryFee, 0)).toFixed(2))
            cart.deliveryFee = Number((getDeliveryFee(cart.totalWeight, clientInfo?.country?.name?.common!)).toFixed(2))
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
                //console.log("reduce quantity")
                //console.log("before: ", cart)
                cart.cart[index].quantity = cart.cart[index].quantity - 1
                cart.cart[index].subTotalPrice = cart.cart[index].quantity * cart.cart[index].unitPrice
                cart.cart[index].subTotalWeight = cart.cart[index].quantity * cart.cart[index].unitWeight
                cart.cart[index].subTotalHiddenDeliveryFee = cart.cart[index].quantity * cart.cart[index].unitHiddenDeliveryFee
                cart.cart[index].subTotalDiscount = cart.cart[index].extraDiscount?.limit! && cart.cart[index].quantity >= cart.cart[index].extraDiscount?.limit! ? Number(((cart.cart[index].extraDiscount?.percent!/100) * cart.cart[index].subTotalPrice).toFixed(2)) : 0
                cart.grossTotalPrice = Number((cart.cart.reduce((total: number, cart: ICartItem) => total + cart.subTotalPrice, 0)).toFixed(2));
                cart.totalDiscount = Number((cart.cart.reduce((discount: number, cart: ICartItem) => discount + cart.subTotalDiscount, 0)).toFixed(2));
                cart.totalWeight= Number((cart.cart.reduce((weight: number, cart: ICartItem) => weight + cart.subTotalWeight, 0)).toFixed(2));
                cart.totalHiddenDeliveryFee = Number((cart.cart.reduce((hiddenDeliveryFee: number, cart: ICartItem) => hiddenDeliveryFee + cart.subTotalHiddenDeliveryFee, 0)).toFixed(2))
                cart.deliveryFee = Number((getDeliveryFee(cart.totalWeight, clientInfo?.country?.name?.common!)).toFixed(2))
                setItem(cartName, cart)
                setCart(() => ({ ...cart }))
                //console.log("after: ", cart)
            }
        }
        //window.location.reload()
    }

    ///This function is triggered when the checkout button is clicked
    const checkoutOrder = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): Promise<void> => {
        e.preventDefault()  

        //Updating cart with the new values
        if(cart) {
            //cart.deliveryFee = getCartDeliveryFee()
            cart.totalDiscount = getCartDiscount()
            cart.overallTotalPrice = cart.grossTotalPrice - getCartDiscount() + getCartDeliveryFee()
            setItem(cartName, cart)
            setCart(() => ({ ...cart }))
            console.log('Cart: ', cart)
        } else {
            notify('error', "Cart is empty")
            return
        }

        setModalBackground(true)
        if (deliveryInfo) {
            //Validating if the user is from the USA, we only serve US clients for the meantime
            const usCountryInfo = countryList.find((country) => country.name?.abbreviation === "US")
            if (deliveryInfo.country !== usCountryInfo?.name?.common) {
                notify("error", `In the meantime, we don't operate in ${deliveryInfo.country}`)
                return
            }

            setOrderModal(true)
            //removeItem_(cartName)
            // console.log("deleted")
            // console.log("Cart: ", getItem(cartName))
        } else {
            notify("error", "Delivery Info is required")
            await sleep(0.3)
            setOrderForm(true)
            //window.location.reload()
        }
        
        //Storing this info in button research
        const info: IButtonResearch = {
            ID: getItem(userIdName),
            IP: clientInfo?.ip!,
            Country: clientInfo?.country?.name?.common!,
            Button_Name: "checkoutOrder()",
            Button_Info: `Clicked "pay" in cart`,
            Page_Title: extractBaseTitle(document.title),
            Page_URL: routerPath,
            Date: getCurrentDate(),
            Time: getCurrentTime(),
            OS: getOS(),
            Device: getDevice()
        }
        await storeButtonInfo(info)
    }

    ///This function is triggered when the user wants to input a delivery info
    const editDeliveryInfo = async (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        setModalBackground(!modalBackground)
        await sleep(0.2)
        setOrderForm(!orderForm)
        //console.log("Order form: ", orderForm)
        //window.location.reload()

        // if (orderForm) {
            
        //     console.log("testing")
        // }
    }

    ///This function triggers with the first remove button
    const removeItem = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, index: number | null, action: number) => {
        e.preventDefault()

        if (action === 0 && index !== null) { ///This represents the first remove button
            setDeleteIndex(() => index)
            setDeleteModal(() => true)
        } else if (action === 1 && cart !== null) { ///This represents the final remove button
            //console.log("Cart Index: ", deleteIndex)
            cart?.cart.splice(deleteIndex, 1)
            //const pSize = typeof cart.cart[deleteIndex].specs?.size === "string" ? cart.cart[deleteIndex].specs?.size : cart.cart[deleteIndex].specs?.size?.size!
            //const productName = `${cart.cart[deleteIndex].name} (${cart.cart[deleteIndex].specs?.color}, ${cart.cart[deleteIndex].specs?.size})`
            //storeCartInfo("Deleted", clientInfo!, productName)
            cart.grossTotalPrice = Number((cart.cart.reduce((total: number, cart: ICartItem) => total + cart.subTotalPrice, 0)).toFixed(2));
            cart.totalDiscount = Number((cart.cart.reduce((discount: number, cart: ICartItem) => discount + cart.subTotalDiscount, 0)).toFixed(2));
            cart.totalWeight= Number((cart.cart.reduce((weight: number, cart: ICartItem) => weight + cart.subTotalWeight, 0)).toFixed(2));
            cart.totalHiddenDeliveryFee = Number((cart.cart.reduce((hiddenDeliveryFee: number, cart: ICartItem) => hiddenDeliveryFee + cart.subTotalHiddenDeliveryFee, 0)).toFixed(2))
            cart.deliveryFee = Number((getDeliveryFee(cart.totalWeight, clientInfo?.country?.name?.common!)).toFixed(2))
            //console.log("Updated Cart: ", cart)
            setItem(cartName, cart)
            setCart(() => ({ ...cart }))
            setDeleteModal(() => false)

            //Refreshing the page
            if (typeof window !== undefined) {
                window.location.reload()
            }
        }
    }

    ///This function helps to view a product
    const viewProduct = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent> | MouseEvent<HTMLSpanElement, globalThis.MouseEvent>, id: string) => {
        e.preventDefault()

        //Setting the loading modal
        setModalBackground(true)
        setLoadingModal(true)

        router.push(`/products/${id}`);
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
                    <button onClick={() => router.push("/products")}>
                        <AddShoppingCart className={styles.icon} />
                        <span>Start Shopping</span>
                    </button>
                </div>
            ) : (
                <div className={styles.active_cart}>
                    <div className={styles.cart_list}>
                        <span className={styles.cart_list_title}>Checkout Summary</span>
                        <div className={styles.cart_header}>
                            <span className={styles.span1}>Product</span>
                            <span className={styles.span2}>Quantity</span>
                            <span className={styles.span3}>Subtotal</span>
                        </div>
                        <div className={styles.cart_lists}>
                            {cart ? cart.cart.map((c, cid) => (
                                <div className={styles.cart_item} key={cid}>
                                    <div className={styles.list_main} onClick={(e) => viewProduct(e, c._id)}>
                                        <div className={styles.list_image}>
                                            <Image
                                                className={styles.img} 
                                                src={c.image.src}
                                                alt=""
                                                width={c.image.width}
                                                height={c.image.height}
                                            />
                                        </div>
                                        <div className={styles.list_specs}>
                                            <span className={styles.list_title}>{c.name}</span>
                                            {c?.specs?.color ? (
                                                <div className={styles.list_color}>
                                                    <strong>Color:</strong>
                                                    {typeof c?.specs?.color === "string" ? (
                                                        <div className={styles.color} style={{ backgroundColor: `${c?.specs?.color}` }}></div>
                                                    ) : (
                                                        <div className={styles.image}>
                                                            <Image
                                                                className={styles.img}
                                                                src={c?.specs?.color.src!}
                                                                alt=""
                                                                width={c?.specs?.color.width!}
                                                                height={c?.specs?.color.height!}
                                                            /> 
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (<></>)}
                                            {c?.specs?.size ? (
                                                <div className={styles.list_size}>
                                                    <strong>Size:</strong>
                                                    <span className={styles.size}>{typeof c.specs?.size === "string" ? c.specs?.size : c.specs?.size.size}</span>
                                                </div>
                                            ) : (<></>)}
                                        </div>
                                    </div>
                                    <div className={styles.list_quantity}>
                                        <button className={styles.minus_button} onClick={e => decreaseQuantity(e, cid)}>
                                            <Remove className={styles.icon} />
                                        </button>
                                        <span>{c.quantity}</span>
                                        <button className={styles.plus_button} onClick={e => increaseQuantity(e, cid)}>
                                            <Add className={styles.icon} />
                                        </button>
                                    </div>
                                    <div className={styles.list_subtotal} onClick={(e) => viewCartItemDiscount(e, cid)}>
                                        <span className={getCartDiscount() > 0 ? styles.activeSpan : ""}>{clientInfo?.country?.currency?.symbol}</span>
                                        {cart && clientInfo?.country?.currency?.exchangeRate ? (
                                            <span className={getCartDiscount() > 0 ? styles.activeSpan : ""}>
                                                {round(c.subTotalPrice * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")}
                                            </span>
                                        ) : (
                                            <></>
                                        )}
                                        {getCartDiscount() <= 0 ? (
                                            <></>
                                        ) : (
                                            <DiscountOutlined className={styles.discountIcon} onClick={(e) => viewCartItemDiscount(e, cid)} />
                                        )}
                                    </div>
                                    <button className={styles.remove} onClick={e => removeItem(e, cid, 0)}>
                                        <DeleteOutline className={styles.icon} />
                                    </button>
                                </div>
                            )) : (<></>)}
                        </div>
                        {/* <div className={styles.cart_container}>
                            <div className={styles.cart_header}>
                                <span>Product</span>
                                <span>Quantity</span>
                                <span>Subtotal</span>
                            </div>
                            <div className={styles.cart_lists}>
                                {cart ? cart.cart.map((c, cid) => (
                                    <div className={styles.cart_item} key={cid}>
                                        <div className={styles.list_image} onClick={(e) => viewProduct(e, c._id)}>
                                            <Image
                                                className={styles.img} 
                                                src={c.image.src}
                                                alt=""
                                                width={c.image.width}
                                                height={c.image.height}
                                            />
                                        </div>
                                        <span className={styles.list_title} onClick={(e) => viewProduct(e, c._id)}>{c.name}</span>
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
                        </div> */}
                    </div>
                    <div className={styles.order_price}>
                        <span className={styles.heading}>Delivery Information</span>
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
                                <span className={styles.title}>Gross Total</span>
                                <div className={styles.amount}>
                                    {clientInfo?.country?.currency?.symbol ? (
                                        <span>{clientInfo?.country?.currency?.symbol}</span>
                                    ) : (
                                        <></>
                                    )}
                                    {cart && clientInfo?.country?.currency?.exchangeRate ? (
                                        <span>
                                            {round(cart.grossTotalPrice * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                    
                                </div>
                            </div>
                            <div className={styles.discount}>
                                <span className={styles.title}>Total Discount</span>
                                <div className={styles.amount}>
                                    <Remove className={styles.minus} style={{ fontSize: "1rem" }} />
                                    {clientInfo?.country?.currency?.symbol ? (
                                        <span>{clientInfo.country?.currency?.symbol}</span>
                                    ) : (
                                        <></>
                                    )}
                                    {cart && clientInfo?.country?.currency?.exchangeRate ? (
                                        <span>
                                            {round(getCartDiscount() * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")}
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
                                            {round(getCartDeliveryFee() * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                            <div className={styles.total}>
                                <span className={styles.title}>Overall Total</span>
                                <div className={styles.amount}>
                                    <span>{clientInfo?.country?.currency?.symbol}</span>
                                    {cart && clientInfo?.country?.currency?.exchangeRate ? (
                                        <span>
                                            {round((cart.grossTotalPrice - getCartDiscount() + getCartDeliveryFee()) * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button onClick={(e) => checkoutOrder(e)}>
                            <Payment className={styles.icon} />
                            <span>Pay</span>
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