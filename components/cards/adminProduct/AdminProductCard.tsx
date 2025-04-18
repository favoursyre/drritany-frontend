"use client"
///Admin Product Card component

///Libraries -->
import styles from "./adminProductCard.module.scss"
import Image from "next/image";
import { IProduct, IClientInfo, IAdmin } from "@/config/interfaces";
import { useState, MouseEvent, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { backend, routeStyle, round, adminName, domainName, clientInfoName } from "@/config/utils";
import { useClientInfoStore, useModalBackgroundStore, useConfirmationModalStore, useLoadingModalStore } from "@/config/store";
import { MoreVert, DeleteOutlined, Edit, ThumbUpOffAlt } from '@mui/icons-material';
import { getItem, notify } from "@/config/clientUtils";
import Loading from "@/components/loadingCircle/Circle";

///Commencing the code 
/**
 * @title Admin Product Card Component
 * @returns The Admin Product Card component
 */
const AdminProductCard = ({ products_, view }: { products_: IProduct, view: string | undefined }) => {
    //console.log("Product 3: ", products_)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [product, setProduct] = useState<IProduct>(products_)
    //console.log("Product 4: ", product)
    //const clientInfo = useClientInfoStore(state => state.info)
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo!)
    const router = useRouter()
    const routerPath = usePathname();
    const [adminUser, setAdminUser] = useState<IAdmin | null>(getItem(adminName))
    const setConfirmationModal = useConfirmationModalStore(state => state.setConfirmationModal);
    const confirmationModal = useConfirmationModalStore(state => state.modal);
    const confirmationChoice = useConfirmationModalStore(state => state.choice);
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground)
    const [admin, setAdmin] = useState<IAdmin>(getItem(adminName))

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

    useEffect(() => {
        //console.log("Loc: ", clientInfo)
        console.log("Choice: ", confirmationChoice)
        setProduct(() => products_)
    }, [clientInfo, product, products_, confirmationModal, confirmationChoice]);

    ///This handles what happens when a product is clicked
    const viewProduct = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>, p_id: string) => {
        e.preventDefault()

        //Setting the loading modal on
        setModalBackground(true)
        setLoadingModal(true)
        
        window.open(`${domainName}/admin/${admin._id}/products/${p_id}`, "_blank");

        //Setting the loading modal off
        setModalBackground(false)
        setLoadingModal(false)
    }

    ///This handles what happens when delete product is clicked
    const deleteProduct = async (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent> | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()
        console.log('Here')

        //Checking user priviledge
        if (adminUser && adminUser.superUser) {
            undefined
        } else {
            notify("error", "Permission Denied!")
            return
        }

        setIsLoading(true)
        const choice = confirm("Are you sure you want to delete this product?");
        console.log("Choice: ", choice)
        //setModalBackground(true)
        //setConfirmationModal(true)
        //console.log('Modal: ', confirmationModal)

        if(choice) {
            console.log("yes delete")
            ///Sending a delete request
            try {
                const res = await fetch(`${backend}/product/${product._id}`, {
                  method: "DELETE",
                  cache: "no-store",
                })
            
                if (res.ok) {
                    console.log("Res: ", res.json())
                    notify("success", "Product Deleted Successfully")
                    window.location.reload()
                }
            } catch (error) {
                console.error(error);
            }
        }
        
        setIsLoading(false)
        //router.push(`/admin/hjddkd/products/${p_id}`);
    }

    const getViewClass = (view: string | undefined) => {
        switch (view) {
            case "slide":
                return styles.slideView
            case "query":
                return styles.queryView
            default: 
                undefined
        }
    }

    return (
        <main className={`${styles.main} ${getViewClass(view)}`}>
            <div className={styles.product} onClick={(e) => viewProduct(e, product._id!)}>
                <div className={styles.image}>
                    {product && product.images[0] ? (
                        <Image 
                            className={styles.img}
                            src={product.images[0].src!}
                            alt=""
                            width={product.images[0].width}
                            height={product.images[0].height}
                        />
                    ) : (
                        <></>
                    )}
                </div>
                <div className={styles.name}><span>{product.name}</span></div>
            </div>
            <div className={styles.price} onClick={(e) => viewProduct(e, product._id!)}>
                {clientInfo ? (
                    <span>{clientInfo?.countryInfo?.currency?.symbol}</span>
                ) : (
                    <></>
                )}
                {clientInfo?.countryInfo?.currency?.exchangeRate ? (
                    <span>
                        {product.pricing?.basePrice ? (round(product.pricing?.basePrice! * clientInfo.countryInfo?.currency?.exchangeRate, 2)).toLocaleString("en-US") : ""}
                    </span>
                ) : (
                    <></>
                )}
            </div>
            <span className={`${styles.status} ${product.active ? styles.activeStatus : ""}`}>{product.active ? "Active" : "Inactive"}</span>
            <div className={styles.actions_menu}>
                <button className={styles.menu} onClick={(e) => deleteProduct(e)}>
                    {isLoading ? (
                        <Loading width="20px" height="20px" />
                    ) : (
                        <DeleteOutlined className={styles.icon} />
                    )}
                </button>
                {/* <button className={styles.menu}><MoreVert className={styles.icon} /></button> */}
                <div className={styles.actions}>
                    {/* <button className={styles.view}></button> */}
                    {/* <button className={styles.edit}><Edit className={styles.icon} /></button> */}
                    <button className={styles.delete} onClick={(e) => deleteProduct(e)}>
                        {isLoading ? (
                            <Loading width="20px" height="20px" />
                        ) : (
                            <DeleteOutlined className={styles.icon} onClick={(e) => deleteProduct(e)} />
                        )}
                    </button>
                    {/* {!product.active ? (
                        <button className={styles.activate}><ThumbUpOffAlt className={styles.icon} /></button>
                    ) : (<></>)} */}
                </div>
            </div>
        </main>
    );
};
  
export default AdminProductCard;