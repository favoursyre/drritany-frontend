///This is the api routes for admin 

///Libraries -->
import connectMongoDB from "@/config/mongodb";
import { Admin } from "@/models/admin";
import { IAdmin, IAdminModel } from "@/config/interfaces";
import { NextResponse } from "next/server";
import { sendAdminCreationEmail } from "@/config/email";

///Commencing the code
///Creating an admin account
export async function POST(request: any) {

    try {
        let admin_: IAdmin
        await connectMongoDB();
        const action = await request.nextUrl.searchParams.get("action");
        admin_ = await request.json();
        console.log('trying to login POST')
        const { password } = admin_

        if (action === "create") {
            admin_ = await Admin.createAdmin( admin_ );
            console.log("Account server: ", admin_)

            //Send email verification email
            const status = await sendAdminCreationEmail(admin_, password!)
            //console.log("Email: ", status)

            return NextResponse.json({ message: "Admin Created successfully" }, { status: 200 });
        } else if (action === "login") {
            console.log("trying to login")
            let { emailAddress, password } = admin_
            emailAddress = emailAddress as unknown as string
            password = password as unknown as string
            const admin = await Admin.loginAdmin(emailAddress, password)
            return NextResponse.json({ admin, message: "Access Granted"}, { status: 200 });
        } else {
            return NextResponse.json({ message: "Wrong action" }, { status: 400 });
        }
    } catch (error: any) {
        console.log("Error: ", error.message)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}

///Getting all accounts
export async function GET(request: any) {
    try {
        await connectMongoDB();
        const admin_ = await request.json();
        const action = await request.nextUrl.searchParams.get("action");
        

        if (action === "all") {
            const password = await request.nextUrl.searchParams.get("pass");
            const admins = Admin.getAllAdmins()
            
            return NextResponse.json( admins , { status: 200 });
        } else if (action === "id") {
            const id = await request.nextUrl.searchParams.get("id");
            const admin = await Admin.getAdminById(id)

            return NextResponse.json( admin , { status: 200 });
        } else {
            return NextResponse.json({ message: "Wrong action" }, { status: 400 });
        }
    } catch (error: any) {
        console.log('GET: ', error)
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    
}