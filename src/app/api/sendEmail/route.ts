import { dbConnection } from "@/lib/dbConfig";
import { sendEmailVerification } from "@/lib/resend";
import User from "@/models/User.model";

export async function GET(request:Request) {

    await dbConnection()

    try {

         const {searchParams} = new URL(request.url)

         const username = searchParams.get("username")

         const user:any = await User.findOne({username})

         if (!user) {
            return Response.json({
                success: false,
                message: "User is not found with this username"
            }) 
         }

         let number = "0123456789"
            let verifyCode = ""
            for (let index = 0; index < 6 ; index++) {
                const random = Math.floor(Math.random() * number.length)
                verifyCode += number[random]
            }

         const sendValidation = await sendEmailVerification(user.email, user._id , verifyCode, user.username)

         if (!sendValidation.success) {
            return Response.json({
                success: false,
                message: "Email server error to verify you please try again."
            },{
                status: 500
            })
         }

         return Response.json({
            success: true,
            message: "Email sent successfully."
        },{
            status: 200
        })

    } catch (error) {
        console.log("SEND EMAIL ERROR",error)
        return Response.json({success: false, message: "SEND EMAIL ERROR"})
    }

}