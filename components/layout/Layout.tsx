"use client"
///Layout component

///Libraries -->
import styles from "./layout.module.scss"
import { useEffect, Suspense, useState } from "react";
import dynamic from "next/dynamic";
//const Header = dynamic(() => import("@/components/header/Header"), { ssr: false })
import Header from "@/components/header/Header"
import Footer from "@/components/footer/Footer";
import { ToastContainer } from 'react-toastify';
import Modal from "@/components/modals/modalBackground/Modal";
import 'react-toastify/dist/ReactToastify.css';
import { useClientInfoStore, useLoadingModalStore, useModalBackgroundStore } from "@/config/store";
import { IClientInfo, ITrafficResearch, ISheetInfo, IProduct } from "@/config/interfaces";
import { countryList } from "@/config/database";
import GoogleTagManager from "@/config/GoogleTagManager";
import GoogleAnalytics from '@/config/GoogleAnalytics';
import { useRouter, usePathname } from "next/navigation";
import Head from "next/head";
import { v4 as uuid } from 'uuid';
import { getCurrentDate, getCurrentTime, backend, statSheetId, extractBaseTitle, userIdName, clientInfoName, productsName, getProducts, sortProductByActiveStatus } from "@/config/utils";
import { getDevice, getItem, getOS, setItem, Cache, notify } from "@/config/clientUtils";

///Commencing the code 
///This function get client's info
// async function getClientInfo(clientInfo: IClientInfo | undefined, setClientInfo: (info: IClientInfo) => void, _userId: string) {
//     try {
//         if (clientInfo === undefined) {
//             // ---> Uncomment this for general countries <---
//             // const res = await fetch(`https://api.ipdata.co?api-key=0c7caa0f346c2f6850c0b2e749ff04b3829f4a7229c88389b3160641`, {
//             //     method: "GET",
//             //     cache: "default",
//             // })
//             // console.log("IP red: ", res)
        
//             // if (res.ok) {
//             //     const info_ = await res.json()
//             //     console.log('Info res: ', info_)
//             //     const country_ = countryList.find(country => country.name?.abbreviation === info_.country_code)
//             //     const info : IClientInfo = {
//             //        _id: _userId,
//             //       ip: info_.ip,
//             //       country: country_ ? country_ : countryList.find(country => country.name?.abbreviation === "US")
//             //     }
//             //     console.log("Client info: ", info)
//             //     setClientInfo(info)
//             // } else {
//             //     getClientInfo(clientInfo, setClientInfo)
//             // }
//             // ---> Uncomment this for general countries <---

//             // ---> For USA only <---
//             const info : IClientInfo = {
//               _id: _userId,
//               ip: "xxxxxx",
//               country: countryList.find(country => country.name?.abbreviation === "US")
//             }
//             //setItem(userIdName, )
//             //console.log("Client info: ", info)
//             setClientInfo(info)
//             setItem(clientInfoName, info)
//             //setCacheItem(clientInfoName, info)
//         }
//     } catch (error) {
//       //console.log(error);
//     } 
// }

/**
 * @title Layout Component
 * @returns The Layout component
 */
