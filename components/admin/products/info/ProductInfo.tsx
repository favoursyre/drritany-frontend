"use client"
///Admin Product Info component

///Libraries -->
import { useState, useEffect, MouseEvent, ChangeEvent, Fragment, DragEvent, useRef } from "react"
import styles from "./productInfo.module.scss"
import { IProduct, ICart, IPricing, ICategory, ICategoryInfo, IProductGeneric, IImage, IAdmin } from '@/config/interfaces';
import { setItem, notify, getItem, removeItem } from '@/config/clientUtils';
import { cartName, sleep, backend, isVideo, capitalizeFirstLetter, categories, formatDateMongo, arrayToString, stringToArray, adminName, productInfoName, isImage, getGDriveDirectLinkId, getGDriveDirectLink, getGDrivePreviewLink } from '@/config/utils'
import { useRouter, usePathname } from 'next/navigation';
import { useModalBackgroundStore, useDiscountModalStore } from '@/config/store';
import { PreviewOutlined, DeleteOutlined, Edit, ThumbUpOffAlt, Close, FileUploadOutlined, SaveOutlined, ThumbDownOffAlt } from '@mui/icons-material';
import Loading from '@/components/loadingCircle/Circle';
import fs from "fs"
import FormData from "form-data";
import { GoogleDriveStore } from "@/config/serverUtils";
import Image from "next/image";
import { drive_v3 } from "googleapis";

///Commencing the code

/**
 * @title Admin Product Info Component
 * @returns The Admin Product Info component
 */
