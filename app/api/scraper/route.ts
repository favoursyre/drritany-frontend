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
//import { querySheetId } from "@/config/utils";
//import { IInquiry } from "@/config/interfaces";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio"

///Commencing the code

///Creating a product
export async function GET(request: NextRequest) {
    try {
        //const queryData: ISheetInfo = await request.json();
        const PAGE_URL = 'https://www.amazon.com/BLACK-DECKER-Countertop-10-Speed-BL2010BG/dp/B00OW16ZR0/ref=sr_1_1_sspa?crid=2E78AZXBU9Q5O&dib=eyJ2IjoiMSJ9.vTb8trXD-JkhdWgRXtvlu7345bA7HDCmvcpaNLV7fSRidHsmAL3miX98019Jk3oPdpLBfYXH3lwKwig3vdXYvMcwak1Ljvp9qFgCs5La4iUr-5umZzFZuF5rEr8WFKXFqNeGQpbNkw2YsgghVS0sl9N-aZkzqelY1uLOik3_E9mw8RBFJBU-sWBJflLVe6y9IGMrVnLCVX3zOhz8yEcaBPkuwcCRQH8vWHVWdKRPFgw.f2NPru1THY0fpyUxVAlhL1kiVl46EzJPtQMKEeSAr4k&dib_tag=se&keywords=blender&qid=1725661421&sprefix=bl%2Caps%2C2351&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1';
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        await page.goto(PAGE_URL);
        console.log("testing amazon")
        const html = await page.content();
        //console.log("HTML: ", html)
        await browser.close();

        const $ = cheerio.load(html);
        //console.log("Cheerio: ", $)
        const products: Array<any> = [];
    
        const title = $('#productTitle').text();
        const description = $('#productDescription').text()

        const data = {
            title, description
        }
    
        //console.log(sortedProducts);

        return NextResponse.json(description, { status: 200 });
    } catch (error: any) {
        console.log("Error news: ", error.message)
        return NextResponse.json({ message: error?.message }, { status: 400 });
    } 
}