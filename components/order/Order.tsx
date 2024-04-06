"use client"
///Order component

///Libraries -->
import styles from "./order.module.scss"
import React, { useState, useEffect } from "react"
import { ToastContainer } from 'react-toastify';
import { setItem, getItem, notify } from '@/config/clientUtils';
import { domainName, getItemByKey, cartName, orderName, capitalizeFirstLetter } from "@/config/utils"
import { ICart, ICountry, IClientInfo, ICustomerSpec } from "@/config/interfaces";
import validator from "validator";
import CloseIcon from '@mui/icons-material/Close';
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
    const clientInfo: IClientInfo = getItem("clientInfo")
    const [fullName, setFullName] = useState<string | undefined>("")
    const [phoneNumber1, setPhoneNumber1] = useState<string>("")
    const [phoneNumber2, setPhoneNumber2] = useState<string>("")
    const [emailAddress, setEmailAddress] = useState<string>("")
    const [country, setCountry] = useState("United States")
    const [modalState, setModalState] = useState(false)
    const [state, setState] = useState<string | undefined>("")
    const [postalCode, setPostalCode] = useState<string>("")
    const [deliveryAddress, setDeliveryAddress] = useState<string>("")
    const [countryCode1, setCountryCode1] = useState<ICountry>(clientInfo ? getItemByKey(countryList, 'code', clientInfo.countryCode)[0] : countryList[0])
    const [countryCode2, setCountryCode2] = useState(clientInfo ? getItemByKey(countryList, 'code', clientInfo.countryCode)[0] : countryList[0])
    const [dropList1, setDropList1] = useState(false)
    const [dropList2, setDropList2] = useState(false)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    //console.log("Testing: ", getItemByKey(countryList, 'code', "SQ"))
    

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

            setModalState(() => true)

            //Send the order to the backend
            try {
                    //console.log('Clicked')
                    const customerSpec: ICustomerSpec = {fullName, email: emailAddress, phoneNumbers: [`${countryCode1.dial_code}-${phoneNumber1}`, `${countryCode2.dial_code}-${phoneNumber2}`], country, state, deliveryAddress, postalCode}
                    const productSpec: ICart = cart
                    const order = {customerSpec, productSpec, clientInfo}
                    console.log("Order: ", order)
                    const res = await fetch(`${domainName}/api/order`, {
                        method: 'POST',
                        body: JSON.stringify({ customerSpec, productSpec }),
                        headers: {
                        'Content-Type': 'application/json',
                        },
                    });
                    
                const data = await res.json();
            
                console.log("Data: ", data);

                if (res.ok) {
                    notify("success", `Your order was logged successfully`)

                    setIsLoading(() => false)

                    //Clear the cart
                    const _cart_: ICart = {
                        totalPrice: 0,
                        cart: []
                    }

                    setItem(cartName, _cart_)
                } else {
                    setModalState(() => false)
                    notify("error", `Something went wrong`)
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

            setModalState(() => false)
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
  const onChange = (e: any) => {
    setCountry(e.target.value);
  };

  ///This function is triggered when the choose code is clicked
  const chooseCode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, position: string | number, country: ICountry) => {
    e.preventDefault()

    console.log("Position: ", typeof position)
    if (position === "1") {
        setDropList1(false)
        //console.log("Country1: ", country)
        setCountryCode1(country)
        //console.log("Country code: ", countryCode1)
    } else if (position === "2") {
        setDropList2(false)
        //console.log("Country2: ", country)
        setCountryCode2(country)
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
        <>
            <main className={styles.main}>
                <ToastContainer />
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
                                    src={countryCode1.flag.src}
                                    alt=""
                                    width={countryCode1.flag.width}
                                    height={countryCode1.flag.height}
                                />
                                <span>{countryCode1.dial_code}</span>
                                <span className={`${styles.arrow} ${dropList1 ? styles.active_arrow : ""}`}>{">"}</span>
                            </button>
                            <div className={`${styles.dial_code_option}`} style={{ display: dropList1 ? "flex" : "none"}}>
                                {countryList.map((country, cid) => (
                                    <button key={cid} onClick={(e) => chooseCode(e, "1", country)}>
                                        <Image
                                            className={styles.img} 
                                            src={country.flag.src}
                                            alt=""
                                            width={country.flag.width}
                                            height={country.flag.height}
                                        />
                                        {country.dial_code}
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
                            <button className={styles.dial_code} onClick={(e) => showDropDown(e, "2")}>
                                <Image
                                    className={styles.img} 
                                    src={countryCode2.flag.src}
                                    alt=""
                                    width={countryCode2.flag.width}
                                    height={countryCode2.flag.height}
                                />
                                <span>{countryCode2.dial_code}</span>
                                <span className={`${styles.arrow} ${dropList2 ? styles.active_arrow : ""}`}>{">"}</span>
                            </button>
                            <div className={`${styles.dial_code_option}`} style={{ display: dropList2 ? "flex" : "none"}}>
                                {countryList.map((country, cid) => (
                                    <button key={cid} onClick={(e) => chooseCode(e, "2", country)}>
                                        <Image
                                            className={styles.img} 
                                            src={country.flag.src}
                                            alt=""
                                            width={country.flag.width}
                                            height={country.flag.height}
                                        />
                                        {country.dial_code}
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
                    <select value={countryCode1.name} onChange={onChange}>
                        {countryList.map((country, cid) => (
                            <option value={country.name} key={cid}>{country.name}</option>
                        ))}
                    </select>
                    <br />
                    <label>State</label>
                    <br />
                    <input
                        placeholder="State of residence"
                        type="text"
                        onChange={(e) => setState(capitalizeFirstLetter(e.target.value))}
                        value={state}
                    />
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
                        <LocalShippingIcon className={styles.icon} />
                        <span>Order Now</span>
                    </button>
                </form>
            </main>
            <div className={`${styles.modal_container} ${!modalState ? styles.modal_inactive : ""}`}>
                <div className={`${styles.modal}`}>
                    {isLoading ? (
                        <div className={styles.loadingModal}>
                            <span>Processing order...</span>
                            <Loading width="30px" height="30px" />
                        </div>
                    ) : (
                        <div className={styles.completeModal}>
                            <div className={styles.modal_head}>
                            <button 
                                onClick={() => {
                                    setModalState(() => false)
                                    window.location.reload()
                                    router.push("/")
                                }}
                            >
                                <CloseIcon />
                            </button>
                            </div>
                            <div className={styles.modal_image}>
                                <Image
                                    className={styles.img} 
                                    src="https://drive.google.com/uc?export=download&id=16aHqsYZeXgATabkyTI_HN6jdglBYwvjz"
                                    alt=""
                                    width={221}
                                    height={216}
                                />
                            </div>
                            <span className={styles.modal_body}>Thanks for Ordering</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
  
export default Order;