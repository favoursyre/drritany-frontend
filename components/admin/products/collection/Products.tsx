"use client"
///Admin product component

///Libraries -->
import styles from "./products.module.scss"
import Image from 'next/image';
import { notify, getItem } from "@/config/clientUtils";
import { sortProductOptions, backend, sortMongoQueryByTime, sortProductByPrice, sortProductByOrder, sortProductByActiveStatus, adminName, sortProductByRating, sleep } from "@/config/utils"
import { IAdmin, IPricing, IProduct } from "@/config/interfaces";
import { useEffect, MouseEvent, FormEvent, useState, Fragment, useRef } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loadingCircle/Circle";
import { SearchOutlined, Add, Tune, CategoryOutlined } from "@mui/icons-material";
import AdminProductCard from "@/components/cards/adminProduct/AdminProductCard";
import puppeteer from "puppeteer"

/**
 * @title Admin Product Component
 * @returns The Admin Product component
 */
const AdminProduct = ({ products_ }: { products_: Array<IProduct> }) => {
    //console.log('Products 1: ', products_)
    const [query, setQuery] = useState<string>("")
    const router = useRouter()
    const [productList, setProductList] = useState<Array<IProduct>>([])
    const [products, setProducts] = useState<Array<IProduct>>([])
    const [searchIsLoading, setSearchIsLoading] = useState<boolean>(false)
    const [addProductIsLoading, setAddProductIsLoading] = useState<boolean>(false)
    const [sort, setSort] = useState(false)
    const [sortId, setSortId] = useState(1)
    const [category, setCategory] = useState<boolean>(false)
    const [sortOptions, setSortOptions] = useState<Array<{ id: number, name: string}>>([...sortProductOptions, { id: 5, name: "Oldest"}])
    const [categoryOptions, setCategoryOptions] = useState<Array<string>>([ "All", "Active", "Inactive" ])
    //const [products, setProducts] = useState<Array<IProduct>>(products_)
    //console.log('Products 2: ', products_)
    const [categoryId, setCategoryId] = useState<number>(0)
    const [currentURL, setCurrentURL] = useState(typeof window !== "undefined" ? window.location.href : "")
    const [admin, setAdmin] = useState<IAdmin>(getItem(adminName))
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [dataIsLoading, setDataIsLoading] = useState<boolean>(false)
    const limit = 18; // Define how many products per page (controls payload size per "load")
    const [currentBatch, setCurrentBatch] = useState<number>(1);
    //const [currentIndex, setCurrentIndex] = useState<number>()
    const [totalBatch, setTotalBatch] = useState<number>()
    
    // useEffect(() => {
    //     const main = async () => {
    //         const res = await fetch(`${backend}/scraper`)
         
    //         console.log("html scrap", await res.json())
    //     }

    //     console.log("testing api")
    //    main()
    // })

     //Updating the product and query
    useEffect(() => {
        //console.log("Products Len: ", products.length)
        const start = (currentBatch - 1) * limit
        const end = start + limit

        //console.log("Product data:", product_);

        if (products_ && products_.length > 0) {
            const product__ = products_.slice(0, end)
            setProductList(() => products_);
            setProducts(() => product__);
            //console.log("Products 2: ", product__)
            const _possibleBatches = Math.ceil(products_.length / limit)
            //console.log("Total batch: ", _possibleBatches)
            setTotalBatch(() => _possibleBatches)
        }

        //console.log("Products 5: ", products)
        //notify("info", `Len ${products.length}`)
        //setViewProducts(() => newProducts.slice(start, end))
    }, [products_]);

    useEffect(() => {
        //console.log("Title1: ", document.title)
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
                setSearchIsLoading(false)
                //window.location.reload()
            }
            
        }, 1000);

        return () => clearInterval(intervalId);
    }, [currentURL, products]);

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

        //Sorting the products
        switch (id) {
            case 0:
                sortedProducts = sortProductByActiveStatus(products_, "All")!
                setProducts(() => [...sortedProducts])
                break
            case 1:
                sortedProducts = sortProductByActiveStatus(products_, "Active", "unshow")!
                setProducts(() => [...sortedProducts])
                break
            case 2:
                sortedProducts = sortProductByActiveStatus(products_, "Inactive")!
                setProducts(() => [...sortedProducts])
                break
            default:
                break
        }
    }

    //This is triggered when a sort method is clicked
    const filterProduct = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, sort: number) => {
        e.preventDefault()
        setSort(false)
        setSortId(sort)
        let sortedProducts: Array<IProduct>

        //Sorting the products
        switch (sort) {
            case 0:
                sortedProducts = sortProductByOrder(products_)
                setProducts(() => [...sortedProducts])
                break;
            case 1:
                sortedProducts = sortMongoQueryByTime(products_, "latest")
                setProducts(() => [...sortedProducts])
                break;
            case 2:
                sortedProducts = sortProductByPrice(products_, "descend")
                setProducts(() => [...sortedProducts])
                break;
            case 3:
                sortedProducts = sortProductByPrice(products_, "ascend")
                setProducts(() => [...sortedProducts])
                break;
            case 4:
                sortedProducts = sortProductByRating(products_)
                setProducts(() => [...sortedProducts])
                break;
            case 5:
                sortedProducts = sortMongoQueryByTime(products_, "oldest")
                setProducts(() => [...sortedProducts])
                break;
            default:
                console.log('Unknown action. Please use start, stop, or pause.');
                break;
        }
    }

    // Check if we've reached the bottom of the div
        const handleScroll = async () => {
            if (containerRef.current) {  // Make sure the ref is not null
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;  // Get scroll information
            //notify("info", `testing`)
    
            // If the user has scrolled to the bottom of the container
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                    console.log("Batch: ", currentBatch, totalBatch)
                    //notify("info", `data: ${dataIsLoading}, ${currentBatch}, ${totalBatch}`)
    
                if (!dataIsLoading && currentBatch < totalBatch!) {  // Only load more if it's not currently loading and there are more products
                    console.log("It has reached the bottom")
                    //notify("info", `bottom reached`)
    
                    setDataIsLoading(() => true)
    
                    const newBatch = currentBatch + 1
                    setCurrentBatch(() => newBatch)
                    const start = (newBatch - 1) * limit
                    const end = start + limit
                    console.log("SE: ", start, end)
                    const newProducts = productList?.slice(start, end)
                    //products.push(...newProducts)
                    //const _products = [...products, ...newProducts]
                    setProducts((prevProducts) => [...prevProducts, ...newProducts])
    
                    console.log("Products Len: ", products.length)
    
                    await sleep(1)
                    setDataIsLoading(() => false)
                    //setLoading(true);  // Set loading to true to display the loading message
                    //loadMoreProducts();  // Load more products
                    //setLoading(false);  // Set loading to false once loading is complete
                }
            }
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
                    <span className={styles.span1}><strong>Product</strong><span>({products.length})</span></span>
                    <span className={styles.span2}><strong>Price</strong></span>
                    <span className={styles.span3}><strong>Status</strong></span>
                    <span className={styles.span4}><strong>Action</strong></span>
                </div>
                <div 
                    className={styles.product_carousel}
                    ref={containerRef}
                    onScroll={handleScroll}
                >
                    {products && products.length !== 0 ? products.map((product, _id) => (
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