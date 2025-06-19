"use client"
///Product Slide component

///Libraries -->
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, MouseEvent, useRef } from 'react';
import styles from "./productSlide.module.scss"
import { IProduct, ICart, ISlideTitle, IButtonResearch, IClientInfo, IProductFilter } from '@/config/interfaces';
import { routeStyle, cartName, sortProductByActiveStatus, wishListName, shuffleArray, productFilterName, sortMongoQueryByTime, sortProductByOrder, sortProductByRating, getCurrentDate, getCurrentTime, extractBaseTitle, storeButtonInfo, userIdName, clientInfoName, productsName, sortProductsBySimilarity, removeProductFromArray, sleep, getProducts } from '@/config/utils'
import ProductCard from '@/components/cards/product/ProductCard';
import { getDevice, getItem, getOS, notify, setItem, Cache } from '@/config/clientUtils';
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
import Loading from '@/components/loadingCircle/Circle';

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
const ProductSlide = ({ _products, _product, title_, view_ }: { _products: Array<IProduct> | void, _product: IProduct | void , title_: ISlideTitle, view_: string | undefined }) => {
    const routerPath = usePathname();
    const router = useRouter();
    //const [similarProducts, setSimilarProducts] = useState(sortProductByActiveStatus(view_ === "wishSlide1" ? getItem(wishListName) : product_, "Active"))
    const [lastIndex, setLastIndex] = useState(6)
    const [title, setTitle] = useState<string>(slideTitles[title_.slideTitleId!])
    const [barTitle, setBarTitle] = useState<string>(barTitles[title_.barTitleId!])
    const swiperRef = useRef<SwiperCore>();
    const [view, setView] =  useState<string>(view_!)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground)
    //const clientInfo = useClientInfoStore(state => state.info)
    //const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>()
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal)
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo!)
    const __products = Cache(productsName).get()
    const [products, setProducts] = useState<Array<IProduct> | undefined>(__products ? __products : _products)
    const [viewProducts, setViewProducts] = useState<Array<IProduct> | undefined>()
    const [p_, setP_] = useState<boolean>(false)
    const limit = 10; // Define how many products per page (controls payload size per "load")
    const [currentBatch, setCurrentBatch] = useState<number>(1);
    const [currentIndex, setCurrentIndex] = useState<number>(swiperRef.current?.activeIndex!)
    const [totalBatch, setTotalBatch] = useState<number>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    //Updating client info
    useEffect(() => {
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
          setModalBackground(false)
          //console.log("setting off modal background 2")
            setLoadingModal(false)
            //console.log("Client info detected")
        }  

    }, [clientInfo])

    //Refreshing swiper variables
    useEffect(() => {
      //console.log("Swiper Index: ", swiperRef.current?.activeIndex)

      const interval = setInterval(() => {
        //_clientInfo_ = getItem(clientInfoName)
        //console.log("Delivery Info: ", _deliveryInfo)
        setCurrentIndex(swiperRef.current?.activeIndex!)
      }, 100);

      //console.log("Delivery Info: ", deliveryInfo)

      return () => {
          clearInterval(interval);
      };
    }, [currentIndex])

    //Updating the products
    useEffect(() => {
      const start = performance.now()
      //console.log("Products Cache: ", _products)
      if (!p_) {
        if (!products) {
          //notify("info", `no product found`)
          //console.log("Products not seen in slides")
          const interval = setInterval(() => {
              const _products_ = Cache(productsName).get()
              
              //Checking if cache exist
              if (_products_) {
                //notify("info", `product found in cache`)
                setProducts(() => _products_)
              } else {
                //notify("info", `product not found in cache`)
                const _getProducts = async () => {
                  const _p = await getProducts() as unknown as Array<IProduct>
                  //notify("info", `_P: ${_p ? true : false}`)
                  const products_ = sortProductByActiveStatus(_p, "Active") as unknown as Array<IProduct>
                  //notify("info", `P_: ${products_ ? true : false}`)
                  //console.log("Products: ", products_)
                  //setProducts(() => products_)
                  if (products_) {
                    const validPeriod = 3600 //1 hour
                    const _cache = Cache(productsName).set(products_, validPeriod)
                    setProducts(() => products_)
                    //notify("info", `cache: ${_cache}`)
                    //console.log("Product cached: ", _cache)
                  }
                
                }
                
                _getProducts()
              }
              //console.log("Delivery Info: ", _deliveryInfo)
              
          }, 500);
  
          //console.log("Delivery Info: ", deliveryInfo)
      
          return () => {
              clearInterval(interval);
          };
        } else {
          //console.log("Products seen in slides")
          if (!__products) {
            const validPeriod = 3600 //1 hour
            const _cache = Cache(productsName).set(products, validPeriod)
          }

          //let products_ = products //.slice(0, 10) //setProducts(paginateProducts(1))
          //console.log("Slice P: ", products_.length)
          let newProducts: Array<IProduct> = []

          if (view === "homeSlide1") {
            newProducts = sortMongoQueryByTime(products!, "latest")
            setProducts(() => newProducts)
          } else if (view === "homeSlide2") {
            newProducts = sortProductByOrder(shuffleArray(products!))
            setProducts(() => newProducts)
          } else if (view === "homeSlide3") {
            newProducts = shuffleArray(products!)
            setProducts(() => newProducts)
          } else if (view === "productSlide1") {
            newProducts = sortProductByOrder(shuffleArray(products))
            setProducts(() => newProducts)
          } else if (view === "productSlide2") {
            newProducts = shuffleArray(products!)
            setProducts(() => newProducts)
          } else if (view === "infoSlide1") {
            //console.log("Info slide 1: ", _product)
            if (_product) {
              const products_ = removeProductFromArray(_product, products)
              newProducts = sortProductsBySimilarity(products_, _product)
              setProducts(() => newProducts)
            }
          } else if (view === "infoSlide2") {
            if (_product) {
              const products_ = removeProductFromArray(_product, products)
              newProducts = shuffleArray(products_)
              setProducts(() => newProducts)
            }
          } else if (view === "wishSlide1") {
            newProducts = getItem(wishListName)
            setProducts(() => newProducts)
          } else if (view === "wishSlide2") {
            newProducts = shuffleArray(products)
            setProducts(() => newProducts)
          } else if (view === "cartSlide1") {
            newProducts = shuffleArray(products)
            setProducts(() => newProducts)
          }

          const _possibleBatches = Math.ceil(products.length / limit)
          //console.log("Total batch: ", _possibleBatches)
          setTotalBatch(() => _possibleBatches)
          
          //console.log("Products Len: ", products.length)
          const start = (currentBatch - 1) * limit
          const end = start + limit
          
          setViewProducts(() => newProducts.slice(start, end))
          //console.log("New P: ", newProducts, products)

          if (products) {
            setP_(true)
          } 
          
        }
     }
      
      const end = performance.now()
      //console.log(`useEffect 1 product slide took ${end - start}ms`)

    }, [products, view])

    //console.log("Path: ", routerPath)
    useEffect(() => {
      //console.log(`Product ${view_}: `, similarProducts, sortProductByLatest(similarProducts!))
      //const p1 = products![0]
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

    }, [title, router, routerPath, products, view_])

    useEffect(() => {
      const intervalId = setInterval(() => {
        if (screen.width < 600) {
          setLastIndex(3)
        } else if (600 < screen.width && screen.width < 1000) {
          setLastIndex(5)
        } else {
          setLastIndex(6)
        }

        // if (view === "wishSlide1") {
        //   const products_ = sortProductByActiveStatus(getItem(wishListName), "Active")
        //   setProducts(products_)
        // }
      }, 1000);
  
      return () => clearInterval(intervalId);
    }, [lastIndex, title]);

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

      // let productFilter
      // if (view === "homeSlide1") {
      //   productFilter = {
      //     filterId: 1,
      //     category: "All"
      //   }
      // } else if (view === "homeSlide2") {
      //   productFilter = {
      //     filterId: 0,
      //     category: "All"
      //   }
      // } else if (view === "homeSlide3") {
      //   productFilter = {
      //     filterId: 4,
      //     category: "All"
      //   }
      // } else if (view === "productSlide1") {
      //   productFilter = {
      //     filterId: 0,
      //     category: "All"
      //   }
      // } else if (view === "productSlide2") {
      //   productFilter = {
      //     filterId: 4,
      //     category: "All"
      //   }
      // } else if (view === "wishSlide2") {
      //   productFilter = {
      //     filterId: 4,
      //     category: "All"
      //   }
      // } else if (view === "infoSlide2") {
      //   productFilter = {
      //     filterId: 4,
      //     category: "All"
      //   }
      // }

      //Storing this info in button research
      const info: IButtonResearch = {
        ID: clientInfo?._id!,
        IP: clientInfo?.ipData?.ip!,
        City: clientInfo?.ipData?.city!,
        Region: clientInfo?.ipData?.region!,
        Country: clientInfo?.ipData?.country!,
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

      if (view === "productSlide2") {

        // setModalBackground(false)
        // setLoadingModal(false)

        window.scrollTo({
          top: 0, 
          behavior: 'smooth'
        })

        await sleep(1)

        window.location.reload()
        return
      }

      const filterSettings: IProductFilter = {
        filterId: 0,
        category: "All"
      }
      setItem(productFilterName, filterSettings)

      //setItem(productFilterName, productFilter)
      router.push('/products')
    }

    //This function is trigerred when a next/prev button is clicked
    const changeSlideByController = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, action: "prev" | "next") => {
      e.preventDefault()

      const _swiper = swiperRef.current
      //swiperRef.current.slideto

      //console.log(`clicked ${action}`)
      //console.log("Swiper: ", swiperRef)
      //console.log('Products L: ', viewProducts?.length)
      setCurrentIndex(() => swiperRef.current?.activeIndex!)

      if (action === "prev") {
        if (_swiper?.isBeginning) {
          //Starting loading
          setIsLoading(true)

          const newBatch = currentBatch - 1
          if (newBatch >= 1) { //Making sure the newBatch isn't below 1
            setCurrentBatch(() => newBatch)
            const start = (newBatch - 1) * limit;  // Calculate the start index for the previous batch (newBatch * limit)
            const end = start + limit;
            setViewProducts(() => products?.slice(start, end))
            //console.log('Slide len3: ', _swiper.slides.length)
            //_swiper.update();
            _swiper.slideTo(6)
          }

          //Ending loading
          await sleep(0.3)
          setIsLoading(false)
        } else {
          swiperRef.current?.slidePrev()
        }
        
        //handlePageChange(currentPage - 1)
      } else if (action === "next") {
        if (_swiper?.isEnd) {
          //Starting loading
          setIsLoading(true)

          //console.log('Batch has ended, refreshing batch')
          const newBatch = currentBatch + 1
          if (newBatch <= totalBatch!) { //Making sure the new batch is never above the total batch
            setCurrentBatch(() => newBatch)
            const start = (newBatch - 1) * limit
            const end = start + limit
            setViewProducts(() => products?.slice(start, end))
            _swiper.slideTo(0)
          }

          //Ending loading
          await sleep(0.3)
          setIsLoading(false)
        } else {
          swiperRef.current?.slideNext()
        }
        
        //handlePageChange(currentPage + 1)
      }
    }

    //This function is trigerred when a user swipes to the extreme left/right of the slide
    const changeSlideBySwipe = async (e: SwiperCore, action: "prev" | "next") => {

      const _swiper = swiperRef.current as unknown as SwiperCore
      
      if (action === "prev") {
        if (true) {
          //console.log("Slide has reached the beginning")

          //Starting loading
          setIsLoading(true)

          const newBatch = currentBatch - 1
          if (newBatch >= 1) { //Making sure the newBatch isn't below 1
            setCurrentBatch(() => newBatch)
            const start = (newBatch - 1) * limit;  // Calculate the start index for the previous batch (newBatch * limit)
            const end = start + limit;
            setViewProducts(() => products?.slice(start, end))
            //console.log('Slide len3: ', _swiper.slides.length)
            //_swiper.update();
            _swiper.slideTo(6)
          }

          //Ending loading
          await sleep(0.3)
          setIsLoading(false)
        }
        
      } else if (action === "next") {
        if (_swiper && _swiper.touches.diff < 0) {
          //console.log("Slide has reached the end")

          //Starting loading
          setIsLoading(true)

          //console.log('Batch has ended, refreshing batch')
          const newBatch = currentBatch + 1
          if (newBatch <= totalBatch!) { //Making sure the new batch is never above the total batch
            setCurrentBatch(() => newBatch)
            const start = (newBatch - 1) * limit
            const end = start + limit
            setViewProducts(() => products?.slice(start, end))
            _swiper.slideTo(0)
          }

          //Ending loading
          await sleep(0.3)
          setIsLoading(false)
        }
      }
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
              //onReachBeginning={(e) => changeSlideBySwipe(e, "prev")}
              //onReachEnd={(e) => changeSlideBySwipe(e, "next")}
              //onSlideChange={handleSlideChange}
              fadeEffect={{ crossFade: true }}
              pagination={{ el: '.swiper-pagination', clickable: true }}
              //navigation={{ nextEl: nextRef.current, prevEl: prevRef.current }}
              modules={[ EffectCoverflow, Pagination, Navigation, Autoplay, EffectFade ]}
              className={styles.swipeContainer}
          >
            {
              isLoading ? (
                <div className={styles.loading}>
                  <Loading width='20px' height='20px' />
                </div>
              ) : viewProducts ? (
                viewProducts.map((product, id) => (
                  <SwiperSlide className={styles.slider} key={id}>
                    <ProductCard 
                      product_={product} 
                      view_={view === "wishSlide1" ? "wishSlide1" : "slide"} 
                    />
                  </SwiperSlide>
                ))
              ) : (
                <div className={styles.loading}>
                  <Loading width='20px' height='20px' />
                </div>
              )
            }
            
          </Swiper>
        <div className={styles.controller}>
            <button 
              className={`arrow-left arrow ${styles.prev}`} 
              onClick={(e) => changeSlideByController(e, "prev")}
              disabled={currentBatch === 1 ? currentIndex === 0 : undefined} // Disable on first page
            >
                <KeyboardArrowLeftIcon className={styles.icon} />
            </button>
            {/* <div className={`swiper-pagination ${styles.pagination}`}></div> */}
            <button 
              className={`arrow-right arrow ${styles.next}`} 
              onClick={(e) => changeSlideByController(e, "next")}
              disabled={currentBatch === totalBatch ? swiperRef.current?.isEnd : undefined} // Disable on last page
            >
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