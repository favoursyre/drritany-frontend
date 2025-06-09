///This is the api route for handling CRUD on google sheet files

///Libraries -->
//import connectMongoDB from "@/config/mongodb";
import axios from 'axios';
import { NextResponse, NextRequest } from "next/server";
//import { sendSubnewsletterEmail } from "@/config/email";
import { IImage, IMarketPlatform, IProduct, ISheetInfo, IProductReview } from "@/config/interfaces";
import { google } from "googleapis";
import OpenAI from "openai";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio"
import { formatAliexpressImageUrl, backend, getGDriveDirectLink, isImage, extractNum, categories, downloadImageURL, deleteFile, getRating, getRandomNumber,extractJsonFromMarkdown, hashValue, getGravatarImg, getRandomItem } from "@/config/utils";
import { processImage } from '@/config/serverUtils';

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

///Post request for ai review function
export async function POST(request: NextRequest) {
    let browser: any;
    try {
        const product = await request.json() as unknown as IProduct;
        console.log("Product: ", product);

        const reviewLength = getRandomNumber(2, 6)
        console.log("Review Length: ", reviewLength);

        const prompt = `
Given the following product information "Product Name: ${product.name}", "Product Description: ${product.description}" & "Product Benefits: ${product.specification?.benefits}", write ${reviewLength} iterations of unique realistic convincing review for my ecommerce store returned strictly in just json format and arranged using this interface 
"export interface Array<{
  productId?: string,
  userId?: string,
  specs?: { 
    color?: string,
    size?: string
  },
  name?: string,
  image?: IImage,
  review?: string,
  rating?: number,
  country?: string,
  createdAt?: Date | string,
}>"

Strictly follow the following instructions;
- Insert null in the productId property
- Insert null in the userId property
- Create a fake realistic name (no abbreviations) and insert it in name property
- Insert null in image property
- Insert the review in the review property, the review must match the product information and be realistic, it should be between 10 - 60 words, use easy-to-understand words and review it like a real person would.
- Insert a random country name, you must not repeat the same country more than twice and should come from various continents, the name should match the country of the user
- For the rating, use only numbers between 4 & 5 but use more of 5 (about 85% of the reviews should be 5)
- Insert a recent date from the range of April 20, 2025 - June 7, 2025, using this format "2025-04-10T08:54:37.228+00:00"
        `;
        console.log("Prompt: ", prompt);

        //Using AI to generate reviews
        const blueZetsu = await BlueZetsu(prompt);
        
        console.log("Blue Zetsu: ", blueZetsu)
        const _aiReview = blueZetsu.choices[0].message.content
        let parsedReviews: Array<IProductReview> = [];
        try {
            parsedReviews = extractJsonFromMarkdown(_aiReview!) as unknown as Array<IProductReview>;
        } catch (error: any) {
            console.error('Failed to parse JSON:', error);
            throw new Error(error || "Failed to parse AI review JSON");
        }
        const _sizes = product.specification?.sizes
        const _colors = product.specification?.colors
        const productSizes = _sizes && _sizes.length >= 1 ? _sizes.map(item => typeof item === "string" ? item : item.size) : undefined;
        const productColors = _colors && _colors.length >= 1 ? _colors.filter(
        (item): item is string => typeof item === "string") : undefined;

        //Next step is to edit the userId and image properties in the reviews
        let productReviews: Array<IProductReview> = [];
        for (const review of parsedReviews) {
            let _userId = `blueZetsu-${hashValue(review.name!, "md5")}`;
            let _image: IImage = getGravatarImg(review.name!);

            const _review: IProductReview = {
                ...review,
                specs: {
                    color: productColors ? getRandomItem(productColors) : undefined,
                    size: productSizes ? getRandomItem(productSizes) : undefined,
                },
                productId: product._id,
                userId: _userId,
                image: _image, //Setting image to null
            }
            productReviews.push(_review);
        }

        //Next is to add the arranged product reviews to the database
        for (const review of productReviews) {
            const res = await axios.post(`${backend}/product-review`, review, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return NextResponse.json({ 
            success: true, 
            message: productReviews
        }, { 
            status: 200 
        });
        
    } catch (error: any) {
        console.error("Error in AI review generation:", error);
        if (browser) await browser.close();
        return NextResponse.json({ 
            success: false,
            message: error?.message 
        }, { 
            status: 400 
        });
    } 
}