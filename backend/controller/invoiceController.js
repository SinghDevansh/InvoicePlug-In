import expressAsyncHandler from 'express-async-handler'
import Invoice from '../models/invoiceModel.js'
import User from '../models/userModel.js'

let deleteCount = 0
const createInvoices = expressAsyncHandler(async (req, res, next) => {
    const {
        creator,
        custName,
        custEmail,
        custNumber,
        custAddress,
        currency,
        region,
        products,
        invoiceNumber,
        date,
        pointsToRemember,
        totalAmount,
        status
    } = req.body
    const user = await User.findById(req.params.id)
   
    
    //console.log(user)
    const invoice =await Invoice.create({
        creator,
        custName,
        custEmail,
        custNumber,
        custAddress,
        currency,
        region,
        products,
        invoiceNumber,
        date,
        pointsToRemember,
        totalAmount,
        user,
        status
    })
    //console.log(invoice)
    //await invoice.save()
    user.invoices.push(invoice._id)
    await user.save()
    if (invoice) {
       
        res.json({
            user: invoice.user,
            creator:invoice.creator,
            custName:invoice.custName,
            custEmail:invoice.custEmail,
            custNumber:invoice.custNumber,
            custAddress:invoice.custAddress,
            currency:invoice.currency,
            region:invoice.region,
            products:invoice.products,
            invoiceNumber:invoice.invoiceNumber,
            date:invoice.date,
            pointsToRemember:invoice.pointsToRemember,
            totalAmount: invoice.totalAmount,
            status:invoice.status
        })

    } else {
        res.status(401)
        throw new Error('Invalid Invoice')
    }
})
const generateInvoiceNumber = expressAsyncHandler(async(req, res) => {
    Invoice.countDocuments({}, ( err, count) => {
        //console.log("Number of invoices:", count);
        //console.log('okokok'+deleteCount)
        if (deleteCount > 0) {
            //console.log(count + deleteCount)
            
            res.json(count + deleteCount)
            
            } else {
            res.json(count+1)
        }
        deleteCount = 0
    })
})
const getInvoices = expressAsyncHandler(async(req, res, next) => {
    const invoices = await Invoice.find({ user: req.user._id }).populate('user' ,'name email')
    res.json(invoices)
})
const getAllInvoices = expressAsyncHandler(async (req, res, next) => {
    const invoices = await Invoice.find({}).populate('user', 'name email')
    res.json(invoices)
})
const getInvoiceById = expressAsyncHandler(async(req, res) => {
    const invoice = await Invoice.findById(req.params.id)
    if (invoice) {
        res.json({
            user: invoice.user,
            creator:invoice.creator,
            custName:invoice.custName,
            custEmail:invoice.custEmail,
            custNumber:invoice.custNumber,
            custAddress:invoice.custAddress,
            currency:invoice.currency,
            region:invoice.region,
            products:invoice.products,
            invoiceNumber:invoice.invoiceNumber,
            date:invoice.date,
            pointsToRemember:invoice.pointsToRemember,
            totalAmount: invoice.totalAmount,
            status: invoice.status
        })
    } else {
        res.json({message:'Invoice Not Found'})
    }
})
const updateInvoice = expressAsyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id)
    //console.log(invoice)
    if (invoice) {
        
   
        invoice.creator = req.body.creator
        invoice.custName = req.body.custName
        invoice.custEmail = req.body.custEmail
        invoice.custAddress = req.body.custAddress
        invoice.custNumber = req.body.custNumber
        invoice.currency = req.body.currency
        invoice.region = req.body.region
        invoice.products = req.body.products
        invoice.invoiceNumber = req.body.invoiceNumber
        invoice.date = req.body.date
        invoice.pointsToRemember = req.body.pointsToRemember
        invoice.totalAmount = req.body.totalAmount
        invoice.status = req.body.status

        const updatedInvoice = await invoice.save()
        //console.log(updateInvoice)
    
        res.json({
            user: updatedInvoice.user,
            creator: updatedInvoice.creator,
            custName: updateInvoice.custName,
            custEmail: updateInvoice.custEmail,
            custNumber: updateInvoice.custNumber,
            custAddress: updateInvoice.custAddress,
            currency: updateInvoice.currency,
            region: updateInvoice.region,
            products: updateInvoice.products,
            invoiceNumber: updateInvoice.invoiceNumber,
            date: updateInvoice.date,
            pointsToRemember: updateInvoice.pointsToRemember,
            totalAmount: updateInvoice.totalAmount,
            status:updateInvoice.status
        })
    } else {
        res.json({message:'invoice not found'})
    }

    
})
const deleteInvoice = expressAsyncHandler(async (req, res, next) => {
    
    //console.log(req)
    const invoice = await Invoice.findOneAndDelete(req.params.id)
    if (invoice) {
        await invoice.remove()
        deleteCount++
        res.json({ message: 'invoice deleted' })
    } else {
        res.json({ message: 'try again' })
    }
})
export {
    createInvoices,
    getInvoices,
    getAllInvoices,
    updateInvoice,
    deleteInvoice,
    generateInvoiceNumber,
    getInvoiceById
}