import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

import Invoice from './invoiceModel.js'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    },
    isSalesRep: {
        type: Boolean,
        default: false
    },
    invoices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Invoice'
    }]

}, {
    timestamps:true
})
userSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Invoice.deleteMany({
            _id: {
                $in: doc.invoices
            }
        })
        console.log(doc)
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next()
    } else {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
})
const User = mongoose.model('User', userSchema)
export default User