"use client"
///Product Slide component

///Libraries -->
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, MouseEvent, useRef } from 'react';
import styles from "./productSlide.module.scss"
import { IProduct, ICart } from '@/config/interfaces';
import { routeStyle, cartName } from '@/config/utils'
import ProductCard from '@/components/cards/product/ProductCard';
import { getItem } from '@/config/clientUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper as SwiperCore } from 'swiper/types';
import { EffectCoverflow, Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

///Commencing the code 
//These are the various titles for product slide
const slideTitles: Array<string> = [
  "Customers also viewed",
  "Customers also ordered",
  "Recommended for you"
]

/**
 * @title Product Slide Component
 * @returns The Product Slide component
 */
const ProductSlide = ({ product_, titleId_ }: { product_: Array<IProduct>, titleId_: number }) => {
    const routerPath = usePathname();
    const router = useRouter();
    const [similarProducts, setSimilarProducts] = useState(product_)
    const [lastIndex, setLastIndex] = useState(6)
    const [title, setTitle] = useState<string>(slideTitles[titleId_])
    const swiperRef = useRef<SwiperCore>();

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

    }, [title])
    ///This function 

    return (
        <main className={`${styles.main} ${routeStyle(routerPath, styles)}`}>
            <div className={styles.heading}>
                <span className={styles.subheading}>{title}</span>
                <button onClick={() => router.push('/#products')}><span>See more {'>'}</span></button>
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
            {similarProducts.map((product, id) => (
                <SwiperSlide className={styles.slider} key={id}>
                    <ProductCard product_={product} view={"slide"} />
                </SwiperSlide>
            ))}
            
           
        </Swiper>
        <div className={styles.controller}>
            <button className={`arrow-left arrow ${styles.prev}`} onClick={() => swiperRef.current?.slidePrev()}>
                <KeyboardArrowLeftIcon />
            </button>
            {/* <div className={`swiper-pagination ${styles.pagination}`}></div> */}
            <button className={`arrow-right arrow ${styles.next}`} onClick={() => swiperRef.current?.slideNext()}>
                <KeyboardArrowRightIcon />
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