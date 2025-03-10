///This is the api route for handling CRUD on google sheet files

///Libraries -->
//import connectMongoDB from "@/config/mongodb";
//import { Product } from "@/models/product";
import { NextResponse, NextRequest } from "next/server";
//import { sendSubnewsletterEmail } from "@/config/email";
import { IImage, ISheetInfo, MarketPlatforms } from "@/config/interfaces";
import path from "path";
import { google } from "googleapis";
import fs from "fs"
import { GoogleSheetStore } from "@/config/serverUtils";
//import { querySheetId } from "@/config/utils";
//import { IInquiry } from "@/config/interfaces";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio"
// import scrape from 'aliexpress-product-scraper-ts';
// import { Options, filterReviewsBy } from "aliexpress-product-scraper-ts";

//   const options: Options = {
//     reviewsCount: 20,
//     filterReviewsBy: filterReviewsBy.FiveStar,
//     puppeteerOptions: {
//       headless: "new",
//     },
//   };

///Commencing the code
//This function launches a new puppeteer browser
async function launchPuppeteer () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    return { browser, page }
}

///Creating a product
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        console.log("Platform Data: ", data)

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(data.url, {
            waitUntil: 'domcontentloaded', // 'load' waits for full load including images, scripts, etc.
            timeout: 1000000,
        });
        //const url = data.url
        //const aliExpressData = await page.evaluate(() => runParams);

        //const data = aliExpressData?.data;
        const html = await page.content();
        //console.log("HTML Content: ", html)

        const $ = cheerio.load(html)
        const test = $('.price--current--I3Zeidd product-price-current span')
        console.log("testing: ", test.text())
        
        // Wait for product elements to ensure they're loaded
        //await page.waitForSelector('.jb_jp', { timeout: 1000000 });

        // scrape('1005005167379524', options).then(res => {
        //     console.log('Product JSON: ', res);
        // });

        const products = await page.evaluate(() => {
            const productElements = document.querySelectorAll('.jb_jp');
            // return Array.from(bookElements).map((book) => {
            //   const title = book.querySelector('h3 a').getAttribute('title');
            //   const price = book.querySelector('.price_color').textContent;
            //   const stock = book.querySelector('.instock.availability')
            //     ? 'In Stock'
            //     : 'Out Of Stock';
            //   const rating = book
            //     .querySelector('.star-rating')
            //     .className.split(' ')[1];
            //   const link = book.querySelector('h3 a').getAttribute('href');
      
            //   return {
            //     title,
            //     price,
            //     stock,
            //     rating,
            //     link,
            // };
            return productElements
        });

        if (data.name === MarketPlatforms.ALIEXPRESS) {
            //console.log("testing amazon")

        }

        //const products: Array<any> = [];
    
        // const title = $('#productTitle').text();
        // const description = $('#productDescription').text()

        // const data = {
        //     title, description
        // }
        await browser.close();
        console.log("Products: ", products);

        return NextResponse.json("Test", { status: 200 });
    } catch (error: any) {
        console.log("Error news: ", error.message)
        return NextResponse.json({ message: error?.message }, { status: 400 });
    } 
}