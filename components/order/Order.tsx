"use client"
///Orders component

///Libraries -->
import styles from "./order.module.scss"
import Image from 'next/image';
import { notify, getItem } from "@/config/clientUtils";
import { sortOrderOptions, backend, sortMongoQueryByTime, sortProductByPrice, sortProductByOrder, sortProductByActiveStatus, adminName, orderName } from "@/config/utils"
import { IAdmin, IModalBackgroundStore, IOrder, IPricing, IProduct } from "@/config/interfaces";
import { useEffect, MouseEvent, FormEvent, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loadingCircle/Circle";
import { SearchOutlined, Add, Tune, CategoryOutlined } from "@mui/icons-material";
import AdminProductCard from "@/components/cards/adminProduct/AdminProductCard";
import puppeteer from "puppeteer"
import { useModalBackgroundStore, useLoadingModalStore } from "@/config/store";
import OrderCard from "@/components/cards/order/OrderCard";

/**
 * @title Order Component
 * @returns The Order component
 */
const Order = ({ orders_ }: { orders_: Array<IOrder> }) => {
    const [query, setQuery] = useState<string>("")
    const router = useRouter()
    const [searchIsLoading, setSearchIsLoading] = useState<boolean>(false)
    const [addProductIsLoading, setAddProductIsLoading] = useState<boolean>(false)
    const [sort, setSort] = useState(false)
    const [sortId, setSortId] = useState(1)
    const [category, setCategory] = useState<boolean>(false)
    const [categoryOptions, setCategoryOptions] = useState<Array<string>>([ "All", "Active", "Inactive" ])
    //const orders_ = getItem(orderName)
    const [orders, setOrders] = useState<Array<IOrder>>(orders_!)
    const [categoryId, setCategoryId] = useState<number>(0)
    const [currentURL, setCurrentURL] = useState<string>()
    const [admin, setAdmin] = useState<IAdmin>(getItem(adminName))
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentURL(() => window.location.href)
        }

        if (!orders_ || orders.length === 0) {
            notify("info", "No orders, redirecting you")

            //Setting loading
            setModalBackground(true)
            setLoadingModal(true)

            router.push("/products")
        }

    }, [])
    
    // useEffect(() => {
    //     const main = async () => {
    //         const res = await fetch(`${backend}/scraper`)
         
    //         console.log("html scrap", await res.json())
    //     }

    //     console.log("testing api")
    //    main()
    // })

    // useEffect(() => {
    //     //main();

    //     console.log("Title1: ", document.title)
    //     if (!products) {
    //         notify("info", "Product not found")
    //     }
        
    //     const intervalId = setInterval(() => {
    //         if (currentURL === window.location.href) {
    //             //console.log('not changed')
    //             undefined
    //         } else {
    //             //console.log("changed")
    //             clearInterval(intervalId)
    //             setCurrentURL(window.location.href)
    //            window.location.reload()
    //         }
            
    //     }, 1000);

    //     return () => clearInterval(intervalId);
    // }, [currentURL]);

    //This is triggered when the user searches for an order
    const onSearch = async (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
        e.preventDefault()

        if (query && admin) {
          //Setting the loading modal
            setModalBackground(true)
            setLoadingModal(true)

            console.log("searching: ", query)
            router.push(`/admin/${admin._id}/orders?query=${query}`)
        } 
    }

    //This is triggered when a category is clicked
    const chooseCategory = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, id: number) => {
        e.preventDefault()
        setCategory(false)
        setCategoryId(id)
        let sortedProducts: Array<IProduct>

        // if (id === 0) {
        //     sortedProducts = sortProductByActiveStatus(products_, "All")!
        //     setProducts(() => [...sortedProducts])
        // } else if (id === 1) {
        //     sortedProducts = sortProductByActiveStatus(products_, "Active")!
        //     setProducts(() => [...sortedProducts])
        // } else if (id === 2) {
        //     sortedProducts = sortProductByActiveStatus(products_, "Inactive")!
        //     setProducts(() => [...sortedProducts])
        // }
    }

    //This is triggered when a sort method is clicked
    const filterProduct = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, sort: number) => {
        e.preventDefault()
        setSort(false)
        setSortId(sort)
        let sortedOrders: Array<IOrder>

        //Sorting the orders
        switch (sort) {
            case 0:
                sortedOrders = sortMongoQueryByTime(orders_, "latest")
                setOrders(() => [...sortedOrders])
                break
            case 1:
                sortedOrders = sortMongoQueryByTime(orders_, "oldest")
                setOrders(() => [...sortedOrders])
                break
            default:
                break
        }
    }

    //This function is trigerred when an admin wants to add a new order
    const addOrder = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        //Setting the loading modal
        setModalBackground(true)
        setLoadingModal(true)

        //Routing the admin to products page
        router.push(`/#products`)
    }


    return (
        <main className={`${styles.main}`}>
            {/* <div className={styles.div1}>
                <form className={`${styles.search_form}`} onSubmit={(e) => {
                    onSearch(e)
                }}>
                    <input 
                        type="text" 
                        placeholder="Search by id, recipient" 
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                    />
                    <button>
                        <SearchOutlined style={{ fontSize: "2rem" }} className={styles.icon} />
                    </button>
                </form>
                <button className={styles.addButton} onClick={(e) => addOrder(e)}>
                    <Add className={styles.icon} />
                    <span>Add Order</span>
                </button>
            </div> */}
            {/* <div className={styles.filters}>
                <div className={styles.category}>
                    <button className={styles.category_button} onClick={() => setCategory(() => !category)}>
                        <CategoryOutlined />
                    </button> 
                    <div className={`${styles.category_option} ${!category ? styles.inactiveSort : ""}`}>
                        {categoryOptions.map((category, _id) => (
                            <button key={_id} className={categoryId === _id ? styles.activeSortButton : styles.inActiveSortButton} onClick={(e) => chooseCategory(e, _id)}>{category}</button>
                        ))}
                    </div>
                </div>
                <div className={`${styles.sort_section}`}>
                    <button className={styles.sort_button} onClick={() => setSort(!sort)}>
                        <Tune />
                    </button> 
                    <div className={`${styles.sort_option} ${!sort ? styles.inactiveSort : ""}`}>
                        {sortOrderOptions.map((option, _id) => (
                            <button key={_id} className={sortId === _id ? styles.activeSortButton : styles.inActiveSortButton} onClick={(e) => filterProduct(e, option.id)}>
                                {option.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div> */}
            <div className={styles.order_list}>
                <div className={styles.order_header}>
                    <span className={styles.span1}><strong>Orders</strong><span>({orders ? orders.length : 0})</span></span>
                    <span className={styles.span2}><strong>Price</strong></span>
                    <span className={styles.span3}><strong>Payment</strong></span>
                    <span className={styles.span4}><strong>Delivery</strong></span>
                    {/* <span className={styles.span5}><strong>Action</strong></span> */}
                </div>
                <div className={styles.order_carousel}>
                    {orders ? orders.map((order, _id) => (
                        <OrderCard key={_id} order_={order} view={undefined} />
                    )) : (<></>)}
                </div>
                {/* <div className={styles.pagination_section}>
                        <button onClick={e => goPrev(e)}>
                            <KeyboardArrowLeftIcon />
                        </button>
                        <span>{width <= 550 ? mobileCurrentIndex + 1 : pcCurrentIndex + 1} / {width <= 550 ? mobileTotalPage.length : pcTotalPage.length}</span>
                        <button onClick={e => goNext(e)}>
                            <KeyboardArrowRightIcon />
                        </button>
                    </div> */}
            </div>
        </main>
    );
};
  
export default Order;