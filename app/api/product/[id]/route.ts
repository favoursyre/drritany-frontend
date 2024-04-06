///This is the api route for editing products

///Libraries -->
import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/config/mongodb";
import { Product } from "@/models/product";
import { IProduct } from "@/config/interfaces";

///Commecing code
//Patching details in a product
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {

    try {
        const { id } = params;
        const product: IProduct = await request.json();
        await connectMongoDB();
        const product_ = await Product.updateProduct(id, product)
        return NextResponse.json({ message: "Product Edited Successful", product_ }, { status: 200 });

    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    
}

//Get details of an account
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    //const action = request.nextUrl.searchParams.get("action");
    //console.log("action: ", action)

    try {
        await connectMongoDB();
        const product = await Product.getProductById(id)

        return NextResponse.json(product, { status: 200 });
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
        await Product.deleteProduct(id)
        return NextResponse.json({ message: "Product deleted" }, { status: 200 });
    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}