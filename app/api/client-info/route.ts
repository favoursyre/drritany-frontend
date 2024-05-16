///This is the api route for client info

///Libraries -->
import { NextResponse, NextRequest } from "next/server";
import { IClientInfo } from "@/config/interfaces";
import { lookup } from "geoip-lite";
//import getUserCountry from "js-user-country";

//console.log(getUserCountry().id); // Prints 'CA'

///Commencing the code
///Getting the client info
export async function GET(request: NextRequest) {
    //console.log("I'm here")
    const ip = await request.nextUrl.searchParams.get("ip");
    console.log("IP: ", ip)

    try {
        if (ip) {
            //const location = await lookup(ip)
            //console.log("Location: ", location)
            //const clientInfo: IClientInfo = ;
            //return NextResponse.json( getUserCountry() , { status: 200 });
        } else {
            return NextResponse.json({ message: "IP not detected" }, { status: 400 });
        }
    } catch (error: any) {
        console.log("Error: ", error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    //return NextResponse.json({ message: "IP not detected" }, { status: 200 });
}