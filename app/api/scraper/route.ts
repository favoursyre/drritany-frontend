///This is the api route for handling CRUD on google sheet files

///Libraries -->
//import connectMongoDB from "@/config/mongodb";
import axios from 'axios';
import { NextResponse, NextRequest } from "next/server";
//import { sendSubnewsletterEmail } from "@/config/email";
import { IImage, IMarketPlatform, IProduct, ISheetInfo, MarketPlatforms } from "@/config/interfaces";
import { google } from "googleapis";
import OpenAI from "openai";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio"
import { formatAliexpressImageUrl, backend, getGDriveDirectLink, isImage, extractNum, categories, downloadImageURL, deleteFile, getRating } from "@/config/utils";
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

//This extracts product info from aliexpress html page
function extractAliexpressProductInfo($: cheerio.CheerioAPI) {
    
    const productInfo = {
        name: $('h1[data-pl="product-title"]').text().trim(),
        price: $('.price--currentPriceText--V8_y_b5').text().trim(),
        originalPrice: $('.price--originalText--gxVO5_d').text().trim(),
        discount: $('.price--discount--Y9uG2LK').text().trim(),
        videos: [$('source').attr('src')],
        images: [] as Array<string>,
        description: $('.description--origin-part--rWy05pE p').first().text().trim(),
        origin: 'China',
        specifications: {},
        reviews: {
            rating: $('.reviewer--wrap--vGS7G6P img').attr('src'),
            soldCount: $('.reviewer--sold--ytPeoEy').first().text().trim()
        }
    };

    // Extract image URLs
    $('.slider--item--FefNjlj img').each((i, el) => {
        const src = $(el).attr('src');
        if (src) { // Ensures src exists before pushing
            productInfo.images.push(formatAliexpressImageUrl(src));
        }
    });

    return productInfo;
}

function extractJsonFromMarkdown(markdownString: string) {
    // Use a regular expression to extract the JSON content
    const jsonMatch = markdownString.match(/```json\s*([\s\S]*?)\s*```/);

    if (!jsonMatch || !jsonMatch[1]) {
        throw new Error('No valid JSON found in the Markdown string');
    }

    // Parse the extracted JSON string into an object
    return JSON.parse(jsonMatch[1]);
}

///Post request for scrape function
export async function POST(request: NextRequest) {
    let browser: any;
    try {
        const { adminId, platformData} = await request.json();
        const data: IMarketPlatform = platformData
        //console.log("Data: ", data);
        //return

        ///You will need to writing a code that automatically gets the html based on in link

        //Extracting product info from raw html
        const html = data.content
        const $ = cheerio.load(html!);
        let info

        if (data.name === MarketPlatforms.ALIEXPRESS) {
            info = extractAliexpressProductInfo($)
        } else {
            throw Error("Platform is invalid")
        }

        //Saving all the downloaded image file paths
        const filePaths: Array<string | undefined> = [...info.videos!]

        // Loop through each URL
        for (const url of info.images) {
            try {
                //console.log(`Downloading image from: ${iam}`);
                const filePath = await downloadImageURL(url);
                filePaths.push(filePath);
                console.log(`Successfully downloaded to: ${filePath}`);
            } catch (error) {
                console.error(`Failed to download image from ${url}:`, error);
                // Continue with next URL even if one fails
                // If you want to stop on error, you could throw here instead
            }
        }

        //Next we need to process the images
        const driveImages: Array<IImage> = []
        for (const path of filePaths) {
            if (path) {
                try {
                    const _img = await processImage(path)
                    console.log("Process Image: ", _img)
                    //return
                    driveImages.push(_img)
                } catch (error) {
                    console.log("Processing Error: ", error)
                }
            }
        }

        //Next we delete all the downloaded images
        for (const path of filePaths) {
            if (path) {
                await deleteFile(path)
            }
        }

        //Next is to use AI to brush up the product info
        const blueZetsu = await BlueZetsu(`
Given the product name "${info.name}", I need the following product informations for my ecommerce store returned strictly in just json format and arranged using this interface 
"export interface IProduct {
    description: string,
    benefits?: Array<string>,
}"

Note:
- Make a easy-to-understand but well detailed description of the product and assign it to "description"
- State 3 short benefits of the product and assign it to "benefits"
        `);
        
        console.log("Blue Zetsu: ", blueZetsu)
        const _aiInfo = blueZetsu.choices[0].message.content
        let _info: {
            description: string,
            benefits?: Array<string>,
        } | undefined = undefined
        try {
            const parsed = extractJsonFromMarkdown(_aiInfo!);
            _info = parsed as unknown as {
                description: string,
                benefits?: Array<string>,
            }
        } catch (error) {
            console.error('Failed to parse JSON:', error);
        }

        //Next step is to arrange all the infos in product info
        const productData: IProduct = {
            addedBy: adminId,
            url: data.url,
            name: info?.name,
            images: driveImages,
            pricing: {
                basePrice: extractNum(info.price),
                discount: extractNum(info.discount),
                extraDiscount: {
                    limit: 10,
                    percent: 5
                },
                inStock: true
            },
            category: {
                macro: categories[0].macro,
                mini: categories[0].minis[0].mini,
                micro: categories[0].minis[0].micros[0].micro,
                nano: categories[0].minis[0].micros[0].nanos[0]
            },
            rating: getRating(),
            description: _info?.description,
            addDelivery: true,
            orders: 0,
            specification: {
                brand: "Others",
                itemForm: "Undefined",
                itemCount: 1,
                userAgeRange: "Undefined",
                gender: "Unisex",
                benefits: [..._info?.benefits!],
                prescription: ["See package manual"],
                productOrigin: info.origin,
                weight: 0.5,
                sizes: undefined,
                colors: undefined
            },
            active: false,
        }

        //Next is to add the arranged product info to the database
        const res = await axios.post(`${backend}/product`, productData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return NextResponse.json({ 
            success: true, 
            message: res.data.product
        }, { 
            status: 200 
        });
        
    } catch (error: any) {
        console.error("Error in scraping:", error.message);
        if (browser) await browser.close();
        return NextResponse.json({ 
            success: false,
            message: error?.message 
        }, { 
            status: 400 
        });
    } 
}