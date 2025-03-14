"use client"
///Layout component

///Libraries -->
import styles from "./layout.module.scss"
import { useEffect, Suspense, useState } from "react";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("@/components/header/Header"), { ssr: false })
//import Header from "@/components/header/Header"
import Footer from "@/components/footer/Footer";
import { ToastContainer } from 'react-toastify';
import Modal from "@/components/modals/modalBackground/Modal";
import 'react-toastify/dist/ReactToastify.css';
import { useClientInfoStore, useLoadingModalStore, useModalBackgroundStore } from "@/config/store";
import { IClientInfo, ITrafficResearch, ISheetInfo } from "@/config/interfaces";
import { countryList } from "@/config/database";
import GoogleTagManager from "@/config/GoogleTagManager";
import GoogleAnalytics from '@/config/GoogleAnalytics';
import { useRouter, usePathname } from "next/navigation";
import AdminSideBar from "@/components/admin/sidebar/SideBar"
import AdminHeader from "../admin/header/Header";
import bcrypt from "bcrypt"
import LoadingSkeleton from "@/app/loading_test";
import { InfoRounded } from "@mui/icons-material";
import styles_ from "@/styles/_base.module.scss"
import { getCurrentDate, getCurrentTime, backend, statSheetId, extractBaseTitle } from "@/config/utils";

///Commencing the code 
///This function get client's info
async function getClientInfo(clientInfo: IClientInfo | undefined, setClientInfo: (info: IClientInfo) => void) {
    try {
        if (clientInfo === undefined) {
            // ---> Uncomment this for general countries <---
            const res = await fetch(`https://api.ipdata.co?api-key=0c7caa0f346c2f6850c0b2e749ff04b3829f4a7229c88389b3160641`, {
                method: "GET",
                //cache: "default",
            })
            console.log("IP red: ", res)
        
            if (res.ok) {
                const info_ = await res.json()
                console.log('Info res: ', info_)
                const country_ = countryList.find(country => country.name?.abbreviation === info_.country_code)
                const info : IClientInfo = {
                  ip: info_.ip,
                  country: country_ ? country_ : countryList.find(country => country.name?.abbreviation === "US")
                }
                console.log("Client info: ", info)
                setClientInfo(info)
            } else {
                getClientInfo(clientInfo, setClientInfo)
            }
            // ---> Uncomment this for general countries <---

            // ---> For Nigeria only <---
            // const info : IClientInfo = {
            //   ip: "xxxxxx",
            //   country: countryList.find(country => country.name?.abbreviation === "NG")
            // }
            // //console.log("Client info: ", info)
            // setClientInfo(info)
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
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground)
    const routerPath = usePathname();

    // useEffect(() => {

      
      
    // }, []);

    useEffect(() => {
      // setModalBackground(true)
      // setLoadingModal(true)
        getClientInfo(clientInfo, setClientInfo)
        console.log('OS: ', styles_.successColor1)
        //console.log("Test: ", test)
    });
    
    //Keeping track of visitors
    useEffect(() => {
      console.log("Pathname: ", routerPath)
      // setModalBackground(false)
      // setLoadingModal(false)

      //Storing the keyword in an excel sheet for research purposes
      if (clientInfo) {
          const storeTraffic = async () => {
              try {
                  //Arranging the query research info
                  const trafficInfo: ITrafficResearch = {
                      IP: clientInfo?.ip!,
                      Country: clientInfo?.country?.name?.common!,
                      Page_Title: extractBaseTitle(document.title),
                      Page_URL: routerPath,
                      Date: getCurrentDate(),
                      Time: getCurrentTime()
                  }

                  const sheetInfo: ISheetInfo = {
                      sheetId: statSheetId,
                      sheetRange: "Traffic!A:F",
                      data: trafficInfo
                  }
          
                  const res = await fetch(`${backend}/sheet`, {
                      method: "POST",
                      body: JSON.stringify(sheetInfo),
                  });
                  console.log("Google Stream: ", res)
              } catch (error) {
                  console.log("Store Error: ", error)
              }
          }
          
          storeTraffic()

        setModalBackground(false)
        setLoadingModal(false)
      } else {
        setModalBackground(true)
        setLoadingModal(true)
      }
  }, [clientInfo, routerPath])

  return (
    <html lang="en" className={styles.html}>
      <head>
        <GoogleTagManager containerId='GTM-KHK4D485' />
        <GoogleAnalytics />
      </head>
      <body suppressHydrationWarning={true} className={styles.body}>
        <ToastContainer autoClose={8000} limit={5} newestOnTop={true} />
        <Header />
        {/* <AdminHeader />
        <AdminSideBar /> */}
        <Modal />
        {/* <Suspense fallback={ <LoadingSkeleton /> }> */}
          <main className='container'>{children}</main>
        {/* </Suspense> */}
        <Footer />
      </body>
    </html>
  );
};

export default Layout;