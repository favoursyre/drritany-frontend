///This is the api route for handling CRUD on google sheet files

///Libraries -->
//import connectMongoDB from "@/config/mongodb";
//import { Product } from "@/models/product";
import { NextResponse, NextRequest } from "next/server";
//import { sendSubnewsletterEmail } from "@/config/email";
import { IImage, ISheetInfo } from "@/config/interfaces";
import path from "path";
import { google } from "googleapis";
import fs from "fs"
import { GoogleSheetStore } from "@/config/serverUtils";
import { domainName } from "@/config/utils";
//import { IInquiry } from "@/config/interfaces";

///Commencing the code


///Creating a product
export async function POST(request: NextRequest) {
    try {
        if (domainName.includes("localhost")) {
            console.log("You're in development mode")
            return NextResponse.json({ message: "You're in development mode" }, { status: 200 });
        }

        const queryData: ISheetInfo = await request.json();
        //console.log("in...")

        ///Sending confirmation email to the person

        const google = await GoogleSheetStore(queryData.sheetId)
        const sheet = await google.addSheet(queryData.sheetRange, queryData.data)
        //console.log("Sheet Query: ", sheet)

        return NextResponse.json({ sheet, message: "Sheet Added Successful" }, { status: 200 });
    } catch (error: any) {
        console.log("Error news: ", error)
        return NextResponse.json({ message: error?.message }, { status: 400 });
    } 
}