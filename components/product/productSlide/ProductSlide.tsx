"use client"
///Product Slide component

///Libraries -->
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, MouseEvent, useRef } from 'react';
import styles from "./productSlide.module.scss"
import { IProduct, ICart, ISlideTitle, IProductFilter, IButtonResearch } from '@/config/interfaces';
import { routeStyle, cartName, sortProductByActiveStatus, wishListName, shuffleArray, productFilterName, sortMongoQueryByTime, sortProductByOrder, sortProductByRating, getCurrentDate, getCurrentTime, extractBaseTitle, storeButtonInfo, userIdName } from '@/config/utils'
import ProductCard from '@/components/cards/product/ProductCard';
import { getDevice, getItem, getOS, notify, setItem } from '@/config/clientUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useModalBackgroundStore, useLoadingModalStore, useClientInfoStore } from '@/config/store';
import { Swiper as SwiperCore } from 'swiper/types';
import { EffectCoverflow, Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { ArrowRightAlt } from '@mui/icons-material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

///Commencing the code 
//These are the various titles for product slide
const slideTitles: Array<string> = [
  "Customers also viewed",
  "Customers also bought",
  "Recommended for you",
  "Newest Arrivals",
  "Best Selling",
  "Explore our products",
  "Fulfill your Wishlist"
]

const barTitles: Array<string> = [
  "This month's",
  "Free delivery",
  "Highlights",
  "Wishes do come true"
]

/**
 * @title Product Slide Component
 * @returns The Product Slide component
 */
const ProductSlide = ({ product_, title_, view_ }: { product_: Array<IProduct>, title_: ISlideTitle, view_: string | undefined }) => {
    const routerPath = usePathname();
    const router = useRouter();
    const [similarProducts, setSimilarProducts] = useState(sortProductByActiveStatus(view_ === "wishSlide1" ? getItem(wishListName) : product_, "Active"))
    const [lastIndex, setLastIndex] = useState(6)
    const [title, setTitle] = useState<string>(slideTitles[title_.slideTitleId!])
    const [barTitle, setBarTitle] = useState<string>(barTitles[title_.barTitleId!])
    const swiperRef = useRef<SwiperCore>();
    const [view, setView] =  useState<string>(view_!)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground)
    const clientInfo = useClientInfoStore(state => state.info)
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal)

    useEffect(() => {
      if (view === "homeSlide1") {
        const newProducts = sortMongoQueryByTime(similarProducts!, "latest")
        setSimilarProducts(() => newProducts)
      } else if (view === "homeSlide2") {
        const newProducts = sortProductByOrder(shuffleArray(similarProducts!))
        setSimilarProducts(() => newProducts)
      } else if (view === "homeSlide3") {
        const newProducts = shuffleArray(similarProducts!)
        setSimilarProducts(() => newProducts)
      } else if (view === "productSlide1") {
        const newProducts = sortProductByOrder(shuffleArray(similarProducts!))
        setSimilarProducts(() => newProducts)
      } else if (view === "productSlide2") {
        const newProducts = shuffleArray(similarProducts!)
        setSimilarProducts(() => newProducts)
      } else if (view === "infoSlide2") {
        const newProducts = shuffleArray(similarProducts!)
        setSimilarProducts(() => newProducts)
      }
    }, [similarProducts, view])

    //console.log("Path: ", routerPath)
    useEffect(() => {
      //console.log(`Product ${view_}: `, similarProducts, sortProductByLatest(similarProducts!))
      const p1 = similarProducts![0]
      //console.log("Time: ", new Date(p1.createdAt!).getTime())
      //Loading the product if its a wish list
      const wishList = getItem(wishListName)
      if (view_ === "wishSlide1" && (!wishList || wishList.length === 0)) {
        router.push("/products")
        notify("info", "Your wish list is empty, redirecting you to products")
      }

      //console.log("Router Path: ", routerPath)
      switch(routerPath) {
        case "/cart":
          const cart: ICart | null = getItem(cartName)
          //console.log("Cart Info: ", cart)
          if (!cart || cart.cart.length === 0) {
            //console.log("here now")
            setTitle(() => "Recommended for you")
          }
          break
        default:
          break
      }

      //getViewClass(view)

    }, [title, router, routerPath, similarProducts, view_])

    useEffect(() => {
      const intervalId = setInterval(() => {
        if (screen.width < 600) {
          setLastIndex(3)
        } else if (600 < screen.width && screen.width < 1000) {
          setLastIndex(5)
        } else {
          setLastIndex(6)
        }

        if (view === "wishSlide1") {
          const products_ = sortProductByActiveStatus(getItem(wishListName), "Active")
          setSimilarProducts(products_)
        }
      }, 1000);
  
      return () => clearInterval(intervalId);
    }, [lastIndex, title, similarProducts, view]);

    //This gets the class name based on the view
    const getViewClass = (view: string | undefined) => {
      switch (view) {
          case "homeSlide2":
            return styles.homeSlide2
          case "homeSlide3":
            return styles.homeSlide3
          case "homeSlide4":
            return styles.homeSlide4
          case "productSlide1":
            return styles.productSlide1
          case "wishSlide1":
            return styles.wishSlide1
          case "wishSlide2":
            return styles.wishSlide2
          case "infoSlide2":
            return styles.infoSlide2
          case "query":
              return styles.queryView
          default: 
              undefined
      }
  }

  //This function is triggered when the user clicks on see more
  const seeMore = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): Promise<void> => {
    e.preventDefault()

    //Setting the loading screen
    setModalBackground(true)
    setLoadingModal(true)

    let productFilter
    if (view === "homeSlide1") {
      productFilter = {
        filterId: 1,
        category: "All"
      }
    } else if (view === "homeSlide2") {
      productFilter = {
        filterId: 0,
        category: "All"
      }
    } else if (view === "homeSlide3") {
      productFilter = {
        filterId: 4,
        category: "All"
      }
    } else if (view === "productSlide1") {
      productFilter = {
        filterId: 0,
        category: "All"
      }
    } else if (view === "productSlide2") {
      productFilter = {
        filterId: 4,
        category: "All"
      }
    } else if (view === "wishSlide2") {
      productFilter = {
        filterId: 4,
        category: "All"
      }
    } else if (view === "infoSlide2") {
      productFilter = {
        filterId: 4,
        category: "All"
      }
    }

    //Storing this info in button research
    const info: IButtonResearch = {
      ID: getItem(userIdName),
      IP: clientInfo?.ip!,
      Country: clientInfo?.country?.name?.common!,
      Button_Name: "seeMoreProduct()",
      Button_Info: `Clicked ${title} product slide`,
      Page_Title: extractBaseTitle(document.title),
      Page_URL: routerPath,
      Date: getCurrentDate(),
      Time: getCurrentTime(),
      OS: getOS(),
      Device: getDevice()
    }
    storeButtonInfo(info)

    setItem(productFilterName, productFilter)
    router.push('/products')
  }

    return (
        <main className={`${styles.main} ${getViewClass(view)} ${routeStyle(routerPath, styles)}`}>
            <div className={styles.heading}>
              <div className={styles.upper}>
                <div className={styles.bar}></div>
                <span className={styles.barTitle}>{barTitle}</span>
              </div>
              <div className={styles.lower}>
                <span className={styles.subheading}>{title}</span>
                <button onClick={(e) => seeMore(e)}>
                  <span>See more</span>
                  <ArrowRightAlt className={styles.icon} />
                </button>
              </div>
            </div>
            <br />
            <Swiper
              effect={'slide'}
              spaceBetween={10}
              grabCursor={true}
              centeredSlides={false}
              loop={false}
              autoplay={false} //{{ delay: 7000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              slidesPerView={'auto'}
              onBeforeInit={(swiper) => {
                  swiperRef.current = swiper;
                }}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
              }}
              fadeEffect={{ crossFade: true }}
              pagination={{ el: '.swiper-pagination', clickable: true }}
              //navigation={{ nextEl: nextRef.current, prevEl: prevRef.current }}
              modules={[ EffectCoverflow, Pagination, Navigation, Autoplay, EffectFade ]}
              className={styles.swipeContainer}
          >
            {similarProducts?.map((product, id) => (
                <SwiperSlide className={styles.slider} key={id}>
                    <ProductCard product_={product} view_={view === "wishSlide1" ? "wishSlide1" : "slide"} />
                </SwiperSlide>
            ))}
          </Swiper>
        <div className={styles.controller}>
            <button className={`arrow-left arrow ${styles.prev}`} onClick={() => swiperRef.current?.slidePrev()}>
                <KeyboardArrowLeftIcon className={styles.icon} />
            </button>
            {/* <div className={`swiper-pagination ${styles.pagination}`}></div> */}
            <button className={`arrow-right arrow ${styles.next}`} onClick={() => swiperRef.current?.slideNext()}>
                <KeyboardArrowRightIcon className={styles.icon} />
            </button>
            
        </div>
            {/* <div className={styles.product_slide}>
                {similarProducts?.slice(0, lastIndex).map((product, _id) => (
                    <ProductCard product_={product} key={_id} view={"slide"} />
                ))}
            </div> */}
        </main>
    );
};
  
export default ProductSlide;