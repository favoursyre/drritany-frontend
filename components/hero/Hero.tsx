"use client"
///Hero component

///Libraries -->
import styles from "./hero.module.scss"
import Image from "next/image";
import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SearchIcon from '@mui/icons-material/Search';
import Loading from "../loadingCircle/Circle"
import { useLoadingModalStore, useModalBackgroundStore } from "@/config/store";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper as SwiperCore } from 'swiper/types';
import { EffectCoverflow, Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { IImage, IProductFilter, IClientInfo } from "@/config/interfaces";
import { productFilterName, clientInfoName } from "@/config/utils";
import { setItem, getItem } from "@/config/clientUtils";

///Commencing the code 
  
/**
 * @title Hero Component
 * @returns The Hero component
 */
const Hero = () => {
    const [query, setQuery] = useState<string>("")
    const router = useRouter()
    const [searchIsLoading, setSearchIsLoading] = useState<boolean>(false)
    //const clientInfo = useClientInfoStore(state => state.info)
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo ? _clientInfo : undefined)
    const swiperRef = useRef<SwiperCore>();
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground)
    const [slides, setSlides] = useState<Array<IImage>>([
        {
            src: "https://drive.google.com/uc?export=download&id=1uy_xi_k3Nq1FLkSGP1FF9zr3P6cPf7xu",
            alt: "hero1",
            width: 1224,
            height: 816
        },
        {
            src: "https://drive.google.com/uc?export=download&id=1Ddk50odvREoAgxQ4y8zj6iP5l5rgfyvT",
            alt: "hero2",
            width: 1224,
            height: 816
        },
        {
            src: "https://drive.google.com/uc?export=download&id=1xxuEOleWDLOg__PDf87BUF6E4T_t0xZp",
            alt: "hero3",
            width: 1224,
            height: 816
        },
        {
            src: "https://drive.google.com/uc?export=download&id=1rqF6H3fqDRxTXBBw5qfwFn5HS7AqOhLy",
            alt: "hero4",
            width: 1224,
            height: 804
        }
    ])
    const [mounted, setMounted] = useState(false);
        
    //For client rendering
    useEffect(() => {
        setMounted(true);
    }, []);

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
            setLoadingModal(false)
            //console.log("Client info detected")
        }  

    }, [clientInfo])

    //This function is trigered when the search button is required
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
        } 

    }
      
    return (
        <main className={styles.main}>
            <div className={styles.gradientOverlay}></div>

            
            <div className={styles.container}>
                <span className={styles.spans}>
                    <span className={styles.span1}>Your</span>
                    <span className={styles.span2}>Everyday</span>
                    <span className={styles.span3}>Marketplace</span>
                </span>
                <form className={`${styles.search_form}`} onSubmit={(e) => {
                    onSearch(e)
                    //window.location.reload()
                }}>
                    <input 
                        type="text" 
                        placeholder="What are you looking for?" 
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                    />
                    <button>
                        {searchIsLoading ? (
                            <Loading width="20px" height="20px" />
                        ) : (
                            <SearchIcon style={{ fontSize: "2rem" }} className={styles.icon} />
                        )}
                    </button>
                </form>
                {mounted && clientInfo ? (
                    <div className={styles.text}>
                        <span><em>We deliver anywhere in {clientInfo?.countryInfo?.name?.abbreviation === "US" ? "the" : ""} {clientInfo?.countryInfo?.name?.common}</em></span>
                        <Image 
                            className={styles.flag}
                            src={clientInfo?.countryInfo?.flag?.src as unknown as string}
                            alt=""
                            width={clientInfo?.countryInfo?.flag?.width}
                            height={clientInfo?.countryInfo?.flag?.height}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <Swiper
              effect={'slide'}
              spaceBetween={1}
              //grabCursor={true}
              centeredSlides={true}
              loop={true}
              autoplay={{ delay: 4000 }} //{{ delay: 7000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              slidesPerView={1}
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
              pagination={{ el: '.swiper-pagination', clickable: true, dynamicBullets: true, dynamicMainBullets: 4 }}
              //navigation={{ nextEl: nextRef.current, prevEl: prevRef.current }}
              modules={[ EffectCoverflow, Pagination, Navigation, Autoplay, EffectFade ]}
              className={styles.swipeContainer}
          >
            {slides.map((slide, id) => (
                <SwiperSlide className={styles.slider} key={id}>
                    <Image 
                        className={styles.background}
                        src={slide.src}
                        alt={slide.alt!}
                        width={slide.width!}
                        height={slide.height!}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
        <div className={`swiper-pagination ${styles.pagination}`}></div>   
        </main>
    );
};
  
export default Hero;