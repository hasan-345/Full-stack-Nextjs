// import { Resend } from 'resend';
// import VerificationEmail from '@/verificationEmailTemp/Email-Template';
import { ApiResponse } from '@/types/ApiResponse';
import User from '@/models/User.model';
import nodemailer from "nodemailer" //we will install "npm install nodemailer" and after that it gives error
//when mouse hover as then it show error 
//npm --save dependencies you will have install it.

// this is resend email function if you have domain you can use code 

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendEmailVerification(email: string, userId: string, verifyCode: string,username: string):Promise<ApiResponse>{
    
//     try {
           
//         const expiryDate = new Date()
//         expiryDate.setHours(expiryDate.getHours() + 1)

//         await User.findByIdAndUpdate(userId,{
//           $set: {
//             verifyCode, verifyCodeExpiry: expiryDate
//           }
//         })

//         const { data, error }  = await resend.emails.send({
//             from: 'Acme <onboarding@resend.dev>',
//             to: email,
//             subject: 'feedback Website | Verification code',
//             react: VerificationEmail({username,otp: verifyCode}),
//           });

//           if (error) {
//             return {success: false, message: `Failed to send email: ${error}`}
//           }
//           console.log("email data: ",data);
//           console.log("email error: ",error);
          

//         return {success: true, message: "Verification email sent successfully"}
//     } catch (error) {
//         console.error("Error for sending email",error)
//         return {success: false, message: "Failed to send email"}
//     }
// }





// this is mailtrap function
export async function sendEmailVerification(email: string, userId: string, verifyCode: string,username: string):Promise<ApiResponse>{
    
  try {
         
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });


   const mailOptions = {
      from: 'ahtisham@gmail.com', // sender address
      to: email , // list of receivers
      subject: 'Feedback Website | Verification code', // Subject line
      text: "Hello world?", // plain text body
      html: `<div><h2>Hello, ${username} </h2>
      Thank you for registering. Please use the following verification code to complete your registration: <br>

      ${verifyCode}<br>

      copy OTP and paste into webpage
      
      </div>`, // html body
    }

      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + 1)

      await User.findByIdAndUpdate(userId,{
        $set: {
          verifyCode, verifyCodeExpiry: expiryDate
        }
      })

      const info = await transport.sendMail(mailOptions)
        
      return {success: true, message: "Verification email sent successfully"}
  } catch (error) {
      console.error("Error for sending email",error)
      return {success: false, message: "Failed to send email"}
  }
}