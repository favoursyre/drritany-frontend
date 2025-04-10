"use client"
///Header component

///Libraries -->
import Image from "next/image";
import { useState, useEffect, MouseEvent, FormEvent, useCallback } from 'react';
import styles from "./header.module.scss"
import { ICart, IProduct, IProductFilter, IButtonResearch, IClientInfo, IOrder } from '@/config/interfaces';
import { getDevice, getItem, getOS, notify, setItem } from "@/config/clientUtils"
import { routeStyle, cartName, wishListName, sleep, productFilterName, getCurrentDate, getCurrentTime, storeButtonInfo, extractBaseTitle, userIdName, clientInfoName, orderName, backend, logo, getUserOrders } from '@/config/utils'
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCartOutlined, FavoriteBorder, Search, Menu, ArrowBack, Close, AccountCircleOutlined, KeyboardArrowRight } from "@mui/icons-material";
import Loading from "../loadingCircle/Circle";
import { useModalBackgroundStore, useContactModalStore, useLoadingModalStore, useClientInfoStore } from "@/config/store";

///Commencing the code 
/**
 * @title Header Component
 * @returns The Header component
 */
const Header = () => {
  const [search, setSearch] = useState<boolean>(false)
  const [menu, setMenu] = useState<boolean>(false)
  const [query, setQuery] = useState<string>("")
  const [searchIsLoading, setSearchIsLoading] = useState<boolean>(false)
  const [cartIsLoading, setCartIsLoading] = useState<boolean>(false)
  const [wishIsLoading, setWishIsLoading] = useState<boolean>(false)
  const [wishList, setWishList] = useState<Array<IProduct>>(getItem(wishListName))
  const [orders, setOrders] = useState<Array<IOrder>>()
  const cart__ = getItem(cartName) 
  const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
  //const clientInfo = useClientInfoStore(state => state.info)
  const setContactModal = useContactModalStore(state => state.setContactModal);
  const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal);
  const [cart, setCart] = useState<ICart | null>(cart__)
  //console.log("Cart New: ", cart)
  const routerPath = usePathname();
  const router = useRouter()
  const [scrollY, setScrollY] = useState<number | undefined>(undefined);
  const _clientInfo = getItem(clientInfoName)
  const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo!)
  const [accountModal, setAccountModal] = useState<boolean>(false)
  const _userId = getItem(userIdName)
  const [userId, setUserId] = useState<string>(_userId!)
  const [mounted, setMounted] = useState(false);

  //For client rendering
  useEffect(() => {
    setMounted(true);

    // const getUserOrders = async (userId: string) => {
    //     if (!userId) {
    //       return
    //     }
    
    //     try {
    //       const res = await fetch(`${backend}/order?userId=${userId}`, {
    //         method: "GET",
    //         //cache: "no-store",
    //       })
      
    //       if (res.ok) {
    //         const data = await res.json()
    //         console.log("data kk: ", data) 
    //       } else {
    //         getUserOrders(userId)
    //       }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // getUserOrders(userId)
  }, []);

  //Updating client info
  useEffect(() => {
    //console.log("Header")
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
          //console.log("Client info detected")
      }  

  }, [clientInfo])

  useEffect(() => {
    const interval = setInterval(() => {
        if (typeof window !== undefined) {
            //Updating scroll position
            setScrollY(() => window.scrollY)
        }

        //Updating cart info
        const cart__ = getItem(cartName)
        setCart(() => cart__)

        //Updating wish list
        const wishList__ = getItem(wishListName)
        setWishList(() => wishList__)
      }, 1000);
  
      return () => {
        clearInterval(interval);
      };
    
  }, [scrollY, cart, wishList]);

  ///This function is triggered when the user clicks on contact
  const openContactModal = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault()

    setContactModal(true)
    setModalBackground(true)
}

  //This function is trigerred when a user clicks on account
  const viewAccountModal = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault()

    setAccountModal(() => !accountModal)
  }

  //This handles the search
  const onSearch = async (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault()

    //Setting the product filter settings
    const filterSettings: IProductFilter = {
      filterId: 0,
      category: "All"
    }
    setItem(productFilterName, filterSettings)

    if (query) {
      //setSearchIsLoading(() => true)
      setModalBackground(true)
      setLoadingModal(true)

      console.log("searching: ", query)
      router.push(`/products?query=${query}`)
      //window.location.reload()
      //window.open(window.location.href, "")
    } 
    setSearch(() => false)

    // setSearchIsLoading(() => false)
  }

  ///This clears the search bar 
  const clearSearch = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault()
    setQuery("")
  }

  //This function is trigerred when the user clicks on cart
  const viewCart = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault()

    //Setting the loading
    setModalBackground(true)
    setLoadingModal(true)

    router.push("/cart")
    //await sleep()
  }

  //This function is triggered when the user clicks on wish list
  const viewWishList = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault()

    if (wishList === undefined || wishList?.length === 0) {
      notify("info", "Your wish list is empty")
    } else {
      //Setting the loading
      setModalBackground(true)
      setLoadingModal(true)
      
      router.push("/wishlist")
    }
  }

  //This function is trigerred when someone clicks on product
  const clickNav = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, nav: string) => {
    e.preventDefault()

    //Setting the loading
    setModalBackground(true)
    setLoadingModal(true)

    //Storing this info in button research
    const info: IButtonResearch = {
      ID: getItem(userIdName),
      IP: clientInfo?.ip!,
      Country: clientInfo?.country?.name?.common!,
      Button_Name: "viewNavBar()",
      Button_Info: `Clicked ${nav} in header`,
      Page_Title: extractBaseTitle(document.title),
      Page_URL: routerPath,
      Date: getCurrentDate(),
      Time: getCurrentTime(),
      OS: getOS(),
      Device: getDevice()
    }
    storeButtonInfo(info)

    if (nav === "about") {
      router.push('/about')
    } else if (nav === "products") {
      //Setting the product filter settings
      const filterSettings: IProductFilter = {
        filterId: 0,
        category: "All"
      }
      setItem(productFilterName, filterSettings)

      setMenu(() => false)
      router.push('/products')
    }
  }

  //This function is trigerred when an account modal option is clicked
  const chooseAccountModalOption = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, action: "wishlist" | "orders") => {
    e.preventDefault()

    setAccountModal(false)

    if (action === "wishlist") {
      if (wishList && wishList.length > 0) {
        setModalBackground(true)
        setLoadingModal(true)

        router.push("/wishlist")
      } else {
        notify("info", "Wishlist is empty")
      }
    } else if (action === "orders") {
      // if (orders && orders.length > 0) {
      //   setModalBackground(true)
      //   setLoadingModal(true)

      //   if (userId) {
      //     router.push(`/order?userId=${userId}`)
      //   } else {
      //     notify("error", "User not detected")
      //   }
        
      // } else {
      //   notify("info", "You have no orders")
      // }

      if (userId) {
        setModalBackground(true)
        setLoadingModal(true)

        router.push(`/order?userId=${userId}`)

        setModalBackground(false)
        setLoadingModal(false)
      } else {
        notify("error", "User not detected")
      }
    }
  }

  return (
    <>
      <header className={`${styles.header} ${scrollY! >= 1 ? styles.scrolled : ""} ${routeStyle(routerPath, styles)}`}>
        <button className={styles.menu_button} onClick={() => setMenu(true)}>
          <Menu className={styles.icon} />
        </button>
        <div className={styles.logo} onClick={() => router.push('/')}>
          <Image
            className={styles.img}
            src={logo.src}
            alt={logo.alt!}
            width={logo.width}
            height={logo.height}
          />
        </div>
        <div className={`${styles.links}`}>
          <button onClick={(e) => clickNav(e, "about")}><span>About Us</span></button>
          <button onClick={(e) => clickNav(e, "products")}><span>Products</span></button>
          <button onClick={(e) => openContactModal(e)}>
            <span>Contact Us</span>
          </button>
        </div>
        <div id={styles.search_cart}>
          <div id={styles.search}>
            {search === false ? (
              <button onClick={() => setSearch(true)}>
                {searchIsLoading ? (
                    <Loading width="10px" height="10px" />
                  ) : (
                    <Search />
                  )}
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
                  {searchIsLoading ? (
                    <Loading width="10px" height="10px" />
                  ) : (
                    <Search style={{ fontSize: "1.1rem" }} className={styles.icon} />
                  )}
                </button>
              </form>
            )}
          </div>
         {/* <div id={styles.wishList}>
            {wishIsLoading ? (
              <Loading width="10px" height="10px" />
            ) : (
              <button onClick={(e) => viewWishList(e)}>
                <div id={styles.wishIcon}>
                  <FavoriteBorder className={styles.wish} />
                </div>
                <div id={wishList && wishList.length !== 0 ? styles.active_wish : styles.empty_wish}>
                  <span>{wishList?.length}</span>
                </div>
              </button>
            )}
          </div> */}
          <div id={styles.cart}>
            {cartIsLoading ? (
              <Loading width="10px" height="10px" />
            ) : (
              <button onClick={(e) => viewCart(e)}>
                <div className={styles.cartIcon}>
                    <ShoppingCartOutlined className={styles.cart} />
                </div>
                <div className={mounted && cart && cart.cart.length > 0 ? styles.active_cart : styles.empty_cart}>
                  <span>{mounted ? cart?.cart.length : ""}</span>
                </div>
              </button>
            )}
          </div>
          <div id={styles.account}>
            <button onClick={(e) => viewAccountModal(e)}>
              <AccountCircleOutlined className={styles.accountIcon} />
              <KeyboardArrowRight className={styles.arrIcon} />
            </button>
            <div className={`${styles.modal_option} ${!accountModal ? styles.inactiveAccountModal : ""}`}>
              <button className={styles.wish} onClick={(e) => chooseAccountModalOption(e, "wishlist")}>
                <span>Wishlist ({mounted && wishList ? wishList.length : 0})</span>
              </button>
              <button className={styles.orders} onClick={(e) => chooseAccountModalOption(e, "orders")}>
                <span>Orders</span>
                {/* <span>Orders ({mounted && orders ? orders.length : 0})</span> */}
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className={`${search ? styles.activeSearch : styles.inActiveSearch}`}>
        <form className={`${styles.search_form}`} onSubmit={(e) => onSearch(e)}>
          <button className={styles.arrow_left} type="button" onClick={() => setSearch(false)}>
              <ArrowBack />
            </button>
            <input 
              type="text" 
              placeholder="Search" 
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
            <button className={styles.close} type="button" onClick={(e) => clearSearch(e)}>
              <Close />
            </button>
            <button className={styles.search_icon} type="submit">
              <Search className={styles.icon} />
            </button>
          </form>
      </div>
      <div className={`${menu ? styles.activeMenu : styles.inActiveMenu}`}>
          <div className={styles.menu_heading}>
            <button className={styles.close_button} onClick={() => setMenu(false)}>
              <Close />
            </button>
            <div className={styles.logo} onClick={() => {
              setMenu(() => false)
              router.push('/')
            }}>
              <Image
                className={styles.img}
                src="https://drive.google.com/uc?export=download&id=1V-QyvBujfHsM0fIimUT3PL2DwjZCWJXG"
                alt=""
                width={2500}
                height={2500}
              />
            </div>
          </div>
          <button className={`${styles.links} ${routerPath === "/about" ? styles.activeLink : styles.inactiveLink}`} onClick={(e) => {
            setMenu(() => false)
            clickNav(e, "about")
          }}>
            <span>About Us</span>
          </button>
          <button className={styles.links} onClick={(e) => clickNav(e, "products")}>
            <span>Products</span>
          </button>
          <button 
            className={`${styles.links}`} 
            onClick={(e) => {
              setMenu(() => false)
              openContactModal(e)
            }}
          >
            <span>Contact Us</span>
          </button>
      </div>
    </>
  );
};

export default Header;