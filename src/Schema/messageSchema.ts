import  {z} from "zod"

export const messageValidation = z.object({
    content: z.string().min(10,{message:"Paragraph must be atleast 10 charactors"}).max(300,{message: "Content must be no more than 300 characters"})
    
})