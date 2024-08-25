import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:number
}

// interface ConnectionObject{
//     isConnected?:number
// }

const connection: ConnectionObject = {}

export async function dbConnection():Promise<void>{
  
       if (connection.isConnected) {
         console.log("Already connected");
         return
       }

      try {
         const db = await mongoose.connect(process.env.MONGODB_URL!)

         connection.isConnected = db.connections[0].readyState

         console.log("DB is connected successfully");
         

      } catch (error) {
        console.log("Database connection failed",error);
         process.exit(1)
      }
}