"use client"
///Order component

///Libraries -->
import styles from "./order.module.scss"
import React, { useState, useEffect, ChangeEvent } from "react"
import { setItem, getItem, notify } from '@/config/clientUtils';
import { cartName, deliveryName, capitalizeFirstLetter, findStateWithZeroExtraDeliveryPercent, round, backend } from "@/config/utils"
import { ICart, IClientInfo, ICountry, ICustomerSpec } from "@/config/interfaces";
import validator from "validator";
import { useOrderModalStore, useModalBackgroundStore, useClientInfoStore } from "@/config/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { countryList } from "@/config/database";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Loading from "../loadingCircle/Circle";

///Commencing the code 
  
/**
 * @title Order Component
 * @returns The Order component
 */
const Order = () => {
    const cart_ = getItem(cartName)
    const [cart, setCart] = useState<ICart | null>(cart_)
    const clientInfo = useClientInfoStore(state => state.info)
    const [fullName, setFullName] = useState<string | undefined>("")
    const [phoneNumber1, setPhoneNumber1] = useState<string>("")
    const [phoneNumber2, setPhoneNumber2] = useState<string>("")
    const [emailAddress, setEmailAddress] = useState<string>("")
    const [country, setCountry] = useState<string>("")
    const [countryInfo, setCountryInfo] = useState<ICountry | undefined>()
    const [state, setState] = useState<string | undefined>("")
    const [postalCode, setPostalCode] = useState<string>("")
    const [deliveryAddress, setDeliveryAddress] = useState<string>("")
    const [countryCode1, setCountryCode1] = useState<ICountry>()
    const [countryCode2, setCountryCode2] = useState<ICountry>()
    const [dropList1, setDropList1] = useState(false)
    const [dropList2, setDropList2] = useState(false)
    const [extraDeliveryFee, setExtraDeliveryFee] = useState<number>(0) //Unit is in USD
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setOrderModal = useOrderModalStore(state => state.setOrderModal);
    console.log("Testing: ", countryInfo)

    //const country_ = countryList.find(country => country.name?.common === country)
    
    useEffect(() => {
        //getClientInfo()
        
        if (clientInfo && clientInfo?.country) {
            //setCountryCode1(() => clientInfo.country)
            console.log("Loc: ", clientInfo)
            if (!countryCode1 && !countryCode2 && !country) {
                setCountryCode1(() => clientInfo.country)
                setCountryCode2(() => clientInfo.country)

                const country = clientInfo.country.name?.common as unknown as string
                setCountry(() => country)
                const info = countryList.find(country => country.name?.common === clientInfo?.country?.name?.common)
                console.log("Country: ", info)
                setCountryInfo(() => info)

                const state_ = findStateWithZeroExtraDeliveryPercent(info)
                setState(() => state_?.name)
                //setExtraDeliveryFee(() => state_?.extraDeliveryPercent as unknown as number)
            }
        }
    }, [clientInfo, countryInfo]);
    
    ///This function is triggered when the form is submitted
    const processOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (cart) {
            ///Validating the required args
            if (cart?.cart.length === 0) {
                notify("error", "Cart is empty")
                return
            } else if (!fullName) {
                notify("error", "Fullname is required")
                return
            } else if (!phoneNumber1) {
                notify("error", "Phone number is required")
                return
            } else if (!emailAddress) {
                notify("error", "Email address is required")
                return
            } else if (!validator.isEmail(emailAddress)) {
                notify("error", "Email address is not valid")
                return
            } else if (!country) {
                notify("error", "Country address is required")
                return
            } else if (!state) {
                notify("error", "State is required")
                return
            } else if (!postalCode) {
                notify("error", "Postal code is required")
                return
            } else if (!deliveryAddress) {
                notify("error", "Delivery address is required")
                return
            }

            //
            setIsLoading(() => true)

            //Send the order to the backend
            try {
                    //console.log('Clicked')
                    const customerSpec: ICustomerSpec = {fullName, email: emailAddress, phoneNumbers: [`${countryCode1?.dial_code}-${phoneNumber1}`, `${countryCode2?.dial_code}-${phoneNumber2}`], country, state, deliveryAddress, postalCode}
                    const newDeliveryFee = cart.deliveryFee + extraDeliveryFee
                    cart.deliveryFee = Number(newDeliveryFee.toFixed(2))
                    setCart(() => ({ ...cart }))
                    const productSpec: ICart = cart
                    const clientInfo_ = clientInfo as unknown as IClientInfo
                    const order = {customerSpec, productSpec, clientInfo_}
                    console.log("Order_: ", order)
                    const res = await fetch(`${backend}/order`, {
                        method: 'POST',
                        //body: JSON.stringify({ customerSpec, productSpec, clientInfo_ }),
                        body: JSON.stringify(order),
                        headers: {
                        'Content-Type': 'application/json',
                        },
                    });
                    
                const data = await res.json();
            
                console.log("Data: ", data);

                if (res.ok) {
                    notify("success", `Your order was logged successfully`)

                    setModalBackground(true)
                    setOrderModal(true)

                    setIsLoading(() => false)

                    //Clear the cart
                    const _cart_: ICart = {
                        totalPrice: 0,
                        totalDiscount: 0,
                        totalWeight: 0,
                        deliveryFee: 0,
                        cart: []
                    }

                    setItem(cartName, _cart_)
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
                console.log("error: ", error)
                notify("error", `${error}`)
            }

            //setModalState(() => false)
            setIsLoading(() => false)
        } else {
            notify('error', "Cart is empty")
            return
        }
    }

    useEffect(() => {
        let data
      }, []);

    //This handles the handle change effect
  const onChange = (e: ChangeEvent<HTMLSelectElement>, label: string) => {
    e.preventDefault()

    if (label === "country") {
        setCountry(e.target.value);

        const countryInfo_ = countryList.find(country => country.name?.common === country) as unknown as ICountry
        setCountryInfo(() => countryInfo_)
    } else if (label === "state") {
        if (cart && clientInfo?.country?.currency?.exchangeRate) {
            setState(e.target.value)
            const symbol = clientInfo.country.currency.symbol
        
            //Checking if the state has extraDeliveryPercent and notifying the client
            const state_ = countryInfo?.states?.find(states => states.name === e.target.value)
            
            if (state_?.extraDeliveryPercent === 0) {
                    const total = round((cart.totalPrice - cart.totalDiscount + cart.deliveryFee) * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")
                    setExtraDeliveryFee(() => 0)
                    notify("info", `Your total order amount is ${symbol}${total}`)
                
                
            } else {
                if (state_?.extraDeliveryPercent && cart?.deliveryFee) {
                    const extraDeliveryFee = (state_?.extraDeliveryPercent / 100) * cart?.deliveryFee
                    setExtraDeliveryFee(() => extraDeliveryFee)
                    const formatExtraDeliveryFee = round(extraDeliveryFee * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")
                    const total = round((cart.totalPrice - cart.totalDiscount + cart.deliveryFee + extraDeliveryFee) * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")
                    notify("info", `Delivery to ${e.target.value} gets an additional delivery charge of ${symbol}${formatExtraDeliveryFee}. Your total order amount is ${symbol}${total}`)
                }
            }
        }
    }
};

  ///This function is triggered when the choose code is clicked
  const chooseCode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, position: string | number, country: ICountry) => {
    e.preventDefault()

    console.log("Position: ", typeof position)
    if (position === "1") {
        setDropList1(() => false)
        //console.log("Country1: ", country)
        setCountryCode1(() => country)
        //console.log("Country code: ", countryCode1)
    } else if (position === "2") {
        setDropList2(() => false)
        //console.log("Country2: ", country)
        setCountryCode2(() => country)
        //console.log("Country code: ", countryCode2)
    }
  }


  ///This function is trigerred when the show drop down is clicked
  const showDropDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, position: string | number) => {
    e.preventDefault()

    if (position === "1") {
        setDropList1(!dropList1)
        //console.log("drop 1")
    } else if (position === "2") {
        //console.log("drop 2")
        setDropList2(!dropList2)
    }
  }

  //console.log("Coutries: ", CountryList.getAll())
    return (
        <main className={styles.main}>
                <h3 className={styles.heading}>Delivery Form</h3>
                <span className={styles.brief}><em><strong>Payment on Delivery;</strong><strong> We spend a lot of resources in getting your products delivered to you, we kindly request that you only place an order when you are fully physically and financially prepared to receive your delivery. Thank you for your cooperation.</strong></em></span>
                <form className={styles.form} onSubmit={(e) => processOrder(e)}>
                    <label>Fullname</label>
                    <br />
                    <input
                        placeholder="Surname Firstname Othernames"
                        type="text"
                        onChange={(e) => setFullName(capitalizeFirstLetter(e.target.value))}
                        value={fullName}
                    />
                    <br />
                    <label>Phone Number</label> 
                    <br /> 
                    <div className={styles.number_form}>
                        <div className={styles.dial_code_container}>
                                <button className={styles.dial_code} onClick={(e) => showDropDown(e, "1")}>
                                <Image 
                                    className={styles.img}
                                    src={countryCode1?.flag?.src as unknown as string}
                                    alt=""
                                    width={countryCode1?.flag?.width as unknown as number}
                                    height={countryCode1?.flag?.height as unknown as number}
                                />
                                <span>{countryCode1?.dial_code}</span>
                                <span className={`${styles.arrow} ${dropList1 ? styles.active_arrow : ""}`}>{">"}</span>
                            </button>
                            <div className={`${styles.dial_code_option}`} style={{ display: dropList1 ? "flex" : "none"}}>
                                {countryList.map((country, cid) => (
                                    <button key={cid} onClick={(e) => chooseCode(e, "1", country)}>
                                        <Image
                                            className={styles.img} 
                                            src={country.flag?.src as unknown as string}
                                            alt=""
                                            width={country.flag?.width as unknown as number}
                                            height={country.flag?.height as unknown as number}
                                        />
                                        <span>{country.name?.common}</span>
                                        <span>{country.dial_code}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className={styles.number_input}>
                            <input 
                                placeholder="123456789"
                                type="tel"
                                onChange={(e) => setPhoneNumber1(e.target.value)}
                                value={phoneNumber1}
                            />
                        </div>

                    </div>
                    
                    <label>Other number (optional)</label>
                    <br />
                    <div className={styles.other_number_form}>
                        <div className={styles.dial_code_container}>
                            {countryCode2 ? (
                                <button className={styles.dial_code} onClick={(e) => showDropDown(e, "2")}>
                                <Image
                                    className={styles.img} 
                                    src={countryCode2.flag?.src as unknown as string}
                                    alt=""
                                    width={countryCode2.flag?.width as unknown as number}
                                    height={countryCode2.flag?.height as unknown as number}
                                />
                                <span>{countryCode2.dial_code}</span>
                                <span className={`${styles.arrow} ${dropList2 ? styles.active_arrow : ""}`}>{">"}</span>
                            </button>
                            ) : (
                                <></>
                            )}
                            <div className={`${styles.dial_code_option}`} style={{ display: dropList2 ? "flex" : "none"}}>
                                {countryList.map((country, cid) => (
                                    <button key={cid} onClick={(e) => chooseCode(e, "2", country)}>
                                        <Image
                                            className={styles.img} 
                                            src={country.flag?.src as unknown as string}
                                            alt=""
                                            width={country.flag?.width as unknown as number}
                                            height={country.flag?.height as unknown as number}
                                        />
                                        <span>{country.name?.common}</span>
                                        <span>{country.dial_code}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className={styles.number_input}>
                            <input 
                                placeholder="123456789"
                                type="tel"
                                onChange={(e) => setPhoneNumber2(e.target.value)}
                                value={phoneNumber2}
                            />
                        </div>
                    </div>
                    <label>Email Address</label>
                    <br />
                    <input
                        placeholder="example@mail.com"
                        type="email"
                        onChange={(e) => setEmailAddress(e.target.value)}
                        value={emailAddress}
                    />
                    <br />
                    <label>Country</label>
                    <br />
                    {countryCode1 ? (
                        <select value={country} onChange={(e) => onChange(e, "country")}>
                        {countryList.map((country, cid) => (
                            <option value={country.name?.common} key={cid}>{country.name?.common}</option>
                        ))}
                    </select>
                    ) : (
                        <></>
                    )}
                    
                    <br />
                    <label>State</label>
                    <br />
                    {countryInfo && countryInfo.states ? (
                        <select value={state} onChange={(e) => onChange(e, "state")}>
                            {countryInfo.states.map((state, sid) => (
                                <option value={state.name} key={sid}>{state.name}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            placeholder="State of residence"
                            type="text"
                            onChange={(e) => setState(capitalizeFirstLetter(e.target.value))}
                            value={state}
                        />
                    )}
                    <br />
                    <label>Postal Code</label>
                    <br />
                    <input
                        placeholder="Postal code"
                        type="text"
                        onChange={(e) => setPostalCode(e.target.value)}
                        value={postalCode}
                    />
                    <br />
                    <label>Delivery Address</label>
                    <br />
                    <input
                        placeholder="Address of delivery"
                        type="textarea"
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        value={deliveryAddress}
                    />
                    <br />
                    
                    <button className={styles.order_button}>
                        {isLoading ? (
                            <Loading width="20px" height="20px" />
                        ) : (
                            <>
                                <LocalShippingIcon className={styles.icon} />
                                <span>Order Now</span>
                            </>
                        )}
                    </button>
                </form>
            </main>
    );
};
  
export default Order;