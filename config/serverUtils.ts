"use server"
///This contains utility functions that are strictly for server based components

///Libraries -->
import { google } from "googleapis";
import { Readable } from "stream";
import fs from "fs"
import sharp from "sharp"
import FormData from "form-data";
import axios from "axios";
import { IImage } from "./interfaces";
import { drive_v3 } from "googleapis";
import { convertToNodeReadableStream, getGDriveDirectLink, isImage, backend, isVideo, getGDrivePreviewLink } from "./utils";

///Commencing the code
//Declaring the neccesary variables
const data = {
    type: process.env.NEXT_PUBLIC_TYPE!,
    project_id: process.env.NEXT_PUBLIC_PROJECT_ID!,
    private_key_id: process.env.NEXT_PUBLIC_PRIVATE_KEY_ID!,
    private_key: process.env.NEXT_PUBLIC_PRIVATE_KEY!.replace(/\\n/g, '\n'),//process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    //private_key: JSON.parse(process.env.NEXT_PUBLIC_PRIVATE_KEY!),
    client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL!,
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
    auth_uri: process.env.NEXT_PUBLIC_AUTH_URI!,
    token_uri: process.env.NEXT_PUBLIC_TOKEN_URI!,
    auth_provider_x509_cert_url: process.env.NEXT_PUBLIC_AUTH_PROVIDER_X509_CERT_URL!,
    client_x509_cert_url: process.env.NEXT_PUBLIC_CLIENT_X509_CERT_URL!,
    universe_domain: process.env.NEXT_PUBLIC_UNIVERSE_DOMAIN!,
}
//console.log("Google Credentials: ", GoogleCredentials)

// export const convertFileToBuffer = async (file: File): Promise<Buffer> => {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//             resolve(Buffer.from(reader.result as ArrayBuffer));
//         };
//         reader.onerror = reject;
//         reader.readAsArrayBuffer(file);
//     });
// }

//This function converts web stream to node stream
// export const convertToNodeReadableStream = (webStream: ReadableStream<Uint8Array>): Readable => {
//     const reader = webStream.getReader();
//     const stream = new Readable({
//         async read() {
//             const { done, value } = await reader.read();
//             if (done) {
//                 this.push(null); // No more data
//             } else {
//                 this.push(Buffer.from(value)); // Push data into the Node.js stream
//             }
//         },
//     });
//     return stream;
// }

