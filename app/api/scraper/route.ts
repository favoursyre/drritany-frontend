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
import { formatAliexpressImageUrl, backend, getGDriveDirectLink, isImage, extractNum, categories, downloadImageURL, deleteFile, getRating, extractJsonFromMarkdown, getRandomNumber } from "@/config/utils";
import { processImage, uploadImageToDrive, uploadWithRetry } from '@/config/serverUtils';
import { drive } from 'googleapis/build/src/apis/drive';

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
        description: $('.detail-desc-decorate-richtext').first().text().trim(),
        origin: 'China (Mainland)',
        specifications: {},
        // Extract shipping
        // const shipping = {
        //     cost: cleanText($('.dynamic-shipping-titleLayout strong').first().text()) || 'N/A',
        //     to: cleanText($('.delivery-v2--to--Mtweg7y').text()) || 'N/A',
        //     from: cleanText($('.dynamic-shipping span:contains("Ships from")').next().text()) || 'N/A',
        //     delivery: cleanText($('.dynamic-shipping-contentLayout strong').text()) || 'N/A',
        // };
        reviews: {
            rating: $('.reviewer--wrap--vGS7G6P img').attr('src'),
            soldCount: $('.reviewer--sold--ytPeoEy').first().text().trim()
        }
    };

    // Extract image URLs
    $('.slider--item--RpyeewA img').each((i, el) => {
        const src = $(el).attr('src');
        console.log("Image src: ", i, src)
        if (src) { // Ensures src exists before pushing
            productInfo.images.push(formatAliexpressImageUrl(src));
        }
    });

    return productInfo;
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
        console.log("Info Server: ", info)
        const filePaths: Array<string | undefined> = [...info.videos!]

        // // Loop through each URL
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

        console.log("File Paths: ", filePaths)

        /// I stopped getting the images from aliexpress because vercel shows a 504 and localhost can't connect to google drive for some reasons I know not
        // //Next we need to process the images
        // const driveImages: Array<IImage> = []
        // for (const path of filePaths) {
        //     if (path) {
        //         try {
        //             const _img = await processImage(path)
        //             console.log("Process Image: ", _img)
        //             //return
        //             driveImages.push(_img)
        //         } catch (error) {
        //             console.log("Processing Error: ", error)
        //         }
        //     }
        // }

        // //Next we delete all the downloaded images
        // for (const path of filePaths) {
        //     if (path) {
        //         await deleteFile(path)
        //     }
        // }

        //Uploading images to google drive
        

        //<------------------------------------------------------->
        // Process images directly without downloading
        // const driveImages: Array<IImage> = []
        // for (const url of info.images) {
        //     console.log("Image URL: ", url)
        //     try {
        //         const image = await uploadImageToDrive(url, "image");
        //         driveImages.push(image);
        //         console.log(`Successfully uploaded: ${url}`);
        //     } catch (error) {
        //         console.error(`Failed to upload ${url}:`, error);
        //     }
        // }


        // // Process videos (if needed)
        // const driveVideos: IImage[] = [];
        // for (const url of info.videos) {
        //     console.log("Video URL: ", url)
        //     try {
        //         if (url) {
        //             const video = await uploadImageToDrive(url, "video");
        //             driveVideos.push(video);
        //         }
        //     } catch (error) {
        //         console.error(`Failed to upload video ${url}:`, error);
        //     }
        // }
        //<------------------------------------------------------->

        // Parallel upload with timeout and retries
        // const driveImages = await Promise.all(
        //     info.images.map(url => uploadWithRetry(url))
        // );

        //Next is to use AI to brush up the product info
        const aiPrompt = `
Given the product name "${info.name}", I need the following product informations for my ecommerce store returned strictly in just json format and arranged using this interface 
"export interface IProduct {
    description: string,
    benefits?: Array<string>,
}"

Note:
- Make a easy-to-understand but well detailed description of the product and assign it to "description" (Don't always start your description with the word "Elevate", "command attention", "step into", "crafted". Try and be more creative and unique, don't add year to the description) 
- State 3 short benefits of the product and assign it to "benefits"
        `
        //Don't always start your description with the word "Elevate", "command attention", "step into", 
        const blueZetsu = await BlueZetsu(aiPrompt);
        
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
        const newOrders = getRandomNumber(327, 753)
        const productStock = getRandomNumber(4, 30)
        const productData: IProduct = {
            addedBy: adminId,
            url: data.url,
            name: info?.name,
            images: [],
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
            stock: productStock,
            rating: getRating(),
            description: _info?.description,
            addDelivery: true,
            orders: newOrders,
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
            timeout: 30000,
        });
        const resProduct = res.data.product;

        console.log("Product Response: ", resProduct)

        //Next is to add the arranged product info to the database
        // const reviewRes = await axios.post(`${backend}/ai-review`, resProduct, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // });

        return NextResponse.json({ 
            success: true, 
            message: resProduct
        }, { 
            status: 200 
        });
        
    } catch (error: any) {
        console.error("Error in scraping:", error);
        if (browser) await browser.close();
        return NextResponse.json({ 
            success: false,
            message: error?.message 
        }, { 
            status: 400 
        });
    } 
}