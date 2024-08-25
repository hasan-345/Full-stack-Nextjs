import  {z} from "zod"
//it is used for validations 
export const verifyValidation = z.object({
    otp: z.string().length(6,{message:"Verification code must be 6 digits"})
})