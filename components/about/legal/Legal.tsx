"use client"
///Legal component

///Libraries -->
import styles from "./legal.module.scss"
import Image from "next/image";
import { useClientInfoStore, useModalBackgroundStore, useLoadingModalStore } from "@/config/store";
import { MouseEvent, useState, useEffect } from "react";
import { IButtonResearch, IClientInfo } from "@/config/interfaces";
import { extractBaseTitle, getCurrentDate, getCurrentTime, storeButtonInfo, userIdName, clientInfoName } from "@/config/utils";
import { usePathname } from 'next/navigation';
import { DownloadOutlined } from "@mui/icons-material";
import { getItem, getOS, getDevice } from "@/config/clientUtils";

///Commencing the code 
  
/**
 * @title Legal Component
 * @returns The Legal component
 */
const Legal = () => {
    //const clientInfo = useClientInfoStore(state => state.info)
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo!)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal)
    const routerPath = usePathname();

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

    //This function is trigerred when verify cert is clicked
    const verifyCert = async (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        //Setting the loading
        setModalBackground(true)
        setLoadingModal(true)

        //Storing this info in button research
        const info: IButtonResearch = {
            ID: getItem(userIdName),
            IP: clientInfo?.ip!,
            Country: clientInfo?.country?.name?.common!,
            Button_Name: "verifyCert()",
            Button_Info: `Clicked verify cert`,
            Page_Title: extractBaseTitle(document.title),
            Page_URL: routerPath,
            Date: getCurrentDate(),
            Time: getCurrentTime(),
            OS: getOS(),
            Device: getDevice()
        }
        storeButtonInfo(info)

        //Visiting the verification
        if (typeof window !== undefined) {
            window.open("https://icis.corp.delaware.gov/ecorp2/services/validate", "_blank")
        }

        setModalBackground(false)
        setLoadingModal(false)
    }

    //This function downloads cert
    const downloadCert = async (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        if (typeof window !== undefined) {
            window.open("https://drive.google.com/uc?export=download&id=1t8YZ9j5vRwn_lb-G_z8rGLiHlceSgqZx", "_blank")
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.image}>
                <Image
                    className={styles.background} 
                    src={"https://drive.google.com/uc?export=download&id=1t8YZ9j5vRwn_lb-G_z8rGLiHlceSgqZx"}
                    alt=""
                    width={535}
                    height={753}
                />
                <DownloadOutlined className={styles.icon} onClick={(e) => downloadCert(e)}/>
            </div>
            <div className={styles.brief}>
                <h2><strong>Our Legal Foundation</strong></h2>
                <span>
                    As a US Corporation, we&apos;re built on a solid foundation of transparency and integrity.  Our Certificate of Incorporation, filed with the State of Delaware, reflects our commitment to trust and sustainable growth—<span className={styles.verify} onClick={(e) => verifyCert(e)}>verify here</span>
                </span>
            </div>
        </main>
    );
};
  
export default Legal;