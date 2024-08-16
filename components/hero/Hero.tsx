"use client"
///Hero component

///Libraries -->
import styles from "./hero.module.scss"
import Image from "next/image";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchIcon from '@mui/icons-material/Search';
import Loading from "../loadingCircle/Circle"
import { useClientInfoStore } from "@/config/store";
import Typewriter from 'typewriter-effect';

///Commencing the code 
  
/**
 * @title Hero Component
 * @returns The Hero component
 */
const Hero = () => {
    const [query, setQuery] = useState<string>("")
    const router = useRouter()
    const [searchIsLoading, setSearchIsLoading] = useState<boolean>(false)
    const clientInfo = useClientInfoStore(state => state.info)
    //const []

    useEffect(() => {
    }, [clientInfo])

    const onSearch = async (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
        e.preventDefault()

        if (query) {
          setSearchIsLoading(() => true)
          console.log("searching: ", query)
          router.push(`/products?query=${query}`)
        } 

    }
      
    return (
        <main className={styles.main}>
            <div className={styles.gradientOverlay}></div>
            <Image 
                className={styles.background}
                src={"https://drive.google.com/uc?export=download&id=1uy_xi_k3Nq1FLkSGP1FF9zr3P6cPf7xu"}
                alt=""
                width={1224}
                height={816}
            />
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
                {clientInfo ? (
                    <div className={styles.text}>
                        <span><em>We deliver anywhere in {clientInfo?.country?.name?.common}</em></span>
                        <Image 
                            className={styles.flag}
                            src={clientInfo?.country?.flag?.src as unknown as string}
                            alt=""
                            width={clientInfo?.country?.flag?.width}
                            height={clientInfo?.country?.flag?.height}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </main>
    );
};
  
export default Hero;