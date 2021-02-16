import mongoose from 'mongoose'


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})
// const statusSchema = new mongoose.Schema({
//     status: {
//         type: String,
//         required:true
//     }
// })
const invoiceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    creator: {
        type: String,
        required: true 
    },
    invoiceNumber: {
        type: String,
        required:true
    },
    custName: {
        type: String,
        required:true
        
    },
    date: {
        type: Date,
      required:true  
    },
    custAddress: {
        type: String,
        required:true
    },
    custNumber: {
        type: Number,
        required:true
    },
    custEmail: {
        type: String,
        required:true
    },
    currency: {
        type: String,
        required:true
    },
    region: {
        type: String,
       
    },
    products: [productSchema],
    pointsToRemember: {
        type: String,
        required:true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required:true
    }
})
const Invoice = mongoose.model('Invoice', invoiceSchema)

export default  Invoice