//This function gets a image file path and uploads it to GDrive
export const processImage = async (filePath: string): Promise<IImage> => {
    try {
        // Verify file exists
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at: ${filePath}`);
        } 
        console.log("File Path: ", filePath)

        //Check if the file is an image
        let fileType
        let metadata
        const fileIsImage = isImage(filePath)
        const fileIsVideo = isVideo(filePath)
        if (fileIsImage) {
            fileType = "image"
            // Get image dimensions using sharp
            metadata = await sharp(filePath).metadata();
            if (!metadata.width || !metadata.height) {
                throw new Error("Could not determine image dimensions");
            }
        } else if (fileIsVideo) {
            fileType = "video"
        } else {
            throw new Error("File format is not valid")
        }
        
        //const fileType = "image"
        const form = new FormData();

        // Create a read stream for the file
        const fileStream = fs.readFileSync(filePath);

        // Append the file to FormData
        form.append('file', fileStream);
        console.log("File Form: ", form)

        //Sending the form data via HTTP request using axios
        const response = await axios.post(`${backend}/file`, form, {
            headers: {
                ...form.getHeaders() // Important: includes multipart/form-data boundary
            }
        });

        const data = response.data.drive as unknown as drive_v3.Schema$File
        const image: IImage = {
            driveId: data.id!,
            src: fileType === "image" ? getGDriveDirectLink(data.id!) : getGDrivePreviewLink(data.id!),
            name: undefined,
            width: fileType === "image" ? metadata?.width : 640,
            height: fileType === "image" ? metadata?.height : 480,
            type: fileType!
        }
        return image
        
    } catch (error) {
        console.error('Error processing image with FormData:', error);
        throw error;
    }
}

///This function allows one to perform CRUD operation using Google Drive
class GoogleDriveCRUD {
    private oauth2client
    private drive

    constructor() {
        this.oauth2client = new google.auth.GoogleAuth({
            credentials: {
                type: data.type,
                project_id: data.project_id,
                private_key_id: data.private_key_id,
                private_key: data.private_key,//process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
                client_email: data.client_email,
                client_id: data.client_id,
                // auth_uri: data.auth_uri,
                // token_uri: data.token_uri,
                // auth_provider_x509_cert_url: data.auth_provider_x509_cert_url,
                // client_x509_cert_url: data.client_x509_cert_url,
                // universe_domain: data.universe_domain,
            },
            scopes: ["https://www.googleapis.com/auth/drive"],
        });
        //this.oauth2client.setCredentials({ refresh_token: refreshToken })
        this.drive = google.drive({
            version: "v3",
            auth: this.oauth2client
        })
    }

    //This function is used to add a file to GDrive
    public async addFile(file: File, folderId: string | void) {
        try {
            const fileBuffer = file.stream();
            const nodeFileStream = convertToNodeReadableStream(fileBuffer)
            //const fileBuffer_ = await convertFileToBuffer(file)
            //const fileBuffer = fs.createReadStream(file.name)
            //console.log("hvv: ", fs.createWriteStream(file.name))
            //const mimeType = mime.getType(file.name);


            const fileMetadata = {
                name: file.name, // The name of the file to be uploaded
                parents: folderId ? [folderId] : undefined, // The ID of the folder where the file should be uploaded
                mimeType: file.type,
            };
        
            const media = {
                mimeType: file.type,//'application/octet-stream',
                //body: Readable.from([fileBuffer_]),
               body: nodeFileStream
            };

            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: "id, imageMediaMetadata",
            })
            
            console.log("GDrive Create File Response 1: ", response)
            //console.log("Response 1: ", response.imageMediaMetadata)
            return response.data
        } catch (error) {
            console.log("Google Drive add file: ", error)
        }
    }

    //This function helps delete a file from GDrive
    public async deleteFile(driveId: string) {
        try {
            const response = await this.drive.files.delete({
                fileId: driveId
            })
            const res = await this.drive.files.get({
                fileId: ""
            })
            console.log(response)
            //console.log("Response: ", response.data)
        } catch (error) {
            console.log(error)
        }
    }
}

///This function allows one to perform CRUD operation using Google Drive
export const GoogleDriveStore = async () => {
    const googleDrive = new GoogleDriveCRUD()

    const addFile = async (file: File, folderId: string | void) => {
        console.log("Google Drive File: ", file)
        return await googleDrive.addFile(file, folderId)
    }

    const deleteFile = async (fileId: string ) => {
        return await googleDrive.deleteFile(fileId)
    }

    return {
        addFile,
        deleteFile
    }
}

///This function allows us to perform CRUD operation using Google Sheet
// class GoogleSheetDB {
//     //private doc: GoogleSpreadsheet
//     public auth: any
//     private sheets: any

//     constructor() {
//         //console.log("Credentials: ", CLIENT_EMAIL, PRIVATE_KEY)
//         // this.auth = new JWT({
//         //     // env var values here are copied from service account credentials generated by google
//         //     // see "Authentication" section in docs for more info
//         //     email: sheetEmail,
//         //     key: sheetKey,
//         //     scopes: [
//         //       'https://www.googleapis.com/auth/spreadsheets',
//         //     ],
//         //   });
//         // this.doc = new GoogleSpreadsheet(sheetId, this.auth)
//     }

//     //This function initializes the neccessary variables
//     public async __init__() {
//         this.auth = await google.auth.getClient({
//             projectId: data.project_id,
//             credentials: {
//               type: data.type,
//               private_key: data.private_key,
//               client_email: data.client_email,
//               client_id: data.client_id,
//               token_url: data.token_uri,
//               universe_domain: data.universe_domain,
//             },
//             scopes: [
//               "https://www.googleapis.com/auth/spreadsheets",
//             ],
//         });
        
//         this.sheets = google.sheets({ version: "v4", auth: this.auth });
//     }

//     ///This function gets a row using the ID property
//     public async getRow(sheetId: string) {
//         // load the documents info
//         // await this.doc.loadInfo();

//         // // Index of the sheet
//         // let sheet = this.doc.sheetsByIndex[sheetIndex];

//         // // Get all the rows
//         // let rows = await sheet.getRows();

//         // for (let index = 0; index < rows.length; index++) {
//         //     const row = rows[index];
//         //     if (row.get("CartId") === cartId) {
//         //         console.log(row);
//         //         return row
//         //     }
//         // };

//         const info = await this.sheets.spreadsheets.values.get({
//             spreadsheetId: sheetId,
//             range: "Sheet1!A:D",
//         });
//         console.log("Sheets: ", data)
//         return info
//     }

//     ///This function deletes a row using the ID property
//     // public async deleteRow(sheetIndex: number, cartId: string) {
//     //     await this.doc.loadInfo();

//     //     // Index of the sheet
//     //     let sheet = this.doc.sheetsByIndex[sheetIndex];
    
//     //     let rows = await sheet.getRows();
    
//     //     for (let index = 0; index < rows.length; index++) {
//     //         const row = rows[index];
//     //         if (row.get("CartId") === cartId) {
//     //             await row.delete();
//     //             break; 
//     //         }
//     //     };
//     // }

//     ///This function adds new row to the sheet
//     public async addRow(sheetId: string, rows: Array<{ [key: string]: any }>) {
//         // console.log("Try: ", sheetKey, await this.doc)
//         // await this.doc.loadInfo();

//         // // Index of the sheet
//         // let sheet = this.doc.sheetsByIndex[sheetIndex];
//         // console.log("Sheet: ", sheet)

//         // for (let index = 0; index < rows.length; index++) {
//         //     const row = rows[index] as unknown as any;
//         //     console.log("Add: ", row)

//         //     await sheet.addRow(row);
//         // }
//         const sheetName = "Sheet1"

//         const info =  await this.sheets.spreadsheets.values.append({
//             spreadsheetId: sheetId,
//             range: `${sheetName}!A:B`,
//             valueInputOption: 'USER_ENTERED',
//             requestBody: {
//               values: [rows]
//             }
//         }, {});

//         console.log("Data: ", info)
//         return info
//     }

//     ///This function updates a row in the sheet using the ID property
//     // public async updateRow(sheetIndex: number, cartId: string, data: IOrderSheet) {
//     //     await this.doc.loadInfo();

//     //     // Index of the sheet
//     //     let sheet = this.doc.sheetsByIndex[sheetIndex];

//     //     let rows = await sheet.getRows();

//     //     for (let index = 0; index < rows.length; index++) {
//     //         const row = rows[index]
//     //         //console.log("Row: ", row.get("CartId"))
//     //         if (row.get("CartId") === cartId) {
//     //             const data_ = Object.entries(data)
//     //             for (let i = 0; i < data_.length; i++) {
//     //                 row.set(data_[i][0], data_[i][1])
//     //                 await row.save();
//     //             }
//     //             break; 
//     //         }
//     //     };
//     // }
// }

///This function allows one to perform CRUD operation using Google Sheet

export const GoogleSheetStore = async (sheetId: string) => {
    //Initializing credentials
    const auth = await google.auth.getClient({
        projectId: data.project_id,
        credentials: {
          type: data.type,
          private_key: data.private_key,
          client_email: data.client_email,
          client_id: data.client_id,
          token_url: data.token_uri,
          universe_domain: data.universe_domain,
        },
        scopes: [
          "https://www.googleapis.com/auth/spreadsheets",
        ],
    });
    
    const sheets = google.sheets({ version: "v4", auth: auth });

    //This function appends new sheet
    const addSheet = async (sheetRange: string, datas: { [key: string]: any }) => {
        //const sheetName = "Sheet1"

        const info =  await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: `${sheetRange}`, //`${sheetName}!A:B`,
            valueInputOption: 'USER_ENTERED',
            //insertDataOption: 'INSERT_ROWS',
            requestBody: {
              values: [
                Object.values(datas)
              ]
            }
        }, {});

        //console.log("Info: ", info)
        return info
    }

    // const deleteFile = async (fileId: string ) => {
    //     return await googleDrive.deleteFile(fileId)
    // }

    return {
        addSheet
    }
}

//This function allows users scrape data from Aliexpress
const scrapeAliexpress = async (url: string) => {

}