const AdminProductInfo = ({ product_ }: { product_: Array<IProduct> | undefined }) => {
    const [adminUser, setAdminUser] = useState<IAdmin | undefined>(getItem(adminName))
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [productDraft, setProductDraft] = useState<IProduct | null>(getItem(productInfoName))
    const [editIsLoading, setEditIsLoading] = useState<boolean>(false)
    const [previewIsLoading, setPreviewIsLoading] = useState<boolean>(false)
    const [activateIsLoading, setActivateIsLoading] = useState<boolean>(false)
    const [deleteIsLoading, setDeleteIsLoading] = useState<boolean>(false)
    const [cart, setCart] = useState<ICart | null>(getItem(cartName))
    const [productMedias, setProductMedias] = useState<Array<IImage>>([])
    const [product, setProduct] = useState<IProduct>()
    const [uploadIsLoading, setUploadIsLoading] = useState<boolean>()
    const [category, setCategory] = useState<ICategory>();
    const [categoryInfo, setCategoryInfo] = useState<ICategoryInfo>();
    //const [pricing, setPricing] = useState<IPricing>()
    const [inStockOption, setInStockOption] = useState<string>("")
    const [stockOptions, setStockOptions] = useState<Array<string>>(["True", "False"])
    //const [mainImage, setMainImage] = useState(product.images[0])
    const [productName, setProductName] = useState<string>("")
    const [productDescription, setProductDescription] = useState<string>("")
    const [productRating, setProductRating] = useState<number>()
    const [ratings, setRatings] = useState<Array<number>>([4.5, 4.6, 4.7, 4.8, 4.9])
    const [basePrice, setBasePrice] = useState<number>()
    const [baseDiscount, setBaseDiscount] = useState<number>()
    const [xtraDiscountLimit, setXtraDiscountLimit] = useState<number>()
    const [xtraDiscountPercent, setXtraDiscountPercent] = useState<number>()
    const [inStock, setInStock] = useState<boolean>()
    const [macroCategory, setMacroCategory] = useState<string>("")
    const [miniCategory, setMiniCategory] = useState<string>("")
    const [microCategory, setMicroCategory] = useState<string>("")
    const [nanoCategory, setNanoCategory] = useState<string>("")
    const [productBrand, setProductBrand] = useState<string>("")
    const [productModel, setProductModel] = useState<string>("")
    const [productItemForm, setProductItemForm] = useState<string>("")
    const [productItemCount, setProductItemCount] = useState<number>()
    const [productAgeRange, setProductAgeRange] = useState<string>("")
    const [productGender, setProductGender] = useState<string>("")
    const [productPrescription, setProductPrescription] = useState<string>("")
    const [productBenefits, setProductBenefits] = useState<string>("")
    const [productIngredients, setProductIngredients] = useState<string>("")
    const [productColors, setProductColors] = useState<string>("")
    const [productSizes, setProductSizes] = useState<string>("")
    const [productWeight, setProductWeight] = useState<number>()
    const [productOrigin, setProductOrigin] = useState<string>("")
    const [productLength, setProductLength] = useState<number>()
    const [productWidth, setProductWidth] = useState<number>()
    const [productHeight, setProductHeight] = useState<number>()
    const [productActiveStatus, setProductActiveStatus] = useState<boolean>()
    const [mainImageId, setMainImageId] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [deliveryDate, setDeliveryDate] = useState<string>("")
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [selectedFiles, setSelectedFiles] = useState<Array<IImage> | undefined>(undefined);
    const [imageMaxLength, setImageMaxLength] = useState(3)
    const [imageMaxSize, setImageMaxSize] = useState(15)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setDiscountModal = useDiscountModalStore(state => state.setDiscountModal);
    const setDiscountProduct = useDiscountModalStore(state => state.setDiscountProduct);
    const discountProduct = useDiscountModalStore(state => state.product);
    const [microsNob, setMicrosNob] = useState<boolean>()
    const [totalImageSize, setTotalImageSize] = useState<number>(0)
    const [editInfo, setEditInfo] = useState<boolean>(false)

    //Handle the drag-over event
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (selectedFiles && selectedFiles.length > 3) {
            notify("error", "Only a maximum of 3 images is allowed")
            return
        } 
    };

    ///This is used to make certain tags disabled until user wants to edit
    const setTagVisibility = (): boolean => {
        if (product_) {
            if (editInfo) {
                return false
            } else {
                //notify("info", "Edit is disabled, enable edit to continue")
                return true
            }
        } else {
            return false
        }
    }

    //This function checks if all the required inputs are given
    const validateRequiredInputs = async () => {
        if (!productName) {
            notify("error", "Product name is required")
            return
        } else if (!productDescription) {
            notify("error", "Product description is required")
            return
        } else if (!productRating) {
            notify("error", "Product rating is required")
            return
        } else if (!macroCategory) {
            notify("error", "Macro category is required")
            return
        } else if (!miniCategory) {
            notify("error", "Mini category is required")
            return
        } else if (!microCategory) {
            notify("error", "Micro category is required")
            return
        } else if (!basePrice) {
            notify("error", "Product base price is required")
            return
        } else if (!baseDiscount) {
            notify("error", "Product base discount is required")
            return
        } else if (!productBrand) {
            notify("error", "Product brand is required")
            return
        } else if (!productItemForm) {
            notify("error", "Product item form is required")
            return
        } else if (!productItemCount) {
            notify("error", "Product item count is required")
            return
        } else if (!productWeight) {
            notify("error", "Product weight is required")
            return
        } else if (!productPrescription) {
            notify("error", "Product prescription is required")
            return
        } else if (!productBenefits) {
            notify("error", "Product benefits is required")
            return
        } else if (!inStockOption) {
            notify("error", "Product in stock status is required")
            return
        } else if (!productOrigin) {
            notify("error", "Product origin is required")
            return
        }  
    }

    ///This function fills up the infos with available data
    const fillUpProductForm = (p: IProduct) => {
        //const p = product_[0]
        setProduct(() => p)
        setProductName(p.name!)
        setMacroCategory(p.category?.macro!)
        setMiniCategory(p.category?.mini!)
        setMicroCategory(p.category?.micro!)
        setNanoCategory(p.category?.nano!)
        setCategory({
            macro: p.category?.macro!,
            mini: p.category?.mini!,
            micro: p.category?.micro!,
            nano: p.category?.nano!
        })
        setProductDescription(p.description!)
        setBasePrice(p.pricing?.basePrice)
        setProductRating(p.rating)
        setProductMedias(p.images)
        setBaseDiscount(p.pricing?.discount)
        setInStockOption(p.pricing?.inStock ? "True" : "False")
        setXtraDiscountLimit(p.pricing?.extraDiscount?.limit)
        setXtraDiscountPercent(p.pricing?.extraDiscount?.percent)
        setProductBrand(p.specification?.brand!)
        setProductModel(p.specification?.modelNumber!)
        setProductItemForm(p.specification?.itemForm!)
        setProductItemCount(p.specification?.itemCount!)
        setProductAgeRange(p.specification?.userAgeRange!)
        setProductGender(p.specification?.gender!)
        setProductBenefits(arrayToString(p.specification?.benefits!))
        setProductIngredients(arrayToString(p.specification?.ingredients!))
        setProductPrescription(arrayToString(p.specification?.prescription!))
        setProductColors(arrayToString(p.specification?.colors!))
        setProductSizes(arrayToString(p.specification?.sizes!))
        setProductOrigin(p.specification?.productOrigin!)
        setProductWeight(p.specification?.weight)
        setProductLength(p.specification?.dimension?.length)
        setProductHeight(p.specification?.dimension?.height)
        setProductWidth(p.specification?.dimension?.width)
        setProductActiveStatus(p.active)
    }

    useEffect(() => {
        if (product_) {
            fillUpProductForm(product_[0])
        }
        // } else if (productDraft) {
        //     notify("info", 'Continue from where you stopped')
        //     fillUpProductForm(productDraft)
        // }

        // if (!macroCategory) {
        //     let macro = categories[0].macro
        //     setMacroCategory(macro)
        //     // const category_ = { macro } as unknown as ICategory
        //     // setCategory(() => category_)
        //     // const info = categories.find((c) => c.macro === macro)
        //     // setCategoryInfo(() => info)
        // }
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            console.log("Medias 3:", productMedias)
            console.log("Local Medias: ", getItem(productInfoName))
            console.log("Product Name: ", isImage("four-quandrant-names-RN.jpg"))
        }, 1000);
    
        return () => {
            clearInterval(interval);
        };
        
    }, [productMedias]);

    ///This function is triggered when a user wants to edit/save the product info
    const updateProductInfo = async (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent>, label: "edit" | "create" | "activate" | "deactivate") => {
        e.preventDefault()

        //Setting the active status back to false so that it can be confirmed by an admin superuser later on
        // if (label === "edit") {
        //     setProductActiveStatus(false)
        // }

        //Validate all required infos
        //await validateRequiredInputs()
        if (!productName) {
            notify("error", "Product name is required")
            return
        } else if (!productDescription) {
            notify("error", "Product description is required")
            return
        } else if (!productRating) {
            notify("error", "Product rating is required")
            return
        } else if (!macroCategory) {
            notify("error", "Macro category is required")
            return
        } else if (!miniCategory) {
            notify("error", "Mini category is required")
            return
        } else if (!microCategory) {
            notify("error", "Micro category is required")
            return
        } else if (!basePrice) {
            notify("error", "Product base price is required")
            return
        } else if (!baseDiscount) {
            notify("error", "Product base discount is required")
            return
        } else if (!productBrand) {
            notify("error", "Product brand is required")
            return
        } else if (!productItemForm) {
            notify("error", "Product item form is required")
            return
        } else if (!productItemCount) {
            notify("error", "Product item count is required")
            return
        } else if (!productWeight) {
            notify("error", "Product weight is required")
            return
        } else if (!productPrescription) {
            notify("error", "Product prescription is required")
            return
        } else if (!productBenefits) {
            notify("error", "Product benefits is required")
            return
        } else if (!inStockOption) {
            notify("error", "Product in stock status is required")
            return
        } else if (!productOrigin) {
            notify("error", "Product origin is required")
            return
        } 

        //Arranging the data
        //const product = getItem(productInfoName) as unknown as IProduct
        const productData = arrangeProductData(label)
        console.log("Product Data: ", productData)

        //console.log("reached here")
        //Setting the loading effect properly
        if (label === "activate" || label === "deactivate") {
            setActivateIsLoading(true)
        } else {
            setEditIsLoading(true)
        }

        if (label === "create") {
            try {
                const res = await fetch(`${backend}/product`, {
                    method: "POST",
                    body: JSON.stringify(productData),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            
                if (res.ok) {
                    console.log("Res: ", res.json())
                    notify("success", "Product Created Successfully")
                    router.push(`/admin/${adminUser?._id}/products`)
                }
            } catch (error) {
                console.error(error);
            }
        } else if (label === "edit" || label === "activate" || label === "deactivate") {
            console.log("Product Data 2: ", productData)
            try {
                const p_id = product_ ? product_[0]._id : undefined
                const res = await fetch(`${backend}/product/${p_id}`, {
                    method: "PATCH",
                    body: JSON.stringify(productData),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            
                if (res.ok) {
                    console.log("Res: ", res.json())
                    notify("success", "Product Updated Successfully")
                    window.location.reload()
                }
            } catch (error) {
                console.error(error);
            }
        }

        if (label === "activate" || label === "deactivate") {
            setActivateIsLoading(false)
        } else {
            setEditIsLoading(false)
        }
        //removeItem(productInfoName)
    }

    //This function helps to arrange the products 
    const arrangeProductData = (label: string | void): IProduct => {
        const p = product_ ? product_[0] : undefined
        console.log('Edit sect: ', label)
        console.log("Option: ", inStockOption)
        const _product: IProduct = {
            name: productName,
            description: productDescription,
            category: {
                macro: macroCategory,
                mini: miniCategory,
                micro: microCategory,
                nano: nanoCategory
            },
            rating: productRating,
            images: productMedias!,
            orders: p ? p.orders : 0, //chane here to 0
            //images
            specification: {
                brand: productBrand,
                itemCount: productItemCount,
                itemForm: productItemForm,
                modelNumber: productModel,
                userAgeRange: productAgeRange,
                gender: productGender,
                ingredients: stringToArray(productIngredients),
                productOrigin: productOrigin,
                prescription: stringToArray(productPrescription),
                benefits: stringToArray(productBenefits),
                colors: stringToArray(productColors),
                sizes: stringToArray(productSizes),
                dimension: {
                    height: productHeight,
                    width: productWidth,
                    length: productLength
                },
                weight: productWeight,
            },
            pricing: {
                basePrice: basePrice!,
                discount: baseDiscount!,
                extraDiscount: xtraDiscountLimit ? {
                    limit: xtraDiscountLimit,
                    percent: xtraDiscountPercent
                } : undefined,
                inStock: inStockOption === "True" ? true : false
            },
            active: label === "edit" || label === "create" || label === "deactivate" ? false : true,
        }
        return _product
    }

    ///This function is triggered when a user updates a value in the form 
    const editProductInfo = (
        e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement> | any, 
        label: string | void
    ) => {
        e.preventDefault()
        const value = e.target.value

        console.log("Case: ", label)
        switch (label) {
            case "productName":
                setProductName(value)
                break
            case "productDescription":
                setProductDescription(value)
                break
            case "productRating":
                setProductRating(Number(value))
                break
            case "macroCategory":
                setMacroCategory(value)
                break
            case "miniCategory":
                setMiniCategory(value)
                break
            case "microCategory":
                setMicroCategory(value)
                break
            case "nanoCategory":
                setNanoCategory(value)
                break
            case "basePrice":
                console.log("Price")
                setBasePrice(Number(value))
                break
            case "baseDiscount":
                console.log("Discount")
                setBaseDiscount(Number(value))
                break
            case "xtraDiscountLimit":
                console.log("Discount Limit")
                setXtraDiscountLimit(Number(value))
                break
            case "xtraDiscountPercent":
                console.log("Discount Percent")
                setXtraDiscountPercent(Number(value))
                break
            case "productBrand":
                setProductBrand(capitalizeFirstLetter(value))
                break
            case "productModel":
                setProductModel(value)
                break
            case "productItemForm":
                setProductItemForm(capitalizeFirstLetter(value))
                break
            case "productItemCount":
                setProductItemCount(Number(value))
                break
            case "productAgeRange":
                setProductAgeRange(value)
                break
            case "productGender":
                setProductGender(value)
                break
            case "productIngredients":
                setProductIngredients(value)
                break
            case "productBenefits":
                setProductBenefits(value)
                break
            case "productPrescription":
                setProductPrescription(value)
                break
            case "productOrigin":
                setProductOrigin(value)
                break
            case "productColors":
                setProductColors(value)
                break
            case "productSizes":
                setProductSizes(value)
                break
            case "productWeight":
                setProductWeight(Number(value))
                break
            case "productLength":
                setProductLength(Number(value))
                break
            case "productWidth":
                setProductWidth(Number(value))
                break
            case "productHeight":
                setProductHeight(Number(value))
                break
            case "inStockOption":
                console.log('hi testing: ', value)
                setInStockOption(value)
                break
            default:
                undefined
                break
        }

        //Saving the info to local storage
        // const p = product_ ? product_[0] : undefined
        // console.log('Edit sect: ', productMedias)
        // const _product: IProduct = {
        //     name: productName,
        //     description: productDescription,
        //     category: {
        //         macro: macroCategory,
        //         mini: miniCategory,
        //         micro: microCategory,
        //         nano: nanoCategory
        //     },
        //     rating: productRating,
        //     images: productMedias!,
        //     orders: p ? p.orders : 0, //chane here to 0
        //     //images
        //     specification: {
        //         brand: productBrand,
        //         itemCount: productItemCount,
        //         itemForm: productItemForm,
        //         modelNumber: productModel,
        //         userAgeRange: productAgeRange,
        //         gender: productGender,
        //         ingredients: stringToArray(productIngredients),
        //         productOrigin: productOrigin,
        //         prescription: stringToArray(productPrescription),
        //         benefits: stringToArray(productBenefits),
        //         colors: stringToArray(productColors),
        //         sizes: stringToArray(productSizes),
        //         dimension: {
        //             height: productHeight,
        //             width: productWidth,
        //             length: productLength
        //         },
        //         weight: productWeight,
        //     },
        //     pricing: {
        //         basePrice: basePrice!,
        //         discount: baseDiscount!,
        //         inStock: inStockOption === "True" ? true : false
        //     },
        //     active: productActiveStatus,
        // }
        const _product_ = arrangeProductData()
        console.log('Products+: ', _product_)

        //Saving the info to local storage
        //setItem(productInfoName, _product)
        console.log("New product: ", _product_)
    }

    ///This handles what happens when delete product is clicked
    const deleteProduct = async (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent> | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()
        console.log('Here')

        if (!product) {
            return
        }

        //Checking admin priviledges
        if (adminUser && adminUser.superUser) {
            undefined
        } else {
            notify("error", "Permission denied")
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
                const res = await fetch(`${backend}/product/${product?._id}`, {
                  method: "DELETE",
                  cache: "no-store",
                })
            
                if (res.ok) {
                    console.log("Res: ", res.json())
                    notify("success", "Product Deleted Successfully")
                    router.push(`/admin/${adminUser?._id}/products`)
                }
            } catch (error) {
                console.error(error);
            }
        }
        
        setIsLoading(false)
        //router.push(`/admin/hjddkd/products/${p_id}`);
    }

    //This function is triggered when preview is clicked
    const previewProduct = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()
        setPreviewIsLoading(true)
        await sleep(1)

        if (product) {
            //window.open
            
            window.open(`/products/${product?._id}`, "_blank")
            setPreviewIsLoading(false)
        }
    }

    //This function is triggered when the user wants to activate/deactivate a product
    const activateProduct = async (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent>, label: "activate" | "deactivate") => {
        e.preventDefault()

        //Checking user priviledge
        console.log("Admin: ", adminUser)
        if (adminUser && adminUser.superUser) {
            undefined
        } else {
            notify("error", "Permission denied")
            return
        }

        const choice = confirm(`Are you sure you want to ${label} this product?`)
        if (choice) {
            //Updating the active status
            let status: boolean
            if (label === "activate") {
                status = true
            } else {
                status = false
            }
            setProductActiveStatus(status)
            await sleep(1)

            //Edit the info
            editProductInfo(e)
            
            //Uploading the info
            updateProductInfo(e, label)
        } else {
            return
        }
    }

    // Handles either the drop event or file select event
    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>  | DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        setUploadIsLoading(true)

        let file
        
        //Checking for the event and assinging the file variable accordingly
        if ('target' in e && e.target instanceof HTMLInputElement) { // It is a ChangeEvent<HTMLInputElement>
            file = e.target.files && e.target.files[0];
          } else if ('dataTransfer' in e && e.dataTransfer instanceof DataTransfer) { // It is a DragEvent<HTMLDivElement>
            file = e.dataTransfer.files[0];
          }
        //console.log("File Upload1: ", URL.createObjectURL(file))

        //Checking if the file is an image or video
        let fileType
        console.log("File Name: ", file?.name)
        if (isImage(file?.name)) {
            fileType = "image"
        } else if (isVideo(file?.name)) {
            fileType = "video"
        } else {
            notify("error", "File format not supported")
            return
        }

        console.log("stream: ", file?.stream())
        const form = new FormData()
        //formDa.append("folderId", folderId);
        form.append("file", file);
        //formData.append("driveId", driveId!);

        const res = await fetch(`${backend}/file`, {
            method: "POST",
            body: form as unknown as BodyInit,
        });
        console.log("Google Stream: ", res)

        if (res.ok) {
            //console.log("Data: ", await res.json())
            const res_ = await res.json()
            const data = res_.drive as unknown as drive_v3.Schema$File
            console.log("Data: ", data)
            const newFile: IImage = {
                driveId: data.id!,
                src: fileType === "video" ? getGDrivePreviewLink(data.id!) : getGDriveDirectLink(data.id!),
                name: file?.name,
                width: fileType === "video" ? 640 : data.imageMediaMetadata?.width,
                height: fileType === "video" ? 480 : data.imageMediaMetadata?.height,
                type: fileType!
            }
            let media: Array<IImage>
            if (!productMedias || productMedias.length === 0) {
                media = [newFile]
            } else {
                media = [...productMedias, newFile]
            }
            //media?.push(newFile)
            //productMedias.push(newFile)
            setProductMedias(() => [...media])
            //console.log("New File: ", newFile)
            console.log("Medias 1: ", media)
            console.log("Medias 2: ", productMedias)
        }

        await sleep(2)
        editProductInfo(e)
        //console.log("Google: ", google)
        setUploadIsLoading(false)
    };
    //console.log('Current page:', routerPath);

    //This function is triggered when the delete file item is clicked
    const deleteImageItem = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, index: number): Promise<void> => {
        e.preventDefault()

        setUploadIsLoading(true)

        const file: IImage = productMedias![index]

        let id
        console.log("item deleted")
        if (file.driveId) {
            id = file.driveId
        } else {
            id = getGDriveDirectLinkId(file.src)
            console.log('Id: ', id)
        }

        const res = await fetch(`${backend}/file?id=${id}`, {
            method: "DELETE"
        });
        console.log("Delete: ", await res.json())
        if (res.ok) {
           const media = productMedias
           media?.splice(index, 1)
           setProductMedias(() => [...media])
        }

        editProductInfo(e)
        setUploadIsLoading(false)
    }

    // useEffect(() => {
    //     console.log("Product Medias 1: ", productMedias)
    // }, [productMedias])

    return (
        <main className={`${styles.main}`}>
            <div className={styles.header}>
                <span className={product?.active ? styles.active : styles.inactive}>{product?.active ? "Active" : "Inactive"}</span>  
                <div className={styles.actions}>
                    {product_ ? (
                        <Fragment>
                            <button className={styles.view} onClick={(e) => previewProduct(e)}>
                                {previewIsLoading ? (
                                    <Loading width="20px" height="20px" />
                                ) : (
                                    <PreviewOutlined className={styles.icon} />
                                )}
                            </button>
                            <button className={styles.edit}>
                                {editIsLoading ? (
                                    <Loading width="20px" height="20px" />
                                ) : editInfo ? (
                                        <SaveOutlined className={styles.icon} onClick={(e) => updateProductInfo(e, "edit")} />
                                    ) : (
                                        <Edit className={styles.icon} onClick={(e) => setEditInfo(!editInfo)} />
                                    )  
                                }
                            </button>
                            <button className={styles.delete}>
                                {deleteIsLoading ? (
                                    <Loading width="20px" height="20px" />
                                ) : (
                                    <DeleteOutlined className={styles.icon} onClick={(e) => deleteProduct(e)} />
                                )}
                            </button>
                            <button className={styles.activate}>
                                {activateIsLoading ? (
                                    <Loading width="20px" height="20px" />
                                ) : product?.active ? (
                                        <ThumbDownOffAlt className={styles.icon} onClick={(e) => activateProduct(e, "deactivate")} />
                                    ) : (
                                        <ThumbUpOffAlt className={styles.icon} onClick={(e) => activateProduct(e, "activate")} />
                                    )
                                }
                            </button>
                        </Fragment>
                    ) : (
                        <button className={styles.edit}>
                            {editIsLoading ? (
                                <Loading width="20px" height="20px" />
                            ) : (
                                <SaveOutlined className={styles.icon} onClick={(e) => updateProductInfo(e, "create")} />
                            )}
                        </button>
                    )}
                </div>  
            </div>
            <div className={styles.form}>
                <div className={styles.recordSect}>
                    <span className={styles.title}><strong>Records</strong></span>
                    <div className={styles.inputs}>
                        <div className={styles.sku}>
                            <span className={styles.key}>SKU:</span>
                            <span className={styles.value}>{product?._id}</span>
                        </div>
                        <div className={styles.created}>
                            <span className={styles.key}>Created:</span>
                            <span className={styles.value}>{product && product.createdAt ? formatDateMongo(product.createdAt) : ""}</span>
                        </div>
                        <div className={styles.updated}>
                            <span className={styles.key}>Last Updated:</span>
                            <span className={styles.value}>{product && product.updatedAt ? formatDateMongo(product.updatedAt) : ""}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.categorySect}>
                    <span className={styles.title}><strong>Category</strong></span>
                    <div className={styles.inputs}>
                        <label >
                            Macro:
                            <select 
                                value={macroCategory} 
                                onChange={(e) => editProductInfo(e, "macroCategory")}
                                disabled={setTagVisibility()}
                            >
                                {categories.map((category, sid) => (
                                    <Fragment key={sid}>
                                        <option value="" disabled selected hidden>Choose a category</option>
                                        <option value={category.macro} key={sid}>{category.macro}</option>
                                    </Fragment>
                                ))}
                            </select>
                        </label>
                        <label >
                            Mini:
                            <select 
                            value={miniCategory} 
                            onChange={(e) => editProductInfo(e, "miniCategory")} 
                            disabled={setTagVisibility()}>
                                {categories.find((c) => c.macro === macroCategory)?.minis.map((mini, m_id) => (
                                    <Fragment key={m_id}>
                                        <option value="" disabled selected hidden>Choose a category</option>
                                        <option value={mini.mini} key={m_id}>{mini.mini}</option>
                                    </Fragment>
                                ))}
                            </select>
                        </label>
                        <label >
                            Micro:
                            <select 
                            value={microCategory} 
                            onChange={(e) => editProductInfo(e, "microCategory")} 
                            disabled={setTagVisibility()}>
                                {categories.find((c) => c.macro === macroCategory)?.minis.find((m) => m.mini === miniCategory)?.micros.map((micro, m_id) => (
                                    <Fragment key={m_id}>
                                        <option value="" disabled selected hidden>Choose a category</option>
                                        <option value={micro.micro} key={m_id}>{micro.micro}</option>
                                    </Fragment>
                                ))}
                            </select>
                        </label>
                        <label >
                            Nano:
                            <select 
                            value={nanoCategory} 
                            onChange={(e) => editProductInfo(e, "nanoCategory")} 
                            disabled={setTagVisibility()}>
                                {categories.find((c) => c.macro === macroCategory)?.minis.find((m) => m.mini === miniCategory)?.micros.find((m) => m.micro === microCategory)?.nanos.map((nano, n_id) => (
                                    <Fragment key={n_id}>
                                        <option value="" disabled selected hidden>Choose a category</option>
                                        <option value={nano} key={n_id}>{nano}</option>
                                    </Fragment>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
                <div className={styles.priceSect}>
                    <span className={styles.title}><strong>Price Information</strong></span>
                    <div className={styles.inputs}>
                        <label >
                            Base Price:
                            <input 
                                placeholder="USD" 
                                type="number" 
                                value={basePrice} 
                                onChange={(e) => editProductInfo(e, "basePrice")}
                                disabled={setTagVisibility()}
                            />
                            <div id="textCount">{"testing"}</div>
                        </label>
                        <label >
                            Discount:
                            <input 
                                placeholder="Discount" 
                                type="number" 
                                value={baseDiscount} 
                                onChange={(e) => editProductInfo(e, "baseDiscount")}
                                disabled={setTagVisibility()}
                            />
                            <div id="textCount">{"testing"}</div>
                        </label>
                        <label >
                            Extra Discount Limit:
                            <input 
                                placeholder="..." 
                                type="number" 
                                value={xtraDiscountLimit} 
                                onChange={(e) => editProductInfo(e, "xtraDiscountLimit")}
                            />
                        </label>
                        <label >
                            Extra Discount Percent:
                            <input 
                                placeholder="..." 
                                type="number" 
                                value={xtraDiscountPercent} 
                                onChange={(e) => editProductInfo(e, "xtraDiscountPercent")}
                            />
                            <div id="textCount">{"testing"}</div>
                        </label>
                        <label >
                            In Stock:
                            <select 
                                value={inStockOption} 
                                onChange={(e) => editProductInfo(e, "inStockOption")}
                                disabled={setTagVisibility()}
                            >
                                <option value="" disabled selected hidden>Choose an option</option>
                                <option value={"True"}>{"True"}</option>
                                <option value={"False"}>{"False"}</option>
                            </select>
                        </label>
                        <button>Add variant prices</button>
                    </div>
                </div>
                <div className={styles.genericSect}>
                    <span className={styles.title}><strong>General Information</strong></span>
                    <div className={styles.inputs}>
                        <label >
                            Name:
                            <input 
                                placeholder="Product name" 
                                type="text" 
                                onChange={(e) => editProductInfo(e, "productName")}
                                value={productName} 
                                disabled={setTagVisibility()}
                            />
                        </label>
                        <label className={styles.description}>
                            Description:
                            <textarea
                                placeholder="Product description"
                                onChange={(e) => editProductInfo(e, "productDescription")}
                                value={productDescription}
                                disabled={setTagVisibility()}
                            ></textarea>
                            <span>200/500</span>
                        </label>
                        <label >
                            Rating:
                            <select 
                                value={productRating} 
                                onChange={(e) => editProductInfo(e, "productRating")} 
                                disabled={setTagVisibility()}
                            >
                                {ratings.map((rating, _id) => (
                                    <Fragment key={_id}>
                                        <option value="" disabled selected hidden>Choose rating</option>
                                        <option value={rating} key={_id}>{rating}</option>
                                    </Fragment>
                                ))}
                            </select>
                        </label>
                        <div className={styles.orders}>
                            <span className={styles.key}>Orders: </span>
                            <span className={styles.value}>{product?.orders}</span>
                        </div>
                    </div>
                </div>
                <div 
                    className={styles.mediaSect}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleFileSelect(e)}
                >
                    <span className={styles.title}><strong>Media</strong></span>
                    <div className={styles.image}>
                        {/* <div className={styles.main_image}>
                            {view === "video" && product.videos ? (
                                <iframe
                                    className={styles.img}
                                    src={product.videos[videoIndex]?.src}
                                    width={product.videos[videoIndex]?.width}
                                    height={product.videos[videoIndex].height}
                                    allow="autoplay"
                                    loading="lazy"
                                    frameBorder={0}
                                    sandbox="allow-same-origin allow-scripts"
                                >
                                </iframe>
                            ) : (
                                <Image
                                    className={styles.img}
                                    src={product.images[imageIndex].src}
                                    alt=""
                                    width={product.images[imageIndex].width}
                                    height={product.images[imageIndex].height}
                                />
                            )}
                        </div>
                        <div className={styles.image_slide}>
                            {product.images.map((image, imageId) => (
                                <div key={imageId} className={`${styles.image} ${imageId === imageIndex ? styles.activeImage : ""}`} onClick={() => {
                                    setView(() => "image")
                                    setImageIndex(() => imageId)
                                }}>
                                    <Image
                                        className={styles.img}
                                        src={image.src}
                                        alt=""
                                        width={image.width}
                                        height={image.height}
                                    />
                                </div>
                            ))}
                            {product.videos && product.videos.length > 0 && product.videos[0].src ? product.videos.map((video, videoId) => (
                                <div className={styles.image} key={videoId} onClick={() => {
                                    setView(() => "video")
                                    setVideoIndex(() => videoId)
                                }}>
                                    <iframe
                                        className={styles.iframe}
                                        src={video.src}
                                        width={video.width}
                                        height={video.height}
                                        //allow="autoplay"
                                        frameBorder={0}
                                        //sandbox="allow-forms"
                                    >
                                </iframe>
                            </div>
                            )) : (
                                <></>
                            )}
                        </div> */}
                        <div className={styles.dragFile}>
                            {uploadIsLoading ? (
                                <Loading width="20px" height="20px" />
                            ) : (
                                <>
                                    <span>Drag and Drop Files to Upload</span>
                                    <span>Or</span>
                                    <button type="button" onClick={() => fileInputRef.current?.click()}>
                                        <FileUploadOutlined /> 
                                        <span>Attach Files</span>
                                    </button>
                                    <input 
                                        type="file"
                                        multiple
                                        style={{ display: "none" }}
                                        onChange={(e) => handleFileSelect(e)}
                                        ref={fileInputRef}
                                        disabled={setTagVisibility()}
                                    />
                                </>
                            )}
                        </div>
                        <div className={styles.label}>   
                            <span>{totalImageSize.toFixed(1)}mb/{imageMaxSize}mb</span>
                            <span className={styles.max}>{selectedFiles ? selectedFiles.length : 0}/{imageMaxLength}</span>
                        </div>
                        
                        <div className={styles.fileSlide}>
                            {productMedias ? productMedias.map((file, id) => (
                                <div className={styles.fileItem} key={id}>
                                    <div className={styles.icon}>
                                        <button 
                                            onClick={(e) => deleteImageItem(e, id)}
                                            disabled={setTagVisibility()}
                                        >
                                            <Close style={{ fontSize: "1rem" }} />
                                        </button>
                                    </div>
                                    {file.type === "video" ? (
                                        <iframe
                                            className={styles.iframe}
                                            src={file.src}
                                            width={file.width}
                                            height={file.height}
                                            //allow="autoplay"
                                            frameBorder={0}
                                            //sandbox="allow-forms"
                                        >
                                        </iframe>
                                    ) : (
                                        <Image 
                                            className={styles.img}
                                            src={file.src}
                                            alt={file.name!}
                                            width={file.width}
                                            height={file.height}
                                        /> 
                                    )}
                                </div>
                            )) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.specSect}>
                    <span className={styles.title}><strong>Specifications</strong></span>
                    <div className={styles.inputs}>
                        <label >
                            Brand: 
                            <input 
                                placeholder="Product brand" 
                                type="text" 
                                onChange={(e) => editProductInfo(e, "productBrand")}
                                value={productBrand} 
                                disabled={setTagVisibility()}
                            />
                        </label>
                        <label >
                            Model: 
                            <input 
                                placeholder="Product model" 
                                type="text" 
                                onChange={(e) => editProductInfo(e, "productModel")}
                                value={productModel} 
                                disabled={setTagVisibility()}
                            />
                        </label>
                        <label >
                            Item Form:
                            <input 
                                placeholder="Product item form" 
                                type="text" 
                                onChange={(e) => editProductInfo(e, "productItemForm")}
                                value={productItemForm} 
                                disabled={setTagVisibility()}
                            />
                        </label>
                        <label >
                            Item Count:
                            <input 
                                placeholder="Product item count" 
                                type="number" 
                                onChange={(e) => editProductInfo(e, "productItemCount")}
                                value={productItemCount} 
                                disabled={setTagVisibility()}
                            />
                        </label>
                        <label >
                            User Age Range:
                            <input 
                                placeholder="User age range" 
                                type="text" 
                                onChange={(e) => editProductInfo(e, "productAgeRange")}
                                value={productAgeRange} 
                                disabled={setTagVisibility()}
                            />
                        </label>
                        <label >
                            Gender:
                            <select 
                                value={productGender} 
                                onChange={(e) => editProductInfo(e, "productGender")}
                                disabled={setTagVisibility()}
                            >
                                <option value="" disabled selected hidden>Choose gender</option>
                                <option value={"Male"}>{"Male"}</option>
                                <option value={"Feale"}>{"Female"}</option>
                                <option value={"Unisex"}>{"Unisex"}</option>
                            </select>
                        </label>
                        <label className={styles.textarea}>
                            Benefits:
                            <textarea
                                placeholder="list a. list b. list c"
                                onChange={(e) => editProductInfo(e, "productBenefits")}
                                value={productBenefits}
                                disabled={setTagVisibility()}
                            ></textarea>
                            <span>200/500</span>
                        </label>
                        <label className={styles.textarea}>
                            Prescription:
                            <textarea
                                placeholder="list a. list b. list c"
                                onChange={(e) => editProductInfo(e, "productPrescription")}
                                value={productPrescription}
                                disabled={setTagVisibility()}
                            ></textarea>
                            <span>200/500</span>
                        </label>
                        <label className={styles.textarea}>
                            Ingredients:
                            <textarea
                                placeholder="list a. list b. list c"
                                onChange={(e) => editProductInfo(e, "productIngredients")}
                                value={productIngredients}
                                disabled={setTagVisibility()}
                            ></textarea>
                            <span>200/500</span>
                        </label>
                        <label >
                            Product Origin:
                            <input 
                                placeholder="country" 
                                type="text" 
                                onChange={(e) => editProductInfo(e, "productOrigin")}
                                value={productOrigin} 
                                disabled={setTagVisibility()}
                            />
                        </label>
                        <label >
                            Weight:
                            <input 
                                placeholder="Product weight" 
                                type="number" 
                                onChange={(e) => editProductInfo(e, "productWeight")}
                                value={productWeight} 
                                disabled={setTagVisibility()}
                            />
                            <span>Kg</span>
                        </label>
                        <label >
                            Length:
                            <input 
                                placeholder="Product Length" 
                                type="number" 
                                onChange={(e) => editProductInfo(e, "productLength")}
                                value={productLength} 
                                disabled={setTagVisibility()}
                            />
                            <span>Inches</span>
                        </label>
                        <label >
                            Width:
                            <input 
                                placeholder="Product width" 
                                type="number" 
                                onChange={(e) => editProductInfo(e, "productWidth")}
                                value={productWidth} 
                                disabled={setTagVisibility()}
                            />
                            <span>Inches</span>
                        </label>
                        <label >
                            Height:
                            <input 
                                placeholder="Product height" 
                                type="number" 
                                onChange={(e) => editProductInfo(e, "productHeight")}
                                value={productHeight} 
                                disabled={setTagVisibility()}
                            />
                            <span>Inches</span>
                        </label>
                        <label >
                            Colors:
                            <input 
                                placeholder="color1. color2. color3" 
                                type="text" 
                                onChange={(e) => editProductInfo(e, "productColors")}
                                value={productColors} 
                                disabled={setTagVisibility()}
                            />
                        </label>
                        <label >
                            Sizes:
                            <input 
                                placeholder="size1. size2. size3" 
                                type="text" 
                                onChange={(e) => editProductInfo(e, "productSizes")}
                                value={productSizes} 
                                disabled={setTagVisibility()}
                            />
                        </label>
                    </div>
                </div>
                {/* <button className={styles.order_button} onClick={(e) => updateProductInfo(e)}>
                    {isLoading ? (
                        <Loading width="20px" height="20px" />
                    ) : (
                        <>
                            <span>Submit</span>
                        </>
                    )}
                </button> */}
            </div>
            
        </main>
    );
};

export default AdminProductInfo;

