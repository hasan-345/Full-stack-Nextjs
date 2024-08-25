import { dbConnection } from "@/lib/dbConfig";
import User from "@/models/User.model";
import { usernameValidation } from "@/Schema/signUpSchema";
import {z} from "zod" //ignore 

const usernameValidationQuery = z.object({
  username: usernameValidation
})//ignore

export async function GET(request:Request) {
    await dbConnection()

    try {

        //it means http://localhost/checkUsername?username=hassan
        const {searchParams} = new URL(request.url)

        const queryUsername = {
            username: searchParams.get("username")
        }
        //it accept object
        const result = usernameValidationQuery.safeParse(queryUsername)

        console.log("result from zod",result);
        
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []

            return Response.json({
                success: false,
                message: usernameError?.length > 0? usernameError.join(", ") : "Invalid query parameters"
            })
        }

        const {username } = result.data


        const checkUsername = await User.findOne({username})

        if (checkUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            },{
                status: 401
            })
        }


         return Response.json({
                success: true,
                message: "Username is unique"
            },{
                status: 200
            })

    } catch (error) {
        console.log("error while checking username",error);    
    return Response.json({success: false, message: "Error while checking username" + error},{status: 500})
    }
}

