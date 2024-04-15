///This is the api route for order id

///Libraries -->
import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/config/mongodb";
import { Order } from "@/models/order";
import { IResponse } from "@/config/interfaces";

///Commecing code
//Patching details in a product
// export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {

//     try {
//         const { id } = params;
//         const product: IProduct = await request.json();
//         await connectMongoDB();
//         const product_ = await Product.updateProduct(id, product)
//         return NextResponse.json({ message: "Product Edited Successful", product_ }, { status: 200 });

//     } catch (error: any) {
//         console.log("Error: ", error)
//         return NextResponse.json({ message: error.message }, { status: 400 });
//     }
    
// }

//Get details of an order
export async function GET(request: NextRequest, response: IResponse) {
    const id: string = response.params?.id as unknown as string;
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

///Delete an acocunt
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    //console.log("ID: ", id)

    try {
        await connectMongoDB();
        //await Order.deleteOrder(id)
        return NextResponse.json({ message: "Product deleted" }, { status: 200 });
    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}

//export default GET