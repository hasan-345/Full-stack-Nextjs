import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/models/User.model";
import { dbConnection } from "@/lib/dbConfig";
import mongoose from "mongoose";



export async function GET(){
   await dbConnection()
   const session = await getServerSession(authOptions)

   const user =  session?.user

   if (!user) {
       return Response.json({success: false, message: "Please loged In"},{status: 401})
   }

   const userId = new mongoose.Types.ObjectId(user._id);

   try {

     //you know all messages are stored in array form then unwind is used to convert array elements into documents
        const user = await User.aggregate([
            { $match: { _id: userId }},
            { $unwind: "$messages" },
            {$sort: {"messages.createdAt": -1}},
            {$group: {_id: "$_id", messages: {$push: "$messages"}}}
        ])

        if (!user || user.length === 0) {
            return Response.json({success: false, message: "No found any messaages"},{status: 401})
        }

        console.log("user aggregation pipeline messages",user);

        return Response.json({success: true, messages: user[0].messages},{status: 200})

   } catch (error) {
    console.log("Error while fetching messages",error);
    return Response.json({success: false, message: "Failed to fetch all messages" + error},{status: 500})
   }
}