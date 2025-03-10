"use client"
///Product Slide component

///Libraries -->
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, MouseEvent, useRef } from 'react';
import styles from "./categorySlide.module.scss"
import { IImage, ICart, ISlideTitle, IProductFilter } from '@/config/interfaces';
import { routeStyle, cartName, shuffleArray, categories, productFilterName } from '@/config/utils'
import { getItem, setItem } from '@/config/clientUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';
import { useModalBackgroundStore, useLoadingModalStore } from '@/config/store';
import { Swiper as SwiperCore } from 'swiper/types';
import { EffectCoverflow, Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

///Commencing the code 

/**
 * @title Product Slide Component
 * @returns The Product Slide component
 */
const CategorySlide = () => {
    const routerPath = usePathname();
    const router = useRouter();
    const [lastIndex, setLastIndex] = useState(6)
    const [title, setTitle] = useState<string>()
    const [barTitle, setBarTitle] = useState<string>()
    const swiperRef = useRef<SwiperCore>();
    const [miniCategories, setMiniCategories] = useState(shuffleArray(categories.flatMap(category => category.minis)))
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground)
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal)

    //console.log("Path: ", routerPath)

    useEffect(() => {
      const intervalId = setInterval(() => {
        if (screen.width < 600) {
          setLastIndex(3)
        } else if (600 < screen.width && screen.width < 1000) {
          setLastIndex(5)
        } else {
          setLastIndex(6)
        }
      }, 1000);
  
      return () => clearInterval(intervalId);
    }, [lastIndex, title]);

    //This gets the class name based on the view
    const getViewClass = (view: string | undefined) => {
      switch (view) {
          case "homeSlide2":
            //setBarTitle("This months's")
            return styles.homeSlide2
          case "query":
              return styles.queryView
          default: 
              undefined
      }
  }

    useEffect(() => {
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

    }, [title])
    
    //This function is used for viewing a sub category
    const viewSubCategory = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>, miniCategory: string) => {
      e.preventDefault()

      //This sets the loading modal
      setModalBackground(true)
      setLoadingModal(true)

      //Stop the autoplay when Swiper is clicked
      if (swiperRef.current) {
        swiperRef.current.autoplay.stop();
      }

      const category_ = categories.find(category =>
        category.minis.some(miniItem => miniItem.mini === miniCategory)
      );
      const productFilter: IProductFilter = {
        filterId: 1,
        category: {
          macro: category_?.macro,
          mini: miniCategory
        }
      }
      setItem(productFilterName, productFilter)
      console.log("Filter: ", productFilter)
      router.push("/products")
    } 

    return (
      <main className={`${styles.main} ${routeStyle(routerPath, styles)}`}>
        <div className={styles.container}>
          <div className={styles.heading}>
          <div className={styles.upper}>
              <div className={styles.bar}></div>
              <span className={styles.barTitle}>Categories</span>
          </div>
          <div className={styles.lower}>
              <span className={styles.subheading}>Explore our Sub Categories</span>
              <div className={styles.controller}>
                  <button className={`arrow-left arrow ${styles.prev}`} onClick={() => swiperRef.current?.slidePrev()}>
                      <ArrowBack className={styles.icon} />
                  </button>
                  {/* <div className={`swiper-pagination ${styles.pagination}`}></div> */}
                  <button className={`arrow-right arrow ${styles.next}`} onClick={() => swiperRef.current?.slideNext()}>
                      <ArrowForward className={styles.icon} />
                  </button>
              </div>
          </div>
          </div>
          <br />
          <Swiper
              effect={'slide'}
              spaceBetween={10}
              grabCursor={true}
              centeredSlides={false}
              loop={true}
              autoplay={{ delay: 2000, disableOnInteraction: true, pauseOnMouseEnter: true }} //{{ delay: 7000, disableOnInteraction: false, pauseOnMouseEnter: true }}
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
              {miniCategories?.map((category, id) => (
                  <SwiperSlide className={styles.slider} key={id} onClick={(e) => viewSubCategory(e, category.mini)}>
                      <div className={styles.image}>
                        <Image
                            className={styles.img}
                            src={category.image?.src!}
                            alt=""
                            width={category.image?.width!}
                            height={category.image?.height!}
                        /> 
                      </div>
                      <span>{category.mini}</span>
                  </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </main>
    );
};
  
export default CategorySlide;