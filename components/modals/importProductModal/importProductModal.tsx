"use client"
///Import Product Modal component

///Libraries -->
import styles from "./importProductModal.module.scss"
import { useModalBackgroundStore, useImportProductModalStore, useClientInfoStore } from "@/config/store";
import { MouseEvent, useState, FormEvent, useEffect, ChangeEvent } from "react";
import Loading from "@/components/loadingCircle/Circle";
import { Download, Close } from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { adminName, extraDeliveryFeeName, cartName, deliveryName, backend, platformList } from "@/config/utils";
import { IAdmin, ICart, ICustomerSpec, IClientInfo, IOrder, IDelivery, DeliveryStatus, IPayment, PaymentStatus, MarketPlatforms, IMarketPlatform, IProduct } from "@/config/interfaces";
import { getItem, notify, removeItem, setItem } from "@/config/clientUtils";

///Commencing the code 

/**
 * @title Import Product Modal Component
 * @returns The Import Product Modal component
 */
const ImportProductModal = () => {
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const importProductModal = useImportProductModalStore(state => state.modal);
    const setImportProductModal = useImportProductModalStore(state => state.setImportProductModal);
    const [platformLink, setPlatformLink] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [adminUser, setAdminUser] = useState<IAdmin | undefined>(getItem(adminName))
    const router = useRouter()
    const [platforms, setPlatforms] = useState<Array<string>>(platformList.map(platform => platform.name))
    const [selectedPlatform, setSelectedPlatform] = useState<string>(platforms[0])
    const [htmlContent, setHtmlContent] = useState<string>("")

    useEffect(() => {
        //console.log("Client: ", clientInfo)
        // const interval = setInterval(() => {
        //     setCart(() => getItem(cartName))
        // }, 100);
    
        // return () => {
        //     clearInterval(interval);
        // };
        
    }, []);

    //This function is used to import product
    const importProduct = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        //Validating args
        if (!selectedPlatform) {
            notify("error", "Select a platform")
            return
        } else if (!platformLink) {
            notify("error", "Link is required")
            return
        } else if (!htmlContent) {
            notify("error", "Content is required")
            return
        }


        console.log("test")
        console.log("Check: ", selectedPlatform, platformLink)

        //Validating Platform and link
        const _platform = platformList.find((platform) => selectedPlatform === platform.name)!
        const validLink = platformLink.includes(_platform?.url)
        console.log("Check 2: ", _platform, validLink)

        if (validLink) {
            //Send the details to backend
            setIsLoading(() => true)
            try {
                const platformData: IMarketPlatform = { name: selectedPlatform, url: platformLink, content: htmlContent}
                console.log("Platform Data_: ", platformData)
                const adminId = adminUser?._id
                const res = await fetch(`${backend}/scraper`, {
                    method: 'POST',
                    body: JSON.stringify({adminId, platformData}),
                    headers: {
                    'Content-Type': 'application/json',
                    },
                });
                    
                const data = await res.json();

                if(!res.ok) {
                    throw Error(`${data.message}`)
                }
            
                console.log("Data Res: ", data);
                const _data = data.message as unknown as IProduct

                notify("success", `Your products was imported successfully`)
                router.push(`/admin/${adminUser?._id}/products/${_data._id}`)
            } catch (error) {
                console.log("error: ", error)
                notify("error", `${error}`)
            }

            setIsLoading(() => false)
        } else {
            notify("error", "Invalid Link")
        }
    }

    ///This function is triggered when the background of the modal is clicked
    const closeModal = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()
        
        setModalBackground(false)
        setImportProductModal(false)
        //console.log("modal closed")
    }

  return (
    <div className={styles.main} style={{ display: importProductModal ? "flex" : "none"}}>
        <div className={styles.modal_head}>
            <div className={styles.title}>
                <span>Import Product</span>
            </div>
            <button onClick={(e) => closeModal(e)} >
                <Close className={styles.icon} />
            </button>
        </div>
        <form className={styles.form}>
            <label>
                Platform
                <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
                    {platforms.map((platform, _id) => (
                        <option value={platform} key={_id}>{platform}</option>
                    ))}
                </select>
            </label>
            <label >
                Link
                <input 
                    placeholder="url" 
                    type="text" 
                    onChange={(e) => setPlatformLink(e.target.value)}
                    value={platformLink}
                />
            </label>
            <label>
                HTML
                <input
                    placeholder="html content"
                    type="textarea"
                    onChange={(e) => setHtmlContent(e.target.value)}
                    value={htmlContent}
                />
            </label>
            <br />
            <button onClick={(e) => importProduct(e)}>
                {isLoading ? (
                    <Loading width="20px" height="20px" />
                ) : (
                    <>
                        <Download className={styles.icon} width="20px" height="20px" />
                        <span>Import</span>
                    </>
                )}
            </button>     
        </form> 
    </div>
  );
};

export default ImportProductModal;