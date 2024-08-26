import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import User from "@/models/User.model";
import { dbConnection } from "@/lib/dbConfig";
import mongoose from "mongoose";



export async function DELETE(request:Request,{params}: {params: {messageId: string}}){

    const messageId = params.messageId

   await dbConnection()
   const session = await getServerSession(authOptions)

   const user =  session?.user

   if (!user) {
       return Response.json({success: false, message: "Please loged In"},{status: 401})
   }

   const userId = new mongoose.Types.ObjectId(user._id);

   try {
        
      const updated =  await User.updateOne({
            _id: userId
        },{
            $pull: {
                messages: {_id: messageId}
            }
        })

      if (updated.modifiedCount == 0) {
        return Response.json({success: false, message: "Message not found or already deleted"},{status: 404})
      }


        return Response.json({success: true, messages: "Message deleted"},{status: 200})

   } catch (error) {
    console.log("Error while deleting message",error);
    return Response.json({success: false, message: "Failed to delete messages" + error},{status: 500})
   }
}