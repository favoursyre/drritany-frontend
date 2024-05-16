///This is the api route for products

///Libraries -->
import connectMongoDB from "@/config/mongodb";
import { Product } from "@/models/product";
import { NextResponse, NextRequest } from "next/server";
//import { sendSubnewsletterEmail } from "@/config/email";
import { IProduct } from "@/config/interfaces";
//import { IInquiry } from "@/config/interfaces";

///Commencing the code
///Creating a product
export async function POST(request: NextRequest) {
    try {
        const product: IProduct = await request.json();
        await connectMongoDB();
        await Product.createProduct(product)
        console.log("Subscriber: ", product)

        ///Sending confirmation email to the person
        //const status = await sendSubnewsletterEmail(newsletter?.subscriber)
        //console.log('Email: ', await status)

        return NextResponse.json({ message: "Product Added Successful" }, { status: 200 });
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
            }
        } else {
            return NextResponse.json({ message: "Wrong action" }, { status: 400 });
        }
        
        //console.log("Sub: ", products)
        return NextResponse.json( products , { status: 200 });
    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error?.message }, { status: 400 });
    }    
}