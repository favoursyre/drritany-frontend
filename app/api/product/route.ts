///This is the api route for products

///Libraries -->
import connectMongoDB from "@/config/mongodb";
import { Product } from "@/models/product";
import { NextResponse, NextRequest } from "next/server";
//import { sendSubnewsletterEmail } from "@/config/email";
import { IProduct } from "@/config/interfaces";
//import { IInquiry } from "@/config/interfaces";
import { orderSheetId } from "@/config/utils";
import { GoogleSheetStore } from "@/config/serverUtils";

///Commencing the code
///Creating a product
export async function POST(request: NextRequest) {
    try {
        const product_: IProduct = await request.json();
        await connectMongoDB();
        const product = await Product.createProduct(product_)
        console.log("Product: ", product)

        ///Sending confirmation email to the person
        //const status = await sendSubnewsletterEmail(newsletter?.subscriber)
        //console.log('Email: ', await status)

        return NextResponse.json({ product, message: "Product Added Successful" }, { status: 200 });
    } catch (error: any) {
        console.log("Error news: ", error.message)
        return NextResponse.json({ message: error?.message }, { status: 400 });
    } 
}

///Getting all products
export async function GET(request: NextRequest) {
    const action = await request.nextUrl.searchParams.get("action");
    const query = await request.nextUrl.searchParams.get("query");
    try {
        await connectMongoDB();
        let products
        //console.log("getting")
        if (action === "order") {
            products = await Product.getProductByOrder();
        } else if (action === "latest") {
            products = await Product.getProductByLatest()
        } else if (action === "price") {
            //products = await Product.getProductByPrice()
        } else if (action === "search") {
            if (query) {
                products = await Product.getProductBySearch(query)
            

                //Logging the queries to excel sheet to serve customers better
                // const queryData: IQuerySheet = {
                //     Country: 
                // }
                // if (client.country?.currency?.exchangeRate && client.country?.currency?.symbol) {
                //     for (let i = 0; i < cart.cart.length; i++) {
                //         const cart_: ICartItem = cart.cart[i]
                //         const unitPrice = Number((cart_.unitPrice * client?.country?.currency?.exchangeRate).toFixed(2)).toLocaleString("en-US")
                //         const totalPrice = Number(((cart_.subTotalPrice - cart_.subTotalDiscount) * client?.country?.currency?.exchangeRate).toFixed(2)).toLocaleString("en-US")
                //         const deliveryFee = Number((cart.deliveryFee * client?.country?.currency?.exchangeRate).toFixed(2)).toLocaleString("en-US")
                //         orderData.push({
                //             OrderId: order._id,
                //             CartId: cart_._id,
                //             FullName: customer.fullName,
                //             EmailAddress: customer.email,
                //             PhoneNo1: customer.phoneNumbers[0],
                //             PhoneNo2: customer.phoneNumbers[1],
                //             Country: customer.country,
                //             State: customer.state,
                //             DeliveryAddress: customer.deliveryAddress,
                //             PostalCode: customer.postalCode,
                //             ProductName: cart_.name,
                //             Quantity: getValidQuantity(cart_),
                //             UnitPrice: `${currencySymbol}${unitPrice}`,
                //             TotalPrice: `${currencySymbol}${totalPrice}`,
                //             DeliveryFee: `${currencySymbol}${deliveryFee}`, 
                //             DateOrdered: getCurrentDate(), ///Convert the mongodb to date and time format and assign it respectively
                //             TimeOrdered: getCurrentTime()
                //         })
                //     }
                // }
            
                // const orderSheet = new GoogleSheetDB(orderSheetId)

                // //Remember to effect and input the correct sheet index based on the nationality of the client e.g. NG = 0
                // const addOrder = await orderSheet.addRow(0, orderData)
                // console.log("Successfully logged to database")
            }
        } else {
            return NextResponse.json({ message: "Wrong action" }, { status: 400 });
        }
        
        //console.log("Sub: ", products)
        return NextResponse.json( products , { status: 200 });
    } catch (error: any) {
        console.log("Error test: ", error)
        return NextResponse.json({ message: error?.message }, { status: 400 });
    }    
}