import { dbConnection } from "@/lib/dbConfig";
import User from "@/models/User.model";
import { MessageType } from "@/models/User.model";

export async function POST(request:Request){
   await dbConnection()

   const {username,content} = await request.json()
    
   try {

      const user = await User.findOne({username})
      
      if (!user) {
        return Response.json({success: false, message: "Please loged In"},{status: 404})
      }
        
      if (!user.isAcceptingMessage) {
        return Response.json({success: false, message: "User does not accept messages"},{status: 403})
      }

      const newMessage = {content, createdAt: new Date()}

      user.messages.push(newMessage as MessageType)

      await user.save()

      return Response.json({success: false, message: "Message sent successfully"},{status: 200})
   } catch (error) {
    console.log("error while sending message",error);    
    return Response.json({success: false, message: "Error while sending message" + error},{status: 500})
   }
}