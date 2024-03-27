"use client"
///Header component

///Libraries -->
import Image from "next/image";
import { useState, useEffect, MouseEvent, FormEvent } from 'react';
import styles from "./header.module.scss"
import { ICart, IInquiry, IClientInfo } from '@/app/utils/interfaces';
import { notify } from '@/app/utils/clientUtils';
import { setItem, getItem } from "../../utils/clientUtils"
import { getModalState, routeStyle, capitalizeFirstLetter, backend, cartName, } from '../../utils/utils'
import { usePathname, useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validator from 'validator';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

///Commencing the code 

/**
 * @title Header Component
 * @returns The Header component
 */
const Header = ({ clientInfo }: { clientInfo: IClientInfo }) => {
  const [search, setSearch] = useState(false)
  const [menu, setMenu] = useState(false)
  const [query, setQuery] = useState(String)
  //const [modalState, setModalState] = useState(getModalState())
  const cart__ = getItem(cartName) 
  //console.log("Cart: ", cart__)
  const [cart, setCart] = useState<ICart | null>(cart__)
  //console.log("Cart New: ", cart)
  const routerPath = usePathname();
  const router = useRouter()
  const [contactModal, setContactModal] = useState<boolean>(false)
  const [firstName, setFirstName] = useState<string | undefined>("") 
  const [lastName, setLastName] = useState<string | undefined>("")
  const [emailAddress, setEmailAddress] = useState<string | undefined>("")
  const [message, setMessage] = useState<string | undefined>("")
  //console.log('Length: ', cart)

  //console.log("Path: ", window.location.hostname)

  const item = getItem("clientInfo")
 if (item === null || item === "undefined") {
    setItem("clientInfo", clientInfo)
  } else {
    null
  }

  const urlRouter = async (query: string) => {
    router.push(`/products/search?query=${query}`)
  }

  //This handles the search
  const onSearch = async (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault()

    if (query) {
      console.log("searching: ", query)
      router.push(`/products/search?query=${query}`)
      //window.location.reload()
      //window.open(window.location.href, "")
    } 
    setSearch(() => false)
  }

  ///This clears the search bar 
  const clearSearch = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault()
    setQuery("")
  }

  ///This sends the message from contact-us
  const sendInquiry = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    //Validating args
    if (!firstName) {
      notify("error", "First Name is required")
      return
    } else if (!lastName) {
        notify("error", "Last Name is required")
        return
    } else if (!emailAddress) {
        notify("error", "Email address is required")
        return
    } else if (!validator.isEmail(emailAddress)) {
        notify("error", "Email address is not valid")
        return
    } else if (!message) {
        notify("error", "Message is required")
        return
    }

    //Send the order to the backend
    try {
      //console.log('Clicked')
      const inquiry: IInquiry = {firstName, lastName, emailAddress, message}
      console.log("Order: ", inquiry)
      const res = await fetch(`${backend}/inquiry/add/`, {
          method: 'POST',
          body: JSON.stringify(inquiry),
          headers: {
          'Content-Type': 'application/json',
          },
      });
      
    const data = await res.json();
    console.log("Data: ", data);

    if (res.ok) {
      notify("success", `Your message was sent successfully`)
      setContactModal(() => false)
      typeof window !== 'undefined' && window.location ? window.location.reload() : null
    } else {
      throw Error(`${data}`)
    }
    
    } catch (error) {
        console.log("error: ", error)
        notify("error", `${error}`)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      }, 100);
  
      return () => {
        clearInterval(interval);
      };
    
  }, [cart]);

  
  //console.log('Current page:', routerPath);

  return (
    <>
      <header className={`${styles.header} ${routeStyle(routerPath, styles)}`}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          <img
            src="https://drive.google.com/uc?export=download&id=1RbUo9BSAyxfNmzVV_dzjC7E4nT9ZtbnV"
            alt=""
          />
        </div>
        
        <div className={`${styles.links}`}>
          <button onClick={() => router.push('/about')}><span>About Us</span></button>
          <button onClick={() => router.push('/#products')}><span>Products</span></button>
          <button onClick={() => setContactModal(() => true)}>
            <span>Contact Us</span>
          </button>
        </div>
        <div id={styles.search_cart}>
          <div id={styles.search}>
            {search === false ? (
              <button onClick={() => setSearch(true)}>
                <SearchIcon />
              </button>
            ) : (
              <form className={`${styles.search_form}`} onSubmit={(e) => {
                onSearch(e)
                //window.location.reload()
              }}>
                <input 
                  type="text" 
                  placeholder="Search" 
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                />
                <button >
                  <SearchIcon style={{ fontSize: "1.1rem" }} className={styles.icon} />
                </button>
              </form>
            )}
          </div>
          <div id={styles.cart}>
            <button onClick={() => router.push("/cart")}>
              <div id={styles.cartIcon}>
                <ShoppingCartIcon className={styles.cart} />
              </div>
              <div id={cart && cart.cart.length > 0 ? styles.active_cart : styles.empty_cart}>
                <span>{cart?.cart.length}</span>
              </div>
            </button>
          </div>
        </div>
        <hr className={styles.slash} />
      </header>
      <header className={`${styles.mobile_header} ${routeStyle(routerPath, styles)}`}>
        <button className={styles.menu_button} onClick={() => setMenu(true)}>
          <MenuIcon />
        </button>
        <div className={styles.logo} onClick={() => router.push('/')}>
          <img
            src="https://drive.google.com/uc?export=download&id=1RbUo9BSAyxfNmzVV_dzjC7E4nT9ZtbnV"
            alt=""
          />
        </div>
        <div className={styles.search_cart}>
          <div className={styles.search}>
              <button onClick={() => setSearch(true)}>
                <SearchIcon />
              </button>
          </div>
        <div className={styles.cart}>
            <button onClick={() => router.push("/cart")}>
              <ShoppingCartIcon className={styles.cartIcon} />
              <div id={cart !== null && cart.cart.length > 0 ? styles.active_cart : styles.empty_cart}>
                <span>{cart?.cart.length}</span>
              </div>
            </button>
          </div>
        </div>
      </header>
      <div className={`${search ? styles.activeSearch : styles.inActiveSearch}`}>
        <form className={`${styles.search_form}`} onSubmit={(e) => onSearch(e)}>
          <button className={styles.arrow_left} type="button" onClick={() => setSearch(false)}>
              <ArrowBackIcon />
            </button>
            <input 
              type="text" 
              placeholder="Search" 
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
            <button className={styles.close} type="button" onClick={(e) => clearSearch(e)}>
              <CloseIcon />
            </button>
            <button className={styles.search_icon} type="submit">
              <SearchIcon className={styles.icon} />
            </button>
          </form>
      </div>
      <div className={`${menu ? styles.activeMenu : styles.inActiveMenu}`}>
          <div className={styles.menu_heading}>
            <button className={styles.close_button} onClick={() => setMenu(false)}>
              <CloseIcon />
            </button>
            <div className={styles.logo} onClick={() => {
              setMenu(() => false)
              router.push('/')
            }}>
              <img
                src="https://drive.google.com/uc?export=download&id=1RbUo9BSAyxfNmzVV_dzjC7E4nT9ZtbnV"
                alt=""
              />
            </div>
          </div>
          <button className={`${styles.links} ${routerPath === "/about" ? styles.activeLink : styles.inactiveLink}`} onClick={() => {
            setMenu(() => false)
            router.push('/about')
          }}>
            <span>About Us</span>
          </button>
          <button className={styles.links} 
            onClick={() => {
              setMenu(() => false)
              router.push('/#products')
          }}>
            <span>Products</span>
          </button>
          <button 
            className={`${styles.links}`} 
            onClick={() => {
              setMenu(() => false)
              setContactModal(() => true)
            }}
          >
            <span>Contact Us</span>
          </button>
      </div>
      <div className={`${styles.contactModal} ${!contactModal ? styles.inActiveContactModal : ""}`}>
        <ToastContainer />
        <div className={styles.container}>
          <div className={styles.image}>
            <img
              src="https://drive.google.com/uc?export=download&id=1tOFnt216d95o48IA5mdLQe1lhyq6Sbrt"
              alt=""
            />
          </div>
          <div className={styles.form}>
            <header>
              <button onClick={() => setContactModal(() => false)}>
                <CloseIcon />
              </button>
            </header>
            <div className={styles.brief}>
              <span id={styles.brief_1}>
                <strong>We&apos;d love to help</strong>
              </span>
              <span id={styles.brief_2}>Reach out and we&apos;ll get in touch within 24 hours</span>
            </div>
            <form onSubmit={(e) => sendInquiry(e)}>
              <div className={styles.div_1}>
                <div className={styles.div_11}>
                  <input
                    placeholder="First Name"
                    type="text"
                    onChange={(e) => setFirstName(() => capitalizeFirstLetter(e.target.value))}
                    value={firstName}
                  />
                </div>
                <div className={styles.div_12}>
                  <input
                    placeholder="Last Name"
                    type="text"
                    onChange={(e) => setLastName(() => capitalizeFirstLetter(e.target.value))}
                    value={lastName}
                  />
                </div>
              </div>
              <div className={styles.div_2}>
                <input
                  placeholder="Email Address"
                  type="email"
                  onChange={(e) => setEmailAddress(() => e.target.value)}
                  value={emailAddress}
                />
              </div>
              <div className={styles.div_3}>
                <textarea
                  placeholder="Message"
                  onChange={(e) => setMessage(() => e.target.value)}
                  value={message}
                ></textarea>
              </div>
              <button>
                <span>SEND</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;