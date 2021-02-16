import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import invoiceRoutes from './routes/invoiceRoutes.js'
import cors from 'cors'
import colors from 'colors'



const app = express()
dotenv.config()
connectDb()
app.use(cors())
app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/invoices', invoiceRoutes)




const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`.red)
})