import mongoose from 'mongoose'
import dotenv from 'dotenv'


dotenv.config()
const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify:true
        })
        console.log(`MONGODB connected ${conn.connection.host}`.magenta)
    } catch (error) {
        console.log("connection failed",error)
    }
    
}
export default connectDb