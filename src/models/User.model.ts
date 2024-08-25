import mongoose, {Schema,Document} from "mongoose";

//this is types of Message Schema.
//extend Document means these structure will be stored as Document
export interface MessageType extends Document{
     content: string;
     createdAt: Date;
}


//method to write type of message schema
const messageSchema: Schema<MessageType> = new Schema({
       content: {
        type: String,
        required: [true,"Content is required"]
       },
       createdAt:{
         type: Date,
         required: true,
         default: Date.now
       }  
})


//this is schema of User.
export interface UserType extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    messages: MessageType[];
    isAcceptingMessage: boolean;
    isVerified: boolean;
}

const userSchema: Schema<UserType> = new Schema({
  
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/,"Please write valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        min: [8, "Atleast 8 length password"]
    },
    verifyCode: String,
    verifyCodeExpiry: Date,

    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    isVerified:{
        type: Boolean,
        default: false   
    },
    
    messages: [
       messageSchema
    ]

})

export const User = (mongoose.models.users as mongoose.Model<UserType> ) || mongoose.model<UserType>("users",userSchema)

export default User
