import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/models/User.model";
import { dbConnection } from "@/lib/dbConfig";


//this controller is used to change state
export async function POST(request:Request) {
    
    await dbConnection()
     
    const session = await getServerSession(authOptions) //this is used to get user details

    const user =  session?.user

    if (!user) {
        return Response.json({success: false, message: "Please loged In"},{status: 400})
    }

    const userId = user._id;

    const {acceptMessages} = await request.json()

    try {
         
        const newUser = await User.findByIdAndUpdate(userId,{
           isAcceptingMessage: acceptMessages
        },{
            new: true
        })

        if (!newUser) {
            return Response.json({success: false, message: "User does not acceptance status failed"},{status: 401})
        }

        return Response.json({success: true,message: "Successfully updated user with state",newUser},{status:200})
    } catch (error) {
        console.log("Error while changing state of accept messages",error);
        return Response.json({success: false, message: "Failed to change state of accept message" + error},{status: 500})
    }
}

//this is used to check current state of accept message
export async function GET() {

    await dbConnection()
     
    const session = await getServerSession(authOptions)

    const user =  session?.user

    if (!user) {
        return Response.json({success: false, message: "Please login before requesting"},{status: 404})
    }

    const userId = user._id;

    try {
        const user = await User.findById(userId)

        if (!user) {
        
        return Response.json({success: false, message: "Please login before requesting"},{status: 400})
        
        }

        const isAcceptedMessages = user.isAcceptingMessage

        return Response.json({success: true,message: "Successfully got state of accept messages",isAcceptingMessages:isAcceptedMessages},{status:200})

    } catch (error) {
        console.log("Error while finding state of accept messages",error);
        return Response.json({success: false, message: "Failed to find state of accept message" + error},{status: 500})
    }
}