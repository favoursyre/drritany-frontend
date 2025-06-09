///This is the api route for editing product reviews

///Libraries -->
import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/config/mongodb";
import { ProductReview } from "@/models/productReview";
import { IProductReview, Props } from "@/config/interfaces";

///Commecing code
//Patching details in a product review
export async function PATCH(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const review_: IProductReview = await request.json();
        await connectMongoDB();
        //console.log("Product Data: ", product_.pricing?.variantPrices)
        //return

        const productReview = await ProductReview.updateProductReview(id, review_)
        return NextResponse.json({ message: "Product Review Edited Successful", productReview }, { status: 200 });

    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    
}

//Get details of an account
export async function GET(request: NextRequest, { params }: Props) {
    const { id } = await params;
    console.log("ID in server: ", id)
    const src = request.nextUrl.searchParams.get("src");
    //console.log("action: ", action)

    try {
        await connectMongoDB();
        let review_
        
        if (src === "productId") {
            review_ = await ProductReview.getProductReviewByProductId(id)
        } else {
            review_ = await ProductReview.getProductReviewById(id)
        }

        console.log("Product get: ", review_)
        return NextResponse.json(review_, { status: 200 });
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
        await ProductReview.deleteProductReview(id)
        return NextResponse.json({ message: "Product Review deleted" }, { status: 200 });
    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}