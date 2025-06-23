///This is the api route for order id

///Libraries -->
import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/config/mongodb";
import { Order } from "@/models/order";
import { IResponse, IOrder, Props } from "@/config/interfaces";
import { sendDeliveryStatusEmail, sendPaymentStatusEmail } from "@/config/email";

///Commecing code
//Patching details in a order
export async function PATCH(request: NextRequest, { params }: Props) {

    try {
        const event = request.nextUrl.searchParams.get("event");
        const { id } = await params;
        const order: IOrder = await request.json();
        //console.log("Updated Order 1: ", order)
        await connectMongoDB();
        const order_ = await Order.updateOrder(id, order)
        //console.log("Upated Order 2: ", order_)

        //Sending email to the user about the updated delivery status
        if (event === "delivery") {
            const status = await sendDeliveryStatusEmail(order) 
            console.log('Email: ', await status)
        } else if (event === "payment") {
            const status = await sendPaymentStatusEmail(order) 
            console.log('Email: ', await status)
        }

        return NextResponse.json({ message: "Order Edited Successful", order_ }, { status: 200 });

    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    
}

//Get details of an order
export async function GET(request: NextRequest, { params }: Props) {
    const { id } = await params;
    //const action = request.nextUrl.searchParams.get("action");
    console.log("id: ", id)
    //const id = "661b8d1edaefd8de4812c8b1"
    

    try {
        //const { id } = params;
        await connectMongoDB();
        const order = await Order.getOrderById(id)
        console.log("order: ", order)
        //const order_ = JSON.parse(JSON.stringify(order[0]))
        //console.log('STring: ', order_)

        return NextResponse.json(order, { status: 200 });
    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}

///Delete an account
export async function DELETE(request: NextRequest, { params }: Props) {
    const { id } = await params;
    //console.log("ID: ", id)

    try {
        await connectMongoDB();
        await Order.deleteOrder(id)
        return NextResponse.json({ message: "Order deleted" }, { status: 200 });
    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}

//export default GET