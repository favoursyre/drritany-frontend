"use client"
///Product Info component

///Libraries -->
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, MouseEvent } from "react"
import styles from "./productInfo.module.scss"
import { IProduct, ICart, ICartItem, IClientInfo } from '@/app/utils/interfaces';
import { notify } from '@/app/utils/clientUtils';
import { setItem, getItem, decodedString, cartName, getCurrencySymbol, getExchangeRate } from '../../../utils/utils'
import { useRouter, usePathname } from 'next/navigation';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

///Commencing the code 
/**
 * @title Product Info Component
 * @returns The Product Info component
 */
const ProductInfo = ({ product_ }: { product_: Array<IProduct> }) => {
    const [product, setProduct] = useState(product_)
    const [activeHeading, setActiveHeading] = useState(0);
    const [mainImage, setMainImage] = useState(product[0].images[0])
    const [mainImageId, setMainImageId] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [deliveryDate, setDeliveryDate] = useState(String)
    const router = useRouter()
    const [imageIndex, setImageIndex] = useState<number>(0)
    const spec = product[0].specification
    const clientInfo: IClientInfo = getItem("clientInfo")

    ///This contains the accordian details
    const questions = [
        {
          question: 'Customer Benefits',
          answer: spec?.benefits,
           
        },
        {
          question: 'Specifications',
          answer: [
            `SKU: ${product[0]._id}`,
            `Brand: ${spec?.brand}`, 
            `Item Form: ${spec?.itemForm}`,
            `Item Count: ${spec?.itemCount}`,
            `Gender: ${spec?.gender}`,
            `Age Range: ${spec?.userAgeRange}`,
            `Ingredients: ${spec?.ingredients?.join(", ")}`,
            `Product Origin: ${spec?.productOrigin}`,
            `Weight: ${spec?.weight}kg`
        ],
        },
        {
          question: 'How to use?',
          answer: spec?.prescription,
        },
      ];

    useEffect(() => {
        // This function will be called every time the component is mounted, and
        // whenever the `count` state variable changes
        console.log("main: ", mainImage)
      }, [mainImage, mainImageId]);


    useEffect(() => {
        const currentDate = new Date();
        const nextWeek = new Date(currentDate.getTime() + 8 * 24 * 60 * 60 * 1000);
        const options: Intl.DateTimeFormatOptions = { weekday: "long", year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = nextWeek.toLocaleDateString('en-US', options);
        //console.log("One week from now: ", formattedDate);
        setDeliveryDate(formattedDate)
    }, [deliveryDate])

    ///This function is triggered when the user wants to reduce the amount
    const reduceQuantity = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()
        if (quantity === 1) {
            toast.info('1 is the minimum quantity you can order', {
                position: toast.POSITION.TOP_CENTER,
                style: { backgroundColor: 'white', color: '#1170FF' },
              });
        } else {
            let quantity_: number = quantity - 1
            setQuantity(quantity_)
        }
    }

    ///This function handles the button if for the add to cart
    const addToCart = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, order: boolean): void => {
        e.preventDefault()
        const p = product[0]

        const cartItem: ICartItem = {
            _id: p._id,
            image: p.images[0],
            name: p.name,
            unitPrice: p.price || 0,
            quantity: quantity,
            subTotalPrice: p.price || 0 * quantity
        }
        //console.log("Quantity: ", quantity)
        cartItem.subTotalPrice = Number((cartItem.unitPrice * cartItem.quantity).toFixed(2))
        const totalPrice = Number(cartItem.subTotalPrice.toFixed(2))
        const cart_ = localStorage.getItem(cartName)
        const cart = JSON.parse(cart_ || "{}")

        if (cart_) {
            //console.log(true)
            const result = cart.cart.some((cart: ICartItem) => cart._id === p._id);
            if (!result) {
                cart.totalPrice = Number((cart.totalPrice + totalPrice).toFixed(2))
                cart.cart.push(cartItem)
                setItem(cartName, cart)
                if (!order) {
                    notify('success', "Product has been added to cart")
                }
            } else {
                const index = cart.cart.findIndex((cart: ICartItem) => cart._id === p._id);
                
                if (quantity === cart.cart[index].quantity) {
                    if (!order) {
                        notify('warn', "Item has already been added to cart")
                    }
                } else {
                    cart.cart[index].quantity = quantity
                    cart.cart[index].subTotalPrice = Number((cart.cart[index].unitPrice * quantity).toFixed(2))
                    cart.totalPrice = Number((cart.cart.reduce((total: number, cart: ICartItem) => total + cart.subTotalPrice, 0)).toFixed(2));
                    setItem(cartName, cart)
                    if (!order) {
                        notify('success', "Product has been updated to cart")
                    }
                }
            }

            const car_ = localStorage.getItem(cartName)
            const _car_= JSON.parse(car_ || "{}")
            console.log("cart_: ", _car_)
        } else {
            console.log(false)

            const cart: ICart = {
                totalPrice: totalPrice,
                cart: [cartItem]
            }

            setItem(cartName, cart)
            const cart_ = localStorage.getItem(cartName)
            //console.log("cart: ", JSON.parse(cart_ || "{}"))
            if (!order) {
                notify('success', "Product has been added to cart")
            }
            
        }
        
    }

    ///This function is triggered when the order now is pressed
    const orderNow = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()

        //Add the product to cart
        addToCart(e, true)

        //Routing the user to order form
        router.push("/order")
    }
     
    ///This function triggers when someone opens an accordian
  const handleHeadingClick = (index: any) => {
    setActiveHeading(index === activeHeading ? null : index);
  };

    ///This function increases the amount of quantity
    const increaseQuantity = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()
        let quantity_: number = quantity + 1
        setQuantity(quantity_)
    }
    
    return (
        <main className={`${styles.main}`}>
            <ToastContainer />
            {product.map((p, _id) => (
                <div className={styles.left_section} key={_id}>
                    <div className={styles.image_section}>
                    <div className={styles.profile_image}>
                        <img
                            src={product[0].images[imageIndex]}
                            alt=""
                        />
                    </div>
                    <div className={styles.image_slide}>
                        {p.images.map((image, imageId) => (
                            <div key={imageId} className={`${styles.image} ${imageId === imageIndex ? styles.activeImage : ""}`} onClick={() => setImageIndex(() => imageId)}>
                                <img 
                                    src={image}
                                    alt=""
                                />
                            </div>
                        ))}
                    </div>
                    </div>
                    <div className={styles.video_section}>
                        <div className={styles.heading}><span>Video</span></div>
                        <div className={styles.video}>
                            <video controls>
                                <source src="https://drive.google.com/uc?export=download&id=1sE5wjZnceYu9lFqacDLeO5tVEnNoppBk" type="" />
                            Your browser does not support the video tag.
                        </video>
                        </div>
                    </div>
                </div>
            ))}
            {product.map((p, _id) => (
                <div className={styles.right_section} key={_id}>
                <h3><strong>{p.name}</strong></h3>
                <span className={styles.product_about}>{p.description}</span>
                <div className={styles.product_price_orders}>
                    <div className={styles.product_price}>
                        <div className={styles.price}>
                            <span dangerouslySetInnerHTML={{ __html: decodedString(getCurrencySymbol(clientInfo)) }} />
                            <span>{p.price ? (Math.round(p.price * getExchangeRate(clientInfo))).toLocaleString("en-US") : ""}</span>
                        </div>
                        <div className={styles.slashed_price}>
                            <span dangerouslySetInnerHTML={{ __html: decodedString(getCurrencySymbol(clientInfo)) }} />
                            <span>{p.slashedPrice ? (Math.round(p.slashedPrice * getExchangeRate(clientInfo))).toLocaleString("en-US") : ""}</span>
                        </div>
                    </div>
                    <div className={styles.product_orders}>
                        <div>
                            <img 
                                src="https://drive.google.com/uc?export=download&id=1j7Lk8ITWSU5r1pH0gCdKA9xY7EYxJsVr"
                                alt=""
                            />
                        </div>
                        <span>{p.orders?.toLocaleString("en-US")} orders</span>
                    </div>
                    
                </div>
                <span className={styles.product_deliveryDate}><em>Delivered before {deliveryDate}</em></span>
                <div className={styles.product_quantity}>
                    <button className={styles.minus_button} onClick={e => reduceQuantity(e)}>
                        <RemoveIcon style={{ fontSize: "1rem" }} />
                    </button>
                    <span>{quantity}</span>
                    <button className={styles.plus_button} onClick={e => increaseQuantity(e)}>
                        <AddIcon style={{ fontSize: "1rem" }} />
                    </button>
                    
                </div>
                
                <div className={styles.product_cart_order}>
                    <button className={styles.order_button} onClick={(e) => orderNow(e)}>
                        <img 
                            src="https://drive.google.com/uc?export=download&id=11z0qeMPVU6nfmjllwju6h91fM5enzjCC"
                            alt=""
                        />
                        <span>Order Now</span>
                    </button>
                    <button className={styles.cart_button} onClick={e => {
                        addToCart(e, false)
                        window.location.reload()
                    }}>
                        <img 
                            src="https://drive.google.com/uc?export=download&id=1ICxVuZVSkjUDZ1CSHLp_JI7RB-0LbEAQ"
                            alt=""
                        />
                        <span>Add to cart</span>
                    </button>
                </div>
                <div className={styles.product_accordian}>
                    {questions.map((q, index) => (
                        <div key={index}>
                            <button
                                className={`${styles.question} ${activeHeading === index ? styles.activeQuestion : styles.inactiveQuestion}`}
                                onClick={() => handleHeadingClick(index)}
                            >
                                {q.question}
                                <span className={`${activeHeading === index ? styles.activeSymbol : styles.inactiveSymbol}`}>
                                    {"+"}
                                </span>
                            </button>
                            <div
                                className={`${styles.answer} ${
                                    activeHeading === index ? styles.answerActive : ''
                                }`}
                            >
                                <ul >
                                {questions[index].answer?.map((a, a_id) => (
                                   <li key={a_id}>{a}</li>
                                ))}
                                </ul>
                                
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            ))}
        </main>
    );
};
  
export default ProductInfo;

