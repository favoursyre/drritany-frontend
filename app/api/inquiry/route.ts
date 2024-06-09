///This is the api route for inquiry

///Libraries -->
import connectMongoDB from "@/config/mongodb";
import { Inquiry } from "@/models/inquiry";
import { NextResponse, NextRequest } from "next/server";
import { IInquiry } from "@/config/interfaces";
import { sendInquiryEmail } from "@/config/email";

///Commencing the code
///Creating an inquiry
export async function POST(request: NextRequest) {
    try {
        const inquiry: IInquiry = await request.json();
        await connectMongoDB();
        await Inquiry.createInquiry( inquiry );

        //Sending confirmation letter to the customerinquiry
        const status = await sendInquiryEmail(inquiry)
        //console.log('Email Status: ', status)

        return NextResponse.json({ message: "Inquiry submitted" }, { status: 200 });
    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    
}

///Getting all inquiries
export async function GET() {
    try {
        await connectMongoDB();
        const inquiries = await Inquiry.getAllInquiries();
        return NextResponse.json( inquiries , { status: 200 });
    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    
}