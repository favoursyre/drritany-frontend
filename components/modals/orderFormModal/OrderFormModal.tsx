"use client"
///Order Form Modal component

///Libraries -->
import styles from "./orderFormModal.module.scss"
import { useModalBackgroundStore, useOrderFormModalStore, useClientInfoStore } from "@/config/store";
import { MouseEvent, useState, ChangeEvent, useEffect, FormEvent } from "react";
import Loading from "@/components/loadingCircle/Circle";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ICart, IClientInfo, ICountry, ICustomerSpec  } from "@/config/interfaces";
import { countryList } from "@/config/database";
import { notify, setItem, getItem } from "@/config/clientUtils";
import validator from "validator";
import { domainName, cartName, deliveryName, capitalizeFirstLetter, findStateWithZeroExtraDeliveryPercent, round, sleep, extraDeliveryFeeName, extractDigitsAfterDash } from "@/config/utils"

///Commencing the code 

/**
 * @title Order Form Modal Component
 * @returns The Order Form Modal component
 */
const OrderFormModal = () => {
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setOrderFormModal = useOrderFormModalStore(state => state.setOrderFormModal);
    const deliveryInfo__ = getItem(deliveryName)
    const [deliveryInfo, setDeliveryInfo] = useState<ICustomerSpec | null>(deliveryInfo__)
    const orderFormModal = useOrderFormModalStore(state => state.modal);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const clientInfo = useClientInfoStore(state => state.info)
    const router = useRouter()
    const [fullName, setFullName] = useState<string>(deliveryInfo ? deliveryInfo.fullName : "")
    const [phoneNumber1, setPhoneNumber1] = useState<string>(deliveryInfo && deliveryInfo.phoneNumbers[0] ? extractDigitsAfterDash(deliveryInfo.phoneNumbers[0]) : "")
    const [phoneNumber2, setPhoneNumber2] = useState<string>(deliveryInfo && deliveryInfo.phoneNumbers[1] ? extractDigitsAfterDash(deliveryInfo.phoneNumbers[1]) : "")
    const [emailAddress, setEmailAddress] = useState<string>(deliveryInfo ? deliveryInfo.email : "")
    const [country, setCountry] = useState<string>()
    const [countryInfo, setCountryInfo] = useState<ICountry | undefined>()
    const [state, setState] = useState<string | undefined>(deliveryInfo ? deliveryInfo.state : "")
    const [postalCode, setPostalCode] = useState<string>(deliveryInfo ? deliveryInfo.postalCode : "")
    const [deliveryAddress, setDeliveryAddress] = useState<string>(deliveryInfo ? deliveryInfo.deliveryAddress : "")
    const [countryCode1, setCountryCode1] = useState<ICountry>()
    const [countryCode2, setCountryCode2] = useState<ICountry>()
    const [dropList1, setDropList1] = useState(false)
    const [dropList2, setDropList2] = useState(false)
    const [extraDeliveryFee, setExtraDeliveryFee] = useState<number>(0) //Unit is in USD
    const cart_ = getItem(cartName)
    const [cart, setCart] = useState<ICart | null>(cart_)

    ///This function is triggered when the background of the modal is clicked
    const closeModal = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): Promise<void> => {
        e.preventDefault()

        //router.push("/")
        setOrderFormModal(false)
        await sleep(0.3)
        setModalBackground(false)
        //console.log("modal closed")
    }

    useEffect(() => {
        const interval = setInterval(() => {
            //setModalState(() => getModalState())

            console.log("test c: ", country)
            // if (country) {
            //     //Checking if the state has extraDeliveryPercent and notifying the client
            //     const countryInfo_ = countryList.find(country => country.name?.common === country) as unknown as ICountry
            //     setCountryInfo(() => countryInfo_)
            // }
        }, 100);
    
        return () => {
            clearInterval(interval);
        };
        
    }, [countryInfo]);

    useEffect(() => {
        //getClientInfo()
        
        if (clientInfo && clientInfo?.country) {
            //setCountryCode1(() => clientInfo.country)
            console.log("Loc: ", clientInfo)
            if (!countryCode1 && !countryCode2 && !country) {
                setCountryCode1(() => clientInfo.country)
                setCountryCode2(() => clientInfo.country)

                const country_ = clientInfo.country.name?.common as unknown as string
                setCountry(() => country_)
                const info = countryList.find(country => country.name?.common === clientInfo?.country?.name?.common)
                console.log("Country: ", info)
                setCountryInfo(() => info)

                const state_ = findStateWithZeroExtraDeliveryPercent(info)
                if (!state) {
                    setState(() => state_?.name)
                }
                //setExtraDeliveryFee(() => state_?.extraDeliveryPercent as unknown as number)
            }
        }
    }, [clientInfo, countryInfo]);
    
    ///This function is triggered when the form is submitted
    // const processOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault()

    //     if (cart) {
    //         ///Validating the required args
    //         if (cart?.cart.length === 0) {
    //             notify("error", "Cart is empty")
    //             return
    //         } else if (!fullName) {
    //             notify("error", "Fullname is required")
    //             return
    //         } else if (!phoneNumber1) {
    //             notify("error", "Phone number is required")
    //             return
    //         } else if (!emailAddress) {
    //             notify("error", "Email address is required")
    //             return
    //         } else if (!validator.isEmail(emailAddress)) {
    //             notify("error", "Email address is not valid")
    //             return
    //         } else if (!country) {
    //             notify("error", "Country address is required")
    //             return
    //         } else if (!state) {
    //             notify("error", "State is required")
    //             return
    //         } else if (!postalCode) {
    //             notify("error", "Postal code is required")
    //             return
    //         } else if (!deliveryAddress) {
    //             notify("error", "Delivery address is required")
    //             return
    //         }

    //         //
    //         setIsLoading(() => true)

    //         //Send the order to the backend
    //         try {
    //                 //console.log('Clicked')
    //                 const customerSpec: ICustomerSpec = {fullName, email: emailAddress, phoneNumbers: [`${countryCode1?.dial_code}-${phoneNumber1}`, `${countryCode2?.dial_code}-${phoneNumber2}`], country, state, deliveryAddress, postalCode}
    //                 const newDeliveryFee = cart.deliveryFee + extraDeliveryFee
    //                 cart.deliveryFee = Number(newDeliveryFee.toFixed(2))
    //                 setCart(() => ({ ...cart }))
    //                 const productSpec: ICart = cart
    //                 const clientInfo_ = clientInfo as unknown as IClientInfo
    //                 const order = {customerSpec, productSpec, clientInfo_}
    //                 console.log("Order_: ", order)
    //                 const res = await fetch(`${domainName}/api/order`, {
    //                     method: 'POST',
    //                     //body: JSON.stringify({ customerSpec, productSpec, clientInfo_ }),
    //                     body: JSON.stringify(order),
    //                     headers: {
    //                     'Content-Type': 'application/json',
    //                     },
    //                 });
                    
    //             const data = await res.json();
            
    //             console.log("Data: ", data);

    //             if (res.ok) {
    //                 notify("success", `Your order was logged successfully`)

    //                 setModalBackground(true)
    //                 setOrderFormModal(true)

    //                 setIsLoading(() => false)

    //                 //Clear the cart
    //                 const _cart_: ICart = {
    //                     totalPrice: 0,
    //                     totalDiscount: 0,
    //                     totalWeight: 0,
    //                     deliveryFee: 0,
    //                     cart: []
    //                 }

    //                 setItem(cartName, _cart_)
    //             } else {
    //                 //setModalState(() => false)
    //                 //notify("error", `Something went wrong`)
    //                 throw Error(`${data}`)
    //             }
                
    //             //setItem(orderName, order)

    //             //Send the user an email

    //             //Setting the modal state to true
    //             //setModalState(true)
    //         } catch (error) {
    //             console.log("error: ", error)
    //             notify("error", `${error}`)
    //         }

    //         //setModalState(() => false)
    //         setIsLoading(() => false)
    //     } else {
    //         notify('error', "Cart is empty")
    //         return
    //     }
    // }

    ///This function saves the delivery info
    const saveDeliveryInfo = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>):Promise<void> => {
        e.preventDefault()
        //console.log("Seen")

        if (!fullName) {
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

        setIsLoading(() => true)

        try {
            const customerSpec: ICustomerSpec = {fullName, email: emailAddress, phoneNumbers: [`${countryCode1?.dial_code}-${phoneNumber1}`, `${countryCode2?.dial_code}-${phoneNumber2}`], country, state, deliveryAddress, postalCode}
            setItem(deliveryName, customerSpec)
            //router.refresh()
            await sleep(1.5)
            setOrderFormModal(false)
            await sleep(0.3)
            setModalBackground(false)
            setIsLoading(false)
            window.location.reload()
        } catch (error) {
            console.log("Save Delivery Error: ", error)
            setIsLoading(false)
        }
    }

    // const saveDeliveryInfo = async (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>):Promise<void> => {
    //     e.preventDefault()
    //     console.log("Seen")
    // }

    //This handles the handle change effect
  const onChange = (e: ChangeEvent<HTMLSelectElement>, label: string) => {
    e.preventDefault()

    console.log("Select Val: ", e.target.value)

    if (label === "country") {
        setCountry(e.target.value);

        const countryInfo_ = countryList.find(country => country.name?.common === e.target.value) as unknown as ICountry
        setCountryInfo(() => countryInfo_)
    } else if (label === "state") {
        if (cart && clientInfo?.country?.currency?.exchangeRate) {
            setState(e.target.value)
            const symbol = clientInfo.country.currency.symbol
        
            //Checking if the state has extraDeliveryPercent and notifying the client
            const state_ = countryInfo?.states?.find(states => states.name === e.target.value)
            
            if (state_?.extraDeliveryPercent === 0) {
                    const total = round((cart.totalPrice - cart.totalDiscount + cart.deliveryFee) * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")
                    notify("info", `Your total order amount is ${symbol}${total}`)
                    setItem(extraDeliveryFeeName, 0)
                
            } else {
                if (state_?.extraDeliveryPercent && cart?.deliveryFee) {
                    const extraDeliveryFee = (state_?.extraDeliveryPercent / 100) * cart?.deliveryFee
                    setExtraDeliveryFee(() => extraDeliveryFee)
                    setItem(extraDeliveryFeeName, extraDeliveryFee)
                    const formatExtraDeliveryFee = round(extraDeliveryFee * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")
                    const total = round((cart.totalPrice - cart.totalDiscount + cart.deliveryFee + extraDeliveryFee) * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")
                    notify("info", `Delivery to ${e.target.value} gets an additional delivery charge of ${symbol}${formatExtraDeliveryFee}. Your total order amount is ${symbol}${total}`)
                }
            }
        }
    }
};

  ///This function is triggered when the choose code is clicked
  const chooseCode = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, position: string | number, country: ICountry) => {
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
  const showDropDown = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, position: string | number) => {
    e.preventDefault()

    if (position === "1") {
        setDropList1(!dropList1)
        //console.log("drop 1")
    } else if (position === "2") {
        //console.log("drop 2")
        setDropList2(!dropList2)
    }
  }

  return (
    <div className={`${styles.main} ${orderFormModal ? styles.activeState : styles.inactiveState}`}>
        <div className={styles.modal_head}>
            <button onClick={(e) => closeModal(e)} >
                <CloseIcon className={styles.icon} />
            </button>
        </div>
        <form className={styles.form}>
                    <label >
                        Fullname
                        <input placeholder="Surname Firstname Othernames" type="text" onChange={(e) => setFullName(capitalizeFirstLetter(e.target.value))}
                            value={fullName}
                        />
                    </label>
                    <br />
                    <label>
                        Phone Number
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
                    </label> 
                    {/* <br />  */}
                    <label>
                        Other number (optional)
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
                    </label>
                    {/* <br /> */}
                    <label>
                        Email Address
                        <input
                            placeholder="example@mail.com"
                            type="email"
                            onChange={(e) => setEmailAddress(e.target.value)}
                            value={emailAddress}
                        />
                    </label>
                    <br />
                    <label>
                        Country
                        {countryCode1 ? (
                            <select value={country} onChange={(e) => onChange(e, "country")}>
                            {countryList.map((country, cid) => (
                                <option value={country.name?.common} key={cid}>{country.name?.common}</option>
                            ))}
                        </select>
                        ) : (
                            <></>
                        )}
                    </label>
                    <br />
                    <label>
                        State
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
                    </label>
                    <br />
                    <label>
                        Postal Code
                        <input
                            placeholder="Postal code"
                            type="text"
                            onChange={(e) => setPostalCode(e.target.value)}
                            value={postalCode}
                        />
                    </label>
                    <br />
                    <label>
                        Delivery Address
                        <input
                            placeholder="Address of delivery"
                            type="textarea"
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            value={deliveryAddress}
                        />
                    </label>
                    <br />
                    <button className={styles.order_button} onClick={(e) => saveDeliveryInfo(e)}>
                        {isLoading ? (
                            <Loading width="20px" height="20px" />
                        ) : (
                            <>
                                <span>Submit</span>
                            </>
                        )}
                    </button>
                </form>
                
    </div>
  );
};

export default OrderFormModal;