const Layout = ({ children }: { children: React.ReactNode }) => {
    //const setClientInfo = useClientInfoStore(state => state.setClientInfo);
    //const clientInfo = useClientInfoStore(state => state.info)
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground)
    const routerPath = usePathname();
    const _userId = getItem(userIdName)
    const [userId, setUserId] = useState<string>(_userId ? _userId : uuid())
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo!)
    const [trafficStore, setTrafficStore] = useState<boolean>(false)
    const _products = Cache(productsName).get()
    //const [products, setProducts] = useState<Array<IProduct> | undefined>(_products?.value!)

    //Fetching client info
    // useEffect(() => {
      

    //   //I want to fetch the products and set them in cache ------------------------->
    //   const _getProducts = async () => {
    //     const _products = Cache(productsName).get()
    //     console.log('Cache products: ', Cache(productsName).get())
    //     if (_products && Object.keys(_products.value).length !== 0) {

    //     } else {
    //       const products = sortProductByActiveStatus(await getProducts(), "Active") as unknown as Array<IProduct>
    //       console.log("Called: ", products)
    //       if (products) {
    //         console.log("setting...")
    //         Cache(productsName).set(products, 300)
    //       }
          
    //     }

    //     console.log('Cache products2: ', Cache(productsName).get())
    //   }
      
    //   _getProducts()
    //   //Decided to test something here ------------------------->

    //   //Setting the client info 
    //   // if (!getItem(clientInfoName)) {
    //   //   //Setting the client info
    //   //   const info : IClientInfo = {
    //   //     _id: userId,
    //   //     ip: "xxxxxx",
    //   //     country: countryList.find(country => country.name?.abbreviation === "US")
    //   //   }
    //   //   setItem(clientInfoName, info)
    //   //   setClientInfo(info)
    //   // }
    // }, []);

    //Updating client info
    useEffect(() => {
        //console.log("Hero: ", _clientInfo, clientInfo)
        //console.log("testing")

        let _clientInfo_
        
        if (!clientInfo) {
            //console.log("Client info not detected")
            const interval = setInterval(() => {
                _clientInfo_ = getItem(clientInfoName)
                //console.log("Delivery Info: ", _deliveryInfo)
                setClientInfo(_clientInfo_)
            }, 1000);
    
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

    //Setting the client user details
    useEffect(() => {
      const start = performance.now()
      //Setting the clientInfo
      if (!_clientInfo) {
        //console.log('Client is not active')

        //Setting the user id
        if (!_userId) {
          setItem(userIdName, userId)
        } else {
          //console.log("User id is active")
        }
  
        // ---> For USA only <---
        const info : IClientInfo = {
          _id: userId,
          ip: "xxxxxx",
          country: countryList.find(country => country.name?.abbreviation === "US")
        }
        //console.log("setting")
        //setClientInfo(info)
        setItem(clientInfoName, info)
        setClientInfo(() => info)
      } else {
        //console.log('Client is active')
      }

      //console.log("client info store: ", clientInfo)
      const end = performance.now()
      //console.log(`useEffect 1 took ${end - start}ms`)
      //getClientInfo(clientInfo, setClientInfo, userId)
    }, [userId])
    
    //Keeping track of visitors
    useEffect(() => {
      const start = performance.now()

      //getClientInfo(clientInfo, setClientInfo, userId)

      //console.log("Client Info Layout: ", clientInfo)
      //Storing the keyword in an excel sheet for research purposes
      if (clientInfo) {

          //Checking if the traffic has been stored
          if (!trafficStore) {
            //console.log("Sending traffic")
            const storeTraffic = async () => {
                try {
                    
                    //Arranging the query research info
                    const trafficInfo: ITrafficResearch = {
                        ID: userId,
                        IP: clientInfo?.ip!,
                        Country: clientInfo?.country?.name?.common!,
                        Page_Title: extractBaseTitle(document.title),
                        Page_URL: routerPath,
                        Date: getCurrentDate(),
                        Time: getCurrentTime(),
                        OS: getOS(),
                        Device: getDevice()
                    }

                    const sheetInfo: ISheetInfo = {
                        sheetId: statSheetId,
                        sheetRange: "Traffic!A:I",
                        data: trafficInfo
                    }
            
                    const res = await fetch(`${backend}/sheet`, {
                        method: "POST",
                        body: JSON.stringify(sheetInfo),
                    });

                    if (res.ok) {
                      setTrafficStore(true)
                    } else {
                      storeTraffic()
                    }
                    //console.log("Google Stream: ", res)
                } catch (error) {
                    //console.log("Store Error: ", error)
                }
            }
            
            storeTraffic()
            
          } else {
            //console.log("Traffic has been sent already")
          }
          

        setModalBackground(false)
        setLoadingModal(false)
      } else {
        setModalBackground(true)
        setLoadingModal(true)
      }

      const end = performance.now()
      //console.log(`useEffect 2 took ${end - start}ms`)
    }, [clientInfo, trafficStore, setModalBackground, setLoadingModal, userId])

    // useEffect(() => {
    //         //console.log("Hero: ", _clientInfo, clientInfo)
    
    //         let _clientInfo_
            
    //         if (!clientInfo) {
    //             //console.log("Client info not detected")
    //             const interval = setInterval(() => {
    //                 _clientInfo_ = getItem(clientInfoName)
    //                 //console.log("Delivery Info: ", _deliveryInfo)
    //                 setClientInfo(_clientInfo_)
    //             }, 100);
        
    //             //console.log("Delivery Info: ", deliveryInfo)
            
    //             return () => {
    //                 clearInterval(interval);
    //             };
    //         } else {
    //             setModalBackground(false)
    //             setLoadingModal(false)
    //             //console.log("Client info detected")
    //         }  
    
    //     }, [clientInfo])

  return (
    <html lang="en" className={styles.html}>
       <Head>
        <GoogleTagManager />
        <GoogleAnalytics />
      </Head>
      <body suppressHydrationWarning={true} className={styles.body}>
       <ToastContainer autoClose={8000} limit={5} newestOnTop={true} />
        <Header />
        <Modal />
          <main className='container'>{children}</main>
        <Footer />
      </body> 
    </html>
  );
};

export default Layout;