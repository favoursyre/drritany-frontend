"use client"
///Stat Card component

///Libraries -->
import styles from "./stat.module.scss"
import Image from "next/image";
import { IProduct, IClientInfo } from "@/config/interfaces";
import { useState, MouseEvent, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { slashedPrice, routeStyle } from "@/config/utils";
import { useClientInfoStore, useModalBackgroundStore, useLoadingModalStore } from "@/config/store";

///Commencing the code
/**
 * @title Stat Card Component
 * @returns The Stat Card component
 */
const StatCard = ({ product_, view }: { product_: IProduct, view: string | undefined }) => {
    const [product, setProduct] = useState<IProduct>({...product_})
    const clientInfo = useClientInfoStore(state => state.info)
    const router = useRouter()
    const routerPath = usePathname();
    // const setModalBackground = useModalBackgroundStore(state => state.setModalBackground)
    // const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal)

    useEffect(() => {
        //console.log("Loc: ", clientInfo)
        setProduct(() => product_)
    }, [clientInfo, product, product_]);

    ///This handles what happens when a product is clicked
    const viewCategory = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>, id: string) => {
        e.preventDefault()

        //This sets the loading modal
        // setModalBackground(true)
        // setLoadingModal(true)

        router.push(`/products/${id}`);
    }

    return (
        <main className={`${styles.main} ${view === "slide" ? styles.slideView : ""}`} onClick={(e) => viewCategory(e, product._id!)}>
            <div className={styles.discount}>
                <span>-{product.pricing?.discount}%</span>
            </div>
            <div className={styles.card_image}>
                <Image
                    className={styles.img}
                    src={product.images[0].src}
                    alt=""
                    width={product.images[0].width}
                    height={product.images[0].height}
                />
            </div>
            <div className={styles.card_name}>
                <span>{product.name}</span>
            </div>
            <div className={styles.card_price}>
                    <div className={styles.price_1}>
                        <strong>
                            {/* <span dangerouslySetInnerHTML={{ __html: decodedString(nairaSymbol) }} /> */}
                            {clientInfo ? <span>{clientInfo?.country?.currency?.symbol}</span> : <></>}
                            {clientInfo && clientInfo.country?.currency && clientInfo.country?.currency?.exchangeRate ? <span>{product.pricing?.basePrice ? (Math.round(product.pricing?.basePrice* clientInfo.country?.currency?.exchangeRate)).toLocaleString("en-US") : ""}</span> : <></>}
                        </strong>
                    </div>
                    <div className={styles.price_2}>
                        {/* {clientInfo ? (<span dangerouslySetInnerHTML={{ __html: decodedString(getCurrencySymbol(clientInfo)) }} />) : (<></>)} */}
                        {clientInfo ? <span>{clientInfo?.country?.currency?.symbol}</span> : <></>}
                        {clientInfo && clientInfo.country?.currency && clientInfo.country?.currency?.exchangeRate ? <span>{product.pricing?.basePrice ? (Math.round(slashedPrice(product.pricing?.basePrice * clientInfo.country?.currency?.exchangeRate, product.pricing?.discount!))).toLocaleString("en-US") : (<></>)}</span> : <></>}
                    </div>
                </div>
        </main>
    );
};

export default StatCard;