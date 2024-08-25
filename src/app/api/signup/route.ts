import User, { UserType } from "@/models/User.model";
import { dbConnection } from "@/lib/dbConfig";
import bcrypt from "bcryptjs" //it is used to hashed password before save
import { sendEmailVerification } from "@/lib/resend"; //ignore please i will understand what i did

//this is similar for all controllers 
//if your request post or get or delete
// you will have define request as function name
export async function POST(request:Request) {
    await dbConnection() //established database connection

    try {
        //get details from user
        //await because next js runs at edge
        const {username,email,password} = await request.json()

        //check unique username
        const checkVerifiedUserByUsername = await User.findOne({username})

        if (checkVerifiedUserByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken or Unverified"
            },{
                status: 400
            })
        }

        //check already registered user
        const checkVerifiedUserByEmail = await User.findOne({email})

           // this is method to store 6 digit code of OTP
            let number = "0123456789"
            let verifyCode = ""
            for (let index = 0; index < 6 ; index++) {
                const random = Math.floor(Math.random() * number.length)
                verifyCode += number[random]
            }
            

        if (checkVerifiedUserByEmail) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                  },{
                    status: 400
                  })
            
        }


       const hashedPassword = await bcrypt.hash(password,10)
       //it will convert common password into symbols and characters mixer
       //for example your password is 123456789 bcrypt library convert your password $2SBJ#23... 
       //it is very secure
      
       const user = new User({
                              username,
                              email,
                              password: hashedPassword
                          })

       const newUser:any =  await user.save()

       //ignore this step please patience
       const sentVerifyCode = await sendEmailVerification(email,newUser._id,verifyCode,newUser.username)

       console.log("sent verification",sentVerifyCode);
       
       if (!sentVerifyCode?.success) {
          return Response.json({
            success: false,
            message: sentVerifyCode.message
          },{
            status: 500
          })
       }


         return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email",
          },{
            status: 200
          })
        

    } catch (error) {
        console.log("Error for registering of user",error)
        return Response.json({success: false, message: "Error for registering of user"})
    }
}