"use client"
///Layout component

///Libraries -->
import styles from "./layout.module.scss"
import { useEffect } from "react";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("@/components/header/Header"), { ssr: false })
import Footer from "@/components/footer/Footer";
import { ToastContainer } from 'react-toastify';
import Modal from "@/components/modals/modalBackground/Modal";
import 'react-toastify/dist/ReactToastify.css';
import { useClientInfoStore } from "@/config/store";
import { IClientInfo } from "@/config/interfaces";
import { countryList } from "@/config/database";

///Commencing the code 
///This function get client's info
async function getClientInfo(clientInfo: IClientInfo | undefined, setClientInfo: (info: IClientInfo) => void) {
    try {
        if (clientInfo === undefined) {
            const res = await fetch(`https://api.ipdata.co?api-key=0c7caa0f346c2f6850c0b2e749ff04b3829f4a7229c88389b3160641`, {
                method: "GET",
                cache: "no-store",
            })
        
            if (res.ok) {
                const info_ = await res.json()
                console.log('Info: ', info_)
                const country_ = countryList.find(country => country.name?.abbreviation === info_.country_code)
                const info : IClientInfo = {
                    country: country_ ? country_ : countryList.find(country => country.name?.abbreviation === "US")
                }
                setClientInfo(info)
            } else {
                getClientInfo(clientInfo, setClientInfo)
            }
        }
    } catch (error) {
      console.log(error);
    }
    
}

/**
 * @title Layout Component
 * @returns The Layout component
 */
const Layout = ({ children }: { children: React.ReactNode }) => {
    const setClientInfo = useClientInfoStore(state => state.setClientInfo);
    const clientInfo = useClientInfoStore(state => state.info)
    //const test = getItemByKey(countryList, "NGN", "currency", "abbreviation", undefined)

    useEffect(() => {
        getClientInfo(clientInfo, setClientInfo)
        //console.log("Test: ", test)
    });
    

  return (
    <html lang="en" className={styles.html}>
      <body suppressHydrationWarning={true} className={styles.body}>
        <ToastContainer autoClose={5000} limit={5} newestOnTop={true} />
        <Header />
        <Modal />
        <main className='container'>{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default Layout;