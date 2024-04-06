///This is the api route for newsletter

///Libraries -->
import connectMongoDB from "@/config/mongodb";
import { News } from "@/models/newsletter";
import { NextResponse, NextRequest } from "next/server";
//import { sendSubnewsletterEmail } from "@/config/email";
import { INews } from "@/config/interfaces";
//import { IInquiry } from "@/config/interfaces";

///Commencing the code
///Creating a newsletter
export async function POST(request: NextRequest) {
    try {
        const newsletter: INews = await request.json();
        await connectMongoDB();
        await News.createSubscriber( newsletter );
        console.log("Subscriber: ", newsletter)

        ///Sending confirmation email to the person
        //const status = await sendSubnewsletterEmail(newsletter?.subscriber)
        //console.log('Email: ', await status)

        return NextResponse.json({ message: "Newsletter Subscription Successful" }, { status: 200 });
    } catch (error: any) {
        console.log("Error news: ", error.message)
        return NextResponse.json({ message: error?.message }, { status: 400 });
    }
    
}

///Getting all newsletters
export async function GET() {
    try {
        await connectMongoDB();
        //console.log("getting")
        const subscribers = await News.getAllSubscriber();
        console.log("Sub: ", subscribers)
        return NextResponse.json( subscribers , { status: 200 });
    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error?.message }, { status: 400 });
    }    
}