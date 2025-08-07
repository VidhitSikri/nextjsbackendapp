import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect()

export async function POST(request: NextRequest) {
    //EXTRACT DATA FROM THE TOKEN
    const userId = await getDataFromToken(request);
    const user = await User.findOne({_id: userId}).select("-password")


    //check if there is no user
    if (!user) {
        return NextResponse.json({
            message: "User not found",
            success: false
        }, {status: 404}
        )
    }

    return NextResponse.json({
        message: "User found successfully",
        data: user
    })


}