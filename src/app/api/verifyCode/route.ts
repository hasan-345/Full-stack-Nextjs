import { dbConnection } from "@/lib/dbConfig";
import { sendEmailVerification } from "@/lib/resend";
import User from "@/models/User.model";


export async function POST(request:Request) {
    await dbConnection()

    try {
        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username)

        const user:any = await User.findOne({username: decodedUsername})

         if (!user) {
            return Response.json({
                success: false,
                message: "Invalid username"
            },{
                status: 401
            })
         }  

        const checkCode = user?.verifyCode === code
        const isNotExpired = new Date(user?.verifyCodeExpiry) > new Date()

        if (checkCode && isNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "Successfully user verified"
            },{
                status:200
            })

        }else if (!checkCode) {
            return Response.json({
                success: false,
                message: "OTP is incorrect try again"
            },{
                status:404
            })
        }else if (!isNotExpired) {
            user.isVerified = false
            await user.save()

            let number = "0123456789"
            let verifyCode = ""
            for (let index = 0; index < 6 ; index++) {
                const random = Math.floor(Math.random() * number.length)
                verifyCode += number[random]
            }

           const response = await sendEmailVerification(user.email,user._id,verifyCode,user.username)

           if (!response.success) {
            return Response.json({
                success: false,
                message: "OTP is expired. Error while sending new OTP to your email."
            },{
                status:500
            })  
           }

            return Response.json({
                success: false,
                message: "OTP is expired. Your new verify OTP have sent your email."
            },{
                status:200
            })    
        } 


    } catch (error) {
        console.log("Error for verifying of user",error)
        return Response.json({success: false, message: "Error while verify OTP"},{status: 500})
    }
}
 