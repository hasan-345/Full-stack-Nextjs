import  {z} from "zod"

export const acceptValidation = z.object({
    acceptMessages: z.boolean()
})