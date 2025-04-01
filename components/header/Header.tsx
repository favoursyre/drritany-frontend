"use client"
///Header component

///Libraries -->
import Image from "next/image";
import { useState, useEffect, MouseEvent, FormEvent, useCallback } from 'react';
import styles from "./header.module.scss"
import { ICart, IProduct, IProductFilter, IButtonResearch } from '@/config/interfaces';
import { getDevice, getItem, getOS, notify, setItem } from "@/config/clientUtils"
import { routeStyle, cartName, wishListName, sleep, productFilterName, getCurrentDate, getCurrentTime, storeButtonInfo, extractBaseTitle, userIdName } from '@/config/utils'
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCartOutlined, FavoriteBorder, Search, Menu, ArrowBack, Close } from "@mui/icons-material";
import Loading from "../loadingCircle/Circle";
import { useModalBackgroundStore, useContactModalStore, useLoadingModalStore, useClientInfoStore } from "@/config/store";
import { logo } from "@/config/utils";

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
  const cart__ = getItem(cartName) 
  const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
  const clientInfo = useClientInfoStore(state => state.info)
  const setContactModal = useContactModalStore(state => state.setContactModal);
  const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal);
  const [cart, setCart] = useState<ICart | null>(cart__)
  //console.log("Cart New: ", cart)
  const routerPath = usePathname();
  const router = useRouter()
  const [scrollY, setScrollY] = useState<number | undefined>(undefined);

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
      setSearchIsLoading(() => true)
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
          <div id={styles.wishList}>
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
          </div>
          <div id={styles.cart}>
            {cartIsLoading ? (
              <Loading width="10px" height="10px" />
            ) : (
              <button onClick={(e) => viewCart(e)}>
                <div id={styles.cartIcon}>
                    <ShoppingCartOutlined className={styles.cart} />
                </div>
                <div id={cart && cart.cart.length > 0 ? styles.active_cart : styles.empty_cart}>
                  <span>{cart?.cart.length}</span>
                </div>
              </button>
            )}
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