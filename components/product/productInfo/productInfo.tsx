"use client"
///Product Info component

///Libraries -->
import { toast } from 'react-toastify';
import React, { useState, useEffect, MouseEvent, Fragment } from "react"
import styles from "./productInfo.module.scss"
import { IProduct, ICart, ICartItem, IClientInfo } from '@/config/interfaces';
import { setItem, notify } from '@/config/clientUtils';
import { round, cartName, sleep, slashedPrice, deliveryPeriod, getDeliveryFee } from '@/config/utils'
import { useRouter, usePathname } from 'next/navigation';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Image from 'next/image';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Star, AddShoppingCart, StarHalf, Discount } from '@mui/icons-material';
import { useModalBackgroundStore, useDiscountModalStore } from '@/config/store';
import { useClientInfoStore } from "@/config/store";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IconButton } from '@mui/material';

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
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setDiscountModal = useDiscountModalStore(state => state.setDiscountModal);
    const setDiscountProduct = useDiscountModalStore(state => state.setDiscountProduct);
    const discountProduct = useDiscountModalStore(state => state.product);
    const [imageIndex, setImageIndex] = useState<number>(0)
    const [videoIndex, setVideoIndex] = useState<number>(0)
    const [view, setView] = useState<"image" | "video">("image")
    const spec = product[0].specification
    const clientInfo = useClientInfoStore(state => state.info)
    const stars: Array<number> = [1, 2, 3, 4]
    console.log("Product info: ", product[0].videos)

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
            spec?.ingredients && spec.ingredients.length > 0 ? `Ingredients: ${spec?.ingredients?.join(", ")}` : undefined,
            //`${spec?.ingredients ? spec.ingredients : ""}`,
            //`${spec?.ingredients ? Ingredients: ${spec?.ingredients?.join(", ") : ""}}`,
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
        console.log('Index: ', imageIndex)
        //console.log("main: ", mainImage)
      }, [mainImage, mainImageId, imageIndex, videoIndex, view]);


    //   //This counts up to 5secs before popping up the discount modal
    //   useEffect(() => {
    //     const productName = product[0].name as unknown as string
    //     const productFreeOption = product[0].freeOption as unknown as boolean
    //     //const popped = false
    //     console.log('details: ', productName, productFreeOption)
    //     //setDiscountProduct({ name: productName, freeOption: productFreeOption, poppedUp: false })

    //     // async function openDiscountModal(seconds: number) {
    //     //     //setDiscountProduct({ name: productName, freeOption: productFreeOption, poppedUp: false })
    //     //     await sleep(seconds)

    //     //     if (discountProduct.poppedUp) {
    //     //         return
    //     //     } else {

    //     //         //setDiscountProduct({ ...discountProduct, poppedUp: true })
    //     //         setModalBackground(true)
    //     //         setDiscountModal(true)
    //     //     }
    //     //     //console.log("finished counting")
    //     // }

    //     // if (product[0].extraDiscount) {
    //     //     openDiscountModal(5)
    //     // }
    //   })

    useEffect(() => {
        const currentDate = new Date();
        const nextWeek = new Date(currentDate.getTime() + deliveryPeriod * 24 * 60 * 60 * 1000);
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
        const pWeight: number = p.specification?.weight as unknown as number

        //Arranging the cart details
        const cartItem: ICartItem = {
            _id: p._id,
            image: p.images[0],
            name: p.name,
            unitPrice: p.price || 0,
            unitWeight: pWeight,
            quantity: quantity,
            subTotalWeight: quantity * pWeight, 
            extraDiscount: p.extraDiscount,
            freeOption: p.freeOption ? p.freeOption : false,
            subTotalPrice: p.price || 0 * quantity,
            subTotalDiscount: 0
        }
        //console.log("Quantity: ", quantity)
        cartItem.subTotalPrice = Number((cartItem.unitPrice * cartItem.quantity).toFixed(2))
        const totalPrice = Number(cartItem.subTotalPrice.toFixed(2))

        let discount
        if (cartItem.quantity >= 5) {
            cartItem.subTotalDiscount = Number(((10 / 100) * totalPrice).toFixed(2))
            //discount = (10 / 100) * totalPrice
        } else {
            cartItem.subTotalDiscount = 0
        }
        const totalDiscount = Number(cartItem.subTotalDiscount.toFixed(2))
        const totalWeight = Number(cartItem.subTotalWeight.toFixed(2))
        const deliveryFee = getDeliveryFee(totalWeight)
        const cart_ = localStorage.getItem(cartName)
        const cart = JSON.parse(cart_ || "{}") as unknown as ICart

        if (cart_) {
            //console.log(true)
            const result = cart.cart.some((cart: ICartItem) => cart._id === p._id);
            if (!result) {
                cart.totalPrice = Number((cart.totalPrice + totalPrice).toFixed(2))
                cart.totalDiscount = Number((cart.totalDiscount + totalDiscount).toFixed(2))
                cart.totalWeight = Number((cart.totalWeight + totalWeight).toFixed(2))
                cart.deliveryFee = Number(deliveryFee.toFixed(2))
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
                    cart.cart[index].subTotalWeight = Number((cart.cart[index].unitWeight * quantity).toFixed(2))
                    cart.cart[index].subTotalDiscount = quantity >= 5 ? Number(((10/100) * cart.cart[index].subTotalPrice).toFixed(2)) : 0
                    cart.totalPrice = Number((cart.cart.reduce((total: number, cart: ICartItem) => total + cart.subTotalPrice, 0)).toFixed(2));
                    cart.totalDiscount = Number((cart.cart.reduce((discount: number, cart: ICartItem) => discount + cart.subTotalDiscount, 0)).toFixed(2));
                    cart.totalWeight = Number((cart.cart.reduce((weight: number, cart: ICartItem) => weight + cart.subTotalWeight, 0)).toFixed(2))
                    cart.deliveryFee = Number((getDeliveryFee(cart.totalWeight)).toFixed(2))
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
                totalDiscount: totalDiscount,
                totalWeight: totalWeight,
                deliveryFee: deliveryFee,
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

    ///This function opens discount modal
    const openDiscountModal = (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent>): void => {
        e.preventDefault()

        setDiscountProduct({ 
            name: product[0].name as unknown as string, 
            freeOption: product[0].freeOption as unknown as boolean, 
            poppedUp: false 
        })
        setModalBackground(true)
        setDiscountModal(true)
    }

    ///This function is triggered when the order now is pressed
    const orderNow = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()

        //Add the product to cart
        addToCart(e, true)

        //Routing the user to order form
        router.push("/cart")
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
        <>
            <div className={styles.header}>
                <span>{product[0].category}</span>
                {product[0].subCategory ? (
                    <>
                        <KeyboardArrowRightIcon className={styles.icon} />
                        <span>{product[0].subCategory}</span>
                        {product[0].miniCategory ? (
                            <>
                                <KeyboardArrowRightIcon className={styles.icon} />
                                <span>{product[0].miniCategory}</span>
                            </>
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                    <></>
                )}
            </div>
            <main className={`${styles.main}`}>
                {product.map((p, _id) => (
                    <div className={styles.left_section} key={_id}>
                        <div className={styles.profile_image}>
                            {view === "video" && product[0].videos ? (
                                <iframe
                                    className={styles.img}
                                    src={product[0].videos[videoIndex]?.src}
                                    width={product[0].videos[videoIndex]?.width}
                                    height={product[0].videos[videoIndex].height}
                                    allow="autoplay"
                                    loading="lazy"
                                    frameBorder={0}
                                    sandbox="allow-same-origin allow-scripts"
                                >
                                </iframe>
                            ) : (
                                <Image
                                    className={styles.img}
                                    src={product[0].images[imageIndex].src}
                                    alt=""
                                    width={product[0].images[imageIndex].width}
                                    height={product[0].images[imageIndex].height}
                                />
                            )}
                        </div>
                        <div className={styles.image_slide}>
                            {p.images.map((image, imageId) => (
                                <div key={imageId} className={`${styles.image} ${imageId === imageIndex ? styles.activeImage : ""}`} onClick={() => {
                                    setView(() => "image")
                                    setImageIndex(() => imageId)
                                }}>
                                    <Image
                                        className={styles.img}
                                        src={image.src}
                                        alt=""
                                        width={image.width}
                                        height={image.height}
                                    />
                                </div>
                            ))}
                            {p.videos && p.videos.length > 0 && p.videos[0].src ? p.videos.map((video, videoId) => (
                                <div className={styles.image} key={videoId} onClick={() => {
                                    setView(() => "video")
                                    setVideoIndex(() => videoId)
                                }}>
                                    <iframe
                                        className={styles.iframe}
                                        src={video.src}
                                        width={video.width}
                                        height={video.height}
                                        //allow="autoplay"
                                        frameBorder={0}
                                        //sandbox="allow-forms"
                                    >
                                </iframe>
                            </div>
                            )) : (
                                <></>
                            )}
                        </div>
                    </div>
                ))}
                {product.map((p, _id) => (
                    <div className={styles.right_section} key={_id}>
                    <h3>
                        <strong>{p.name}</strong>
                        {p.extraDiscount ? (
                            // <Tooltip title="Discount Offer" placement='top'>
                            //     <IconButton>
                                <Discount className={styles.icon} onClick={(e) => openDiscountModal(e)} />
                            //     </IconButton>
                            // </Tooltip>
                        ) : (
                            <></>
                        )}
                    </h3>
                    <span className={styles.product_about}>{p.description}</span>
                    <div className={styles.product_price_orders_rating}>
                        <div className={styles.price_orders}>
                        <div className={styles.product_price}>
                            <div className={styles.price}>
                                {/* <span dangerouslySetInnerHTML={{ __html: decodedString(nairaSymbol) }} /> */}
                                {clientInfo ? (
                                    <span>{clientInfo.country?.currency?.symbol}</span>
                                ) : (
                                    <></>
                                )}
                                {clientInfo?.country?.currency?.exchangeRate ? (
                                    <span>
                                        {p.price ? (round(p.price * clientInfo.country.currency.exchangeRate, 1)).toLocaleString("en-US") : ""}
                                    </span> 
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className={styles.slashed_price}>
                                {clientInfo ? <span>{clientInfo.country?.currency?.symbol}</span> : <></>}
                                {clientInfo?.country?.currency?.exchangeRate ? (
                                    <span>
                                        {p.price ? (round(slashedPrice(p.price * clientInfo.country.currency.exchangeRate, p.discount), 1).toLocaleString("en-US")) : ""}
                                    </span>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                        <div className={styles.product_orders}>
                            <LocalShippingIcon className={styles.icon} />
                            <span>{p.orders?.toLocaleString("en-US")} orders</span>
                        </div>
                        <div className={styles.percent}>
                            <span>-{p.discount}%</span>
                        </div>
                        </div>
                        <div className={styles.rating}>
                            <div className={styles.stars}>
                                {stars.map((star, id) => (
                                    <Star className={styles.star} key={id} />
                                ))}
                                <StarHalf className={styles.star} />
                            </div>
                            <span>4.7</span>
                        </div>
                    </div>
                    <span className={styles.product_deliveryDate}><em>Delivery to <strong>{clientInfo?.country?.name?.common}</strong> before {deliveryDate}.</em></span>
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
                            <LocalShippingIcon className={styles.icon} />
                            <span>Order Now</span>
                        </button>
                        <button className={styles.cart_button} onClick={e => {
                            addToCart(e, false)
                            window.location.reload()
                        }}>
                            <AddShoppingCart className={styles.icon} />
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
                                            <Fragment key={a_id}>
                                                {a ? (
                                                    <li>{a}</li>
                                                ) : (
                                                    <></>
                                                )}
                                            </Fragment>
                                        ))}
                                    </ul>

                                </div>
                            </div>
                        ))}
                    </div>
                    </div>
                ))}
            </main>
        </>
    );
};

export default ProductInfo;

