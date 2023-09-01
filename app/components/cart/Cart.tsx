"use client"
///Cart component

///Libraries -->
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, MouseEvent } from 'react';
import styles from "./cart.module.scss"
import { notify } from '@/app/utils/clientUtils';
import { setItem, getModalState, getItem, decodedString, cartName } from '@/app/utils/utils';
import { ICart, ICartItem, IClientInfo } from '@/app/utils/interfaces';
import { usePathname, useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

///Commencing the code 
/**
 * @title Cart Component
 * @returns The Cart component
 */
const Cart = () => {
    const cart__ = getItem(cartName)
  const [cart, setCart] = useState<ICart | null>(cart__)
  const [deleteIndex, setDeleteIndex] = useState(Number)
  const [deleteModal, setDeleteModal] = useState(false)
    const router = useRouter()
  const routerPath = usePathname();
  const clientInfo: IClientInfo = getItem("clientInfo")
  //const [clientInfo, setClientInfo] = useState<IClientInfo | null>(clientInfo_ ? JSON.parse(clientInfo_) : null)
//   console.log('Current page:', cart.length);

//   if (cart.length === undefined) {
//     console.log("Length: ", cart.length)
//   }

useEffect(() => {
    const interval = setInterval(() => {
        //setModalState(() => getModalState())
        //console.log("cart has changed")
      }, 100);
  
      return () => {
        clearInterval(interval);
      };
    
  }, [deleteIndex, cart]);

    ///This function increases the amount of quantity
    const increaseQuantity = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, index: number): void => {
        e.preventDefault()
        if (cart !== null) {
            cart.cart[index].quantity = cart.cart[index].quantity + 1
            cart.cart[index].subTotalPrice = cart.cart[index].quantity * cart.cart[index].unitPrice
            cart.totalPrice = Number((cart.cart.reduce((total: number, cart: ICartItem) => total + cart.subTotalPrice, 0)).toFixed(2));
            setCart(() => ({ ...cart }))
            setItem(cartName, cart)
        }
        //window.location.reload()
    }

    ///This function is triggered when the user wants to reduce the amount
    const reduceQuantity = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, index: number): void => {
        e.preventDefault()

        if (cart !== null) {
            if (cart.cart[index].quantity === 1) {
                notify("error", '1 is the minimum quantity you can order')
            } else {
                console.log("reduce quantity")
                console.log("before: ", cart)
                cart.cart[index].quantity = cart.cart[index].quantity - 1
                cart.cart[index].subTotalPrice = cart.cart[index].quantity * cart.cart[index].unitPrice
                cart.totalPrice = Number((cart.cart.reduce((total: number, cart: ICartItem) => total + cart.subTotalPrice, 0)).toFixed(2));
                setItem(cartName, cart)
                setCart(() => ({ ...cart }))
                console.log("after: ", cart)
            }
        }
        //window.location.reload()
    }

    ///This function is triggered when the checkout button is clicked
    const checkoutOrder = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()

        router.push("/order")
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
            <ToastContainer />
            {!cart || cart?.cart.length === 0 ? (
                <div className={styles.empty_cart}>
                    <div className={styles.cart_image}>
                        <img 
                            src="https://drive.google.com/uc?export=download&id=1ye9nI6vsVxDvsUyFtnJFLXnhQRVIziml"
                            alt=""
                        />
                    </div>
                    <span className={styles.brief_1}>Your cart is empty !</span>
                    <span className={styles.brief_2}>Explore our wide range of products and uncover our unbeatable offers</span>
                    <button>
                        <img
                            src="https://drive.google.com/uc?export=download&id=11z0qeMPVU6nfmjllwju6h91fM5enzjCC"
                            alt=""
                        />
                        <span>Start Ordering</span>
                    </button>
                </div>
            ) : (
                <div className={styles.active_cart}>
                    
                    <div className={styles.cart_list}>
                        <span className={styles.cart_list_title}>Cart Summary</span>
                        <div className={styles.cart_lists}>
                            {cart ? cart.cart.map((c, cid) => (
                                <div className={styles.cart_item} key={cid}>
                                <div className={styles.list_image}>
                                    <img 
                                        src={c.image}
                                        alt=""
                                    />
                                </div>
                                <span className={styles.list_title}>{c.name}</span>
                                <div className={styles.list_quantity}>
                                    <button className={styles.minus_button} onClick={e => reduceQuantity(e, cid)}>
                                        <RemoveIcon style={{ fontSize: "1rem" }} />
                                    </button>
                                    <span>{c.quantity}</span>
                                    <button className={styles.plus_button} onClick={e => increaseQuantity(e, cid)}>
                                        <AddIcon style={{ fontSize: "1rem" }} />
                                    </button>
                                </div>
                                <button className={styles.remove} onClick={e => removeItem(e, cid, 0)}>
                                    <div>
                                        <img 
                                            src="https://drive.google.com/uc?export=download&id=1qeMeNTXGeGIKql4XTAWHCm4MDMq-NGwY"
                                            alt=""
                                        />
                                    </div>
                                    <span>Remove</span>
                                </button>
                            </div>
                            )) : (<></>)}
                        </div>
                    </div>
                    <div className={styles.cart_price}>
                        <span className={styles.price_heading}>Cart Price</span>
                        <div className={styles.price_items}>
                            <span>Total</span>
                            <div>
                                {clientInfo ? (<span dangerouslySetInnerHTML={{ __html: decodedString(clientInfo.currencySymbol) }} />) : (<></>)}
                                <span>{cart && clientInfo ? (Math.round(cart.totalPrice * clientInfo.exchangeRate)).toLocaleString("en-US") : ""}</span>
                            </div>
                        </div>
                        <button onClick={(e) => checkoutOrder(e)}>
                            <img 
                                src="https://drive.google.com/uc?export=download&id=11z0qeMPVU6nfmjllwju6h91fM5enzjCC"
                                alt=""
                            />
                            <span>Checkout</span>
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
                    <CloseIcon />
                </button>
            </div>
            <span className={styles.modal_body}>Are you sure you want to remove this item from your cart?</span>
            <button onClick={e => removeItem(e, null, 1)} className={styles.remove_item_button}>
                <img 
                    src="https://drive.google.com/uc?export=download&id=1y2mMvCsu2xoy-soKb3669DHnTrAwRdc9"
                    alt=""
                />
                <span>Remove Item</span>
            </button>
        </div>
        </div>
    </>
  );
};

export default Cart;