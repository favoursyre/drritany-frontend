"use client"
///Header component

///Libraries -->
import Image from "next/image";
import { useState, useEffect, MouseEvent, FormEvent, useCallback } from 'react';
import styles from "./header.module.scss"
import { ICart } from '@/config/interfaces';
import { getItem } from "@/config/clientUtils"
import { routeStyle, cartName } from '@/config/utils'
import { usePathname, useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import Loading from "../loadingCircle/Circle";
import { useModalBackgroundStore, useContactModalStore } from "@/config/store";

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
  const cart__ = getItem(cartName) 
  const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
  const setContactModal = useContactModalStore(state => state.setContactModal);
  const [cart, setCart] = useState<ICart | null>(cart__)
  //console.log("Cart New: ", cart)
  const routerPath = usePathname();
  const router = useRouter()
  const [scrollY, setScrollY] = useState<number>(window.scrollY);

  useEffect(() => {
    const interval = setInterval(() => {
        //Updating scroll position
        setScrollY(() => window.scrollY)

        //Updating cart info
        const cart__ = getItem(cartName)
        setCart(() => cart__)
      }, 100);
  
      return () => {
        clearInterval(interval);
      };
    
  }, [scrollY, cart]);

  ///This function is triggered when the user clicks on contact
  const openContactModal = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault()

    setContactModal(true)
    setModalBackground(true)
}

  //This handles the search
  const onSearch = async (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault()

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

  return (
    <>
      <header className={`${styles.header} ${scrollY >= 1 ? styles.scrolled : ""} ${routeStyle(routerPath, styles)}`}>
        <button className={styles.menu_button} onClick={() => setMenu(true)}>
          <MenuIcon className={styles.icon} />
        </button>
        <div className={styles.logo} onClick={() => router.push('/')}>
          <Image
            className={styles.img}
            src="https://drive.google.com/uc?export=download&id=1V-QyvBujfHsM0fIimUT3PL2DwjZCWJXG"
            alt=""
            width={2500}
            height={2500}
          />
        </div>
        <div className={`${styles.links}`}>
          <button onClick={() => {
            router.push('/about')
          }}><span>About Us</span></button>
          <button onClick={() => router.push('/#products')}><span>Products</span></button>
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
                    <SearchIcon />
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
                    <SearchIcon style={{ fontSize: "1.1rem" }} className={styles.icon} />
                  )}
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
              <Image
                className={styles.img}
                src="https://drive.google.com/uc?export=download&id=1V-QyvBujfHsM0fIimUT3PL2DwjZCWJXG"
                alt=""
                width={2500}
                height={2500}
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