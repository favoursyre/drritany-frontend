"use client"
///Admin product component

///Libraries -->
import styles from "./products.module.scss"
import Image from 'next/image';
import { notify, getItem } from "@/config/clientUtils";
import { sortOptions, backend, sortProductByLatest, sortProductByPrice, sortProductByOrder, sortProductByActiveStatus, adminName } from "@/config/utils"
import { IAdmin, IPricing, IProduct } from "@/config/interfaces";
import { useEffect, MouseEvent, FormEvent, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loadingCircle/Circle";
import { SearchOutlined, Add, Tune, CategoryOutlined } from "@mui/icons-material";
import AdminProductCard from "@/components/cards/adminProduct/AdminProductCard";

///Commencing the code 
//Admin product sort options
// const adminProductCategoryOptions = [
//     "All"
//     {id: 0, name: "Most Ordered"},
//     {id: 1, name: "Newest Arrivals"},
//     {id: 2, name: "Price: High to Low"},
//     {id: 3, name: "Price: Low to High"}
// ]
  
/**
 * @title Admin Product Component
 * @returns The Admin Product component
 */
const AdminProduct = ({ products_ }: { products_: Array<IProduct> }) => {
    const [query, setQuery] = useState<string>("")
    const router = useRouter()
    const [searchIsLoading, setSearchIsLoading] = useState<boolean>(false)
    const [addProductIsLoading, setAddProductIsLoading] = useState<boolean>(false)
    const [sort, setSort] = useState(false)
    const [sortId, setSortId] = useState(1)
    const [category, setCategory] = useState<boolean>(false)
    const [categoryOptions, setCategoryOptions] = useState<Array<string>>([ "All", "Active", "Inactive" ])
    const [products, setProducts] = useState<Array<IProduct>>(products_)
    const [categoryId, setCategoryId] = useState<number>(0)
    const [currentURL, setCurrentURL] = useState(window.location.href)
    const [admin, setAdmin] = useState<IAdmin>(getItem(adminName))
    
    // useEffect(() => {
    //     window.scrollTo({ top: 0, behavior: 'smooth' });
        

    //     //window.location.reload()
    //     //  setSearchIsLoading(() => false)
    // })

    useEffect(() => {
        console.log("Title: ", document.title)
        if (!products) {
            notify("info", "Product not found")
        }
        
        const intervalId = setInterval(() => {
            if (currentURL === window.location.href) {
                //console.log('not changed')
                undefined
            } else {
                //console.log("changed")
                clearInterval(intervalId)
                setCurrentURL(window.location.href)
               window.location.reload()
            }
            
        }, 1000);

        return () => clearInterval(intervalId);
    }, [currentURL]);

    //This is triggered when the user searches for a product
    const onSearch = async (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
        e.preventDefault()

        if (query && admin) {
          setSearchIsLoading(() => true)
          console.log("searching: ", query)
          router.push(`/admin/${admin._id}/products?query=${query}`)
        } 
    }

    //This is triggered when a category is clicked
    const chooseCategory = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, id: number) => {
        e.preventDefault()
        setCategory(false)
        setCategoryId(id)
        let sortedProducts: Array<IProduct>

        if (id === 0) {
            sortedProducts = sortProductByActiveStatus(products_, "All")!
            setProducts(() => [...sortedProducts])
        } else if (id === 1) {
            sortedProducts = sortProductByActiveStatus(products_, "Active")!
            setProducts(() => [...sortedProducts])
        } else if (id === 2) {
            sortedProducts = sortProductByActiveStatus(products_, "Inactive")!
            setProducts(() => [...sortedProducts])
        }
    }

    //This is triggered when a sort method is clicked
    const filterProduct = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, sort: number) => {
        e.preventDefault()
        setSort(false)
        setSortId(sort)
        let sortedProducts: Array<IProduct>

        if (sort === 0) {
            sortedProducts = sortProductByOrder(products_)
            //setProductList(() => [...product_])
            setProducts(() => [...sortedProducts])
        } else if (sort === 1) {
            sortedProducts = sortProductByLatest(products_)
            //product_ = sortByCategory(productList, "Health & Personal Care")
            //setProductList(() => [...product_])
            setProducts(() => [...sortedProducts])
        } else if (sort === 2) {
            sortedProducts = sortProductByPrice(products_, "descend")
            //setProductList(() => [...product_])
            setProducts(() => [...sortedProducts])
        } else if (sort === 3) {
            sortedProducts = sortProductByPrice(products_, "ascend")
            //setProductList(() => [...product_])
            setProducts(() => [...sortedProducts])
        }
    }

    //This is triggered when add product is clicked
    const addProduct = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        setAddProductIsLoading(true)
        router.push(`/admin/${admin._id}/products/create`)

        // for (let product of products) {
        //     //const productData = product
        //     const pricing: IPricing = {
        //         basePrice: product.price,
        //         discount: product.discount,
        //         extraDiscount: {
        //             limit: 10,
        //             percent: 5
        //         },
        //         inStock: true
        //     }
        //     const active = true
        //     //const orders = 0
        //     const productData = { ...product, pricing, active }
        //     const res = await fetch(`${backend}/product/${product._id}`, {
        //         method: "PATCH",
        //         body: JSON.stringify(productData),
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //     })
        
        //     if (res.ok) {
        //         console.log("Res: ", res.json())
        //         notify("success", "Product Updated Successfully")
        //         //window.location.reload()
        //     }
        // }
        // setAddProductIsLoading(false)
    }

    return (
        <main className={`${styles.main}`}>
            <div className={styles.div1}>
                <form className={`${styles.search_form}`} onSubmit={(e) => {
                    onSearch(e)
                    //window.location.reload()
                }}>
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                    />
                    <button>
                        {searchIsLoading ? (
                            <Loading width="20px" height="20px" />
                        ) : (
                            <SearchOutlined style={{ fontSize: "2rem" }} className={styles.icon} />
                        )}
                    </button>
                </form>
                <button className={styles.addButton} onClick={(e) => addProduct(e)}>
                    {addProductIsLoading ? (
                        <Loading width="20px" height="20px" />
                    ) : (
                        <Fragment>
                            <Add className={styles.icon} />
                            <span>Add Product</span>
                        </Fragment>
                    )}
                </button>
            </div>
            <div className={styles.filters}>
                <div className={styles.category}>
                    {/* <span>Category</span> */}
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
                    {/* <span>Sort</span> */}
                    <div className={`${styles.sort_option} ${!sort ? styles.inactiveSort : ""}`}>
                        {sortOptions.map((option, _id) => (
                            <button key={_id} className={sortId === _id ? styles.activeSortButton : styles.inActiveSortButton} onClick={(e) => filterProduct(e, option.id)}>
                                {option.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.product_list}>
                <div className={styles.product_header}>
                    <span className={styles.span1}><strong>Product</strong></span>
                    <span className={styles.span2}><strong>Price</strong></span>
                    <span className={styles.span3}><strong>Status</strong></span>
                    <span className={styles.span4}><strong>Action</strong></span>
                </div>
                <div className={styles.product_carousel}>
                    {products ? products.map((product, _id) => (
                        <AdminProductCard key={_id} products_={product} view={undefined} />
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
  
export default AdminProduct;