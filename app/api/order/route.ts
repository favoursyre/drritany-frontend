///This is the api route for orders

///Libraries -->
import connectMongoDB from "@/config/mongodb";
import { Order } from "@/models/order";
import { Product } from "@/models/product";
import { NextResponse, NextRequest } from "next/server";
import { sendOrderEmail } from "@/config/email";
import { ICartItem, IClientInfo, IOrder, IOrderSheet, IProduct, PaymentOption } from "@/config/interfaces";
import { orderSheetId, getCurrentTime, getCurrentDate, round, domainName } from "@/config/utils";
import { GoogleSheetStore } from "@/config/serverUtils";

///Commencing the code
//This function returns the correct number of quantities
function getValidQuantity(product: ICartItem): string {
    // if (product.freeOption) {
    //     let quantity
    //     if (product.quantity >= 10) {
    //         quantity = product.quantity + 2
    //         return quantity.toString()
    //     } else if (product.quantity >= 5) {
    //         quantity = product.quantity + 1
    //         return quantity.toString()
    //     } else {
    //         return product.quantity.toString()
    //     }
    // } else {
    //     return product.quantity.toString()
    // }
    return product.quantity.toString()
}

///Creating a product
export async function POST(request: NextRequest) {
    try {
        const paymentOption = request.nextUrl.searchParams.get("paymentOption") as unknown as PaymentOption | null;
        const data = await request.json();

        ///Adding the order to the database
        const { order, clientInfo_ } = data
        await connectMongoDB();
        console.log("Subscriber_: ", data)
        const order_: IOrder = await Order.processOrder(order, paymentOption!)

        //Adding the order to Google sheet
        const { customerSpec: customer, productSpec: cart } = order_
        const client: IClientInfo = clientInfo_ as unknown as IClientInfo
        const currencySymbol = client.countryInfo?.currency?.symbol
        console.log('Clientinfo: ', clientInfo_)

        const items = order_.productSpec.cart
        console.log("items: ", items)

        for (let item of items) {
            console.log("items main: ", item)
            const _id = item._id
            const product_ = await Product.getProductById(_id)
            console.log("Products: ", product_)
            const oldOrders = product_[0].orders
            console.log("Old Orders: ", oldOrders, item.quantity)
            const newOrders = oldOrders! + item.quantity
            console.log("New Orders: ", newOrders)
            console.log("Product: ", product_[0])
            const p = product_[0]
            //const _p = p.toObject()
            const updatedProduct = {
                ...p, orders: newOrders
            }
            
            //Updating the orders value of the product
            console.log("Updated products: ", updatedProduct)
            const newProduct = await Product.updateProduct(_id, updatedProduct)
            console.log("New product: ", newProduct)
        }

        const orderData: Array<IOrderSheet> = []
        if (client.countryInfo?.currency?.exchangeRate && client.countryInfo?.currency?.symbol) {
            const overallTotal = round(order.productSpec.overallTotalPrice! * order.paymentSpec.exchangeRate, 2).toLocaleString("en-US")
            for (let i = 0; i < cart.cart.length; i++) {
                const cart_: ICartItem = cart.cart[i]
                const unitPrice = Number((cart_.unitPrice * client?.countryInfo?.currency?.exchangeRate).toFixed(2)).toLocaleString("en-US")
                const totalPrice = Number(((cart_.subTotalPrice - cart_.subTotalDiscount) * client?.countryInfo?.currency?.exchangeRate).toFixed(2)).toLocaleString("en-US")
                const deliveryFee = Number((cart.deliveryFee * client?.countryInfo?.currency?.exchangeRate).toFixed(2)).toLocaleString("en-US")
                
                orderData.push({
                    UserId: customer.userId,
                    OrderId: order_._id,
                    CartId: cart_._id,
                    FullName: customer.fullName,
                    EmailAddress: customer.email,
                    PhoneNo1: customer.phoneNumbers[0],
                    PhoneNo2: customer.phoneNumbers[1],
                    Country: customer.country,
                    State: customer.state,
                    DeliveryAddress: customer.deliveryAddress,
                    PostalCode: customer.postalCode,
                    ProductName: cart_.name,
                    Quantity: getValidQuantity(cart_),
                    UnitPrice: `${currencySymbol}${unitPrice}`,
                    TotalPrice: `${currencySymbol}${totalPrice}`,
                    DeliveryFee: `${currencySymbol}${deliveryFee}`, 
                    OverallTotalPrice: `${currencySymbol}${overallTotal}`,
                    DateOrdered: getCurrentDate(), ///Convert the mongodb to date and time format and assign it respectively
                    TimeOrdered: getCurrentTime(),
                    PaymentStatus: order_.paymentSpec.status,
                    DeliveryStatus: order_.deliverySpec.status,
                })
            }
        }
       
        //Adding the orders to the sheet
        if (domainName.includes("localhost")) {
            console.log("You're in development mode")
            //return NextResponse.json({ message: "You're in development mode" }, { status: 200 });
        } else {
            for (let order of orderData) {
                const google = await GoogleSheetStore(orderSheetId)
                const sheetRange = `Order_Sheet_Global!A:S`
                const sheet = await google.addSheet(sheetRange, order)
                console.log("Sheet status: ", sheet)
            }
        }
        

        ///Sending confirmation email to the person
        const status = await sendOrderEmail(order_)
        console.log('Email: ', await status)

        return NextResponse.json( order_ , { status: 200 });
    } catch (error: any) {
        console.log("Error news: ", error.message)
        if (error.code === 11000) {
            console.log("duplicate error")
            return NextResponse.json({ message: "order duplicate error" }, { status: 400 });
        }
        
        return NextResponse.json({ message: error?.message }, { status: 400 });
    }
    
}

///Getting all products
export async function GET(request: NextRequest) {
    const userId = await request.nextUrl.searchParams.get("userId");

    try {
        await connectMongoDB();
        let orders
        console.log("getting orders: ", userId)
        if (userId) {
            orders = await Order.getOrderByAccountId(userId)
        } else {
            orders = await Order.getOrders()
        }

        //console.log("Sub: ", orders)
        return NextResponse.json( orders , { status: 200 });
    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error?.message }, { status: 400 });
    }    
}