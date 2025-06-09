///This is the api route for product reviews

///Libraries -->
import connectMongoDB from "@/config/mongodb";
import { ProductReview } from "@/models/productReview";
import { NextResponse, NextRequest } from "next/server";
import { IProductReview } from "@/config/interfaces";
import OpenAI from "openai";
import { orderSheetId } from "@/config/utils";
import { GoogleSheetStore } from "@/config/serverUtils";

///Commencing the code
//Declaring my AI api
async function BlueZetsu(prompt: string) {
    //Validating the presence of an api key
    if(process.env.DEEPSEEK_API_KEY === undefined) {
        throw new Error("Deepseek api key not detected")
    }

    const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY, // Replace with your key
    });

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant who understands ecommerce." },
        { role: "user", content: `${prompt}` }
      ],
      model: "deepseek-reasoner", // Model name (confirm in DeepSeek docs)
      // temperature: 0.5, // Less randomness
      // max_tokens: 150, // Limit response length
      // top_p: 0.9, // Focus on high-probability tokens
      // frequency_penalty: 0.5, // Reduce repetition
    });
  
    console.log("AI Content: ", completion.choices[0].message.content);
    return completion
}

///Creating a product review
export async function POST(request: NextRequest) {
    try {
        //const src = request.nextUrl.searchParams.get("src");
        const review_: IProductReview = await request.json();
        await connectMongoDB();
        const productReview = await ProductReview.createProductReview(review_)
        //console.log("Product: ", product)

        ///Sending confirmation email to the person
        //const status = await sendSubnewsletterEmail(newsletter?.subscriber)
        //console.log('Email: ', await status)

        return NextResponse.json({ productReview, message: "Product Review Added Successful" }, { status: 200 });
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
        const productReviews = await ProductReview.getAllProductReviews();
        
        //console.log("Sub: ", products)
        return NextResponse.json( productReviews , { status: 200 });
    } catch (error: any) {
        console.log("Error test: ", error)
        return NextResponse.json({ message: error?.message }, { status: 400 });
    }    
}