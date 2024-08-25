import {z} from "zod" 

export const usernameValidation = z
.string()
.min(2,"Username must be atleast 2 characters")
.max(15,"Username should be no more than 15 characters")
.regex(/^[a-zA-Z0-9_]+$/,"Username must not contain any special characters ")


export const signUpValidation = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8,"Password must be atleast 8 charactors")
})