///This is the api route for handling CRUD on google drive files

///Libraries -->
//import connectMongoDB from "@/config/mongodb";
//import { Product } from "@/models/product";
import { NextResponse, NextRequest } from "next/server";
//import { sendSubnewsletterEmail } from "@/config/email";
import { IImage } from "@/config/interfaces";
import path from "path";
import { google } from "googleapis";
import fs from "fs"
import { GoogleDriveStore } from "@/config/serverUtils";
import { mediaFolderId } from "@/config/utils";
//import { IInquiry } from "@/config/interfaces";

///Commencing the code

///Creating a product
export async function POST(request: NextRequest) {
    try {
        const res = await request.formData();
        console.log("in...")

        const file = res.get("file") as File;
        console.log("File: ", file)

        ///Sending confirmation email to the person
        const google = await GoogleDriveStore()
        const drive = await google.addFile(file, mediaFolderId)
        console.log('Drive: ', drive)

        return NextResponse.json({ drive, message: "File Added Successful" }, { status: 200 });
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
       //
    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error?.message }, { status: 400 });
    }    
}

///Delete an image
export async function DELETE(request: NextRequest) {
    const id = await request.nextUrl.searchParams.get("id");
    //console.log("ID: ", id)

    try {
        const google = await GoogleDriveStore()
        const g = await google.deleteFile(id!)
        console.log("stat: ", g)
        //await Inquiry.deleteInquiry(id)

        return NextResponse.json({ message: "File deleted" }, { status: 200 });
    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}