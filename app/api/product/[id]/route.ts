///This is the api route for editing products

///Libraries -->
import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/config/mongodb";
import { Product } from "@/models/product";
import { IProduct, Props } from "@/config/interfaces";

///Commecing code
//Patching details in a product
export async function PATCH(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const product_: IProduct = await request.json();
        await connectMongoDB();
        //console.log("Product Data: ", product_.pricing?.variantPrices)
        //return

        const product = await Product.updateProduct(id, product_)
        return NextResponse.json({ message: "Product Edited Successful", product }, { status: 200 });

    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    
}

//Get details of an account
export async function GET(request: NextRequest, { params }: Props) {
    const { id } = await params;
    console.log("ID in server: ", id)
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
export async function DELETE(request: NextRequest, { params }: Props) {
    const { id } = await params;
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