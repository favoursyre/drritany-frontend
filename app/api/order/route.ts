///This is the api route for orders

///Libraries -->
import connectMongoDB from "@/config/mongodb";
import { Order } from "@/models/order";
import { NextResponse, NextRequest } from "next/server";
import { sendOrderEmail } from "@/config/email";
import { ICartItem, IClientInfo, IOrder, IOrderSheet } from "@/config/interfaces";
import { GoogleSheetDB, orderSheetId, getCurrentTime, getCurrentDate } from "@/config/utils";

///Commencing the code
//This function returns the correct number of quantities
function getValidQuantity(product: ICartItem): string {
    if (product.freeOption) {
        let quantity
        if (product.quantity >= 10) {
            quantity = product.quantity + 2
            return quantity.toString()
        } else if (product.quantity >= 5) {
            quantity = product.quantity + 1
            return quantity.toString()
        } else {
            return product.quantity.toString()
        }
    } else {
        return product.quantity.toString()
    }
}

///Creating a product
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        ///Adding the order to the database
        const { customerSpec, productSpec, clientInfo_ } = data
        await connectMongoDB();
        console.log("Subscriber_: ", data)
        const order: IOrder = await Order.processOrder(customerSpec, productSpec)

        //Adding the order to Google sheet
        const { customerSpec: customer, productSpec: cart } = order
        const client: IClientInfo = clientInfo_ as unknown as IClientInfo
        const currencySymbol = client.country?.currency?.symbol
        console.log('Clientinfo: ', clientInfo_)

        const orderData: Array<IOrderSheet> = []
        if (client.country?.currency?.exchangeRate && client.country?.currency?.symbol) {
            for (let i = 0; i < cart.cart.length; i++) {
                const cart_: ICartItem = cart.cart[i]
                const unitPrice = Number((cart_.unitPrice * client?.country?.currency?.exchangeRate).toFixed(2)).toLocaleString("en-US")
                const totalPrice = Number(((cart_.subTotalPrice - cart_.subTotalDiscount) * client?.country?.currency?.exchangeRate).toFixed(2)).toLocaleString("en-US")
                const deliveryFee = Number((cart.deliveryFee * client?.country?.currency?.exchangeRate).toFixed(2)).toLocaleString("en-US")
                const overallTotal = Number(((cart_.subTotalPrice - cart_.subTotalDiscount + cart.deliveryFee) * client?.country?.currency?.exchangeRate).toFixed(2)).toLocaleString("en-US")
                orderData.push({
                    OrderId: order._id,
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
                    TimeOrdered: getCurrentTime()
                })
            }
        }
       
        const orderSheet = new GoogleSheetDB(orderSheetId)

        //Remember to effect and input the correct sheet index based on the nationality of the client e.g. NG = 0
        const addOrder = await orderSheet.addRow(0, orderData)
        console.log("Successfully logged to database")

        ///Sending confirmation email to the person
        const status = await sendOrderEmail(order)
        console.log('Email: ', await status)

        return NextResponse.json({ message: "Order Sent Successfully" }, { status: 200 });
    } catch (error: any) {
        console.log("Error news: ", error.message)
        return NextResponse.json({ message: error?.message }, { status: 400 });
    }
    
}

///Getting all products
export async function GET() {

    try {
        await connectMongoDB();
        //console.log("getting")
        const orders = await Order.getOrders();
        console.log("Sub: ", orders)
        return NextResponse.json( orders , { status: 200 });
    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error?.message }, { status: 400 });
    }    
}