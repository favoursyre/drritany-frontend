///This is the api route for orders

///Libraries -->
import connectMongoDB from "@/config/mongodb";
import { Order } from "@/models/order";
import { NextResponse, NextRequest } from "next/server";
//import { sendSubnewsletterEmail } from "@/config/email";
import { ICartItem, IOrder, IOrderSheet, IProduct } from "@/config/interfaces";
import { GoogleSheetDB, orderSheetId, getCurrentTime, getCurrentDate, nairaRate } from "@/config/utils";
//import { IInquiry } from "@/config/interfaces";

///Commencing the code
///Creating a product
export async function POST(request: NextRequest) {
    try {
        const { customerSpec, productSpec } = await request.json();

        ///Adding the order to the database
        await connectMongoDB();
        console.log("Subscriber: ", customerSpec, productSpec)
        const order: IOrder = await Order.processOrder(customerSpec, productSpec)

        //Adding the order to Google sheet
        const { customerSpec: customer, productSpec: cart } = order

        const orderData: Array<IOrderSheet> = []
        for (let i = 0; i < cart.cart.length; i++) {
            const cart_: ICartItem = cart.cart[i]
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
                Quantity: cart_.quantity.toString(),
                UnitPrice: (cart_.unitPrice * nairaRate).toString(),
                TotalPrice: (cart_.subTotalPrice * nairaRate).toString(),
                DateOrdered: getCurrentDate(), ///Convert the mongodb to date and time format and assign it respectively
                TimeOrdered: getCurrentTime()
            })
        }
        const orderSheet = new GoogleSheetDB(orderSheetId)

        //Remember to effect and input the correct sheet index based on the nationality of the client e.g. NG = 0
        const addOrder = await orderSheet.addRow(0, orderData)
        console.log("Successfully logged to database")

        ///Sending confirmation email to the person
        //const status = await sendSubnewsletterEmail(newsletter?.subscriber)
        //console.log('Email: ', await status)

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