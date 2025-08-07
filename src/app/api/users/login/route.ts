import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

connect()


export async function POST(request: NextRequest){
    try {

        const reqBody = await request.json();
        const {email, password} = reqBody;

        console.log("Login request body:", reqBody);

        if (!email || !password) {
            return NextResponse.json({error: "Email and password are required"}, {status: 400});
        }

        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        console.log("user found :", user);

        const validPassword = await bcrypt.compare(password, user.password)

        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400});
        }

        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username
        }

        const token  = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})

        const response = NextResponse.json({message: "Logged in successfully", success: true}, {status: 200});

        response.cookies.set("token", token, {
            httpOnly: true,
        })


        return response;
        
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}