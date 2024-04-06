///This is the api route for editng accounts

///Libraries -->
import connectMongoDB from "@/config/mongodb";
import { Inquiry } from "@/models/inquiry";
import { NextResponse, NextRequest } from "next/server";
import { INewsModel } from "@/config/interfaces";

///Commecing code
//const NewsModel: INewsModel = News

//Get details of an account
// export async function GET(request, { params }) {
//     const { id } = params;
//     const action = request.nextUrl.searchParams.get("action");
//     //console.log("action: ", action)

//     try {
//         await connectMongoDB();
//         if (action === "get-account") {
//             //console.log("getting")
//             const account = await Account.getAccountById(id)
//             return NextResponse.json( account , { status: 200 });
//         } else if (action === "transactions") {
//             const transactions = await Account.getAllTransactions(id)
//             return NextResponse.json({ transactions }, { status: 200 });
//         } else {
//             return NextResponse.json({ message: "Wrong action" }, { status: 400 });
//         }
//     } catch (error) {
//         console.log("Error: ", error)
//         return NextResponse.json({ message: error.message }, { status: 400 });
//     }
// }

///Delete an acocunt
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    //console.log("ID: ", id)

    try {
        await connectMongoDB();
        await Inquiry.deleteInquiry(id)
        return NextResponse.json({ message: "Inquiry deleted" }, { status: 200 });
    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}