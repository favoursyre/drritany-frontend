///This is the api route for order id

///Libraries -->
import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/config/mongodb";
import { Order } from "@/models/order";
import { IResponse, IOrder, Props } from "@/config/interfaces";

///Commecing code
//Patching details in a order
export async function PATCH(request: NextRequest, { params }: Props) {

    try {
        const { id } = await params;
        const order: IOrder = await request.json();
        await connectMongoDB();
        const product_ = await Order.updateOrder(id, order)
        return NextResponse.json({ message: "Order Edited Successful", product_ }, { status: 200 });

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