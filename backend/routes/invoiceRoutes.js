import express from 'express'
import {
    createInvoices,
    getInvoices,
    getAllInvoices,
    updateInvoice,
    deleteInvoice,
    generateInvoiceNumber,
    getInvoiceById
} from '../controller/invoiceController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const Router = express.Router()


Router.route('/createInvoice/:id').post(protect,createInvoices)
Router.route('/getinvoices').get(protect, getInvoices)
Router.route('/invoice/:id').get(getInvoiceById)
Router.route('/getallinvoices').get(protect, admin, getAllInvoices)
Router.route('/invoicenumber').get(protect, generateInvoiceNumber)
Router.route('/:id').put(protect, updateInvoice)
Router.route('/:id').delete(protect, deleteInvoice)

export default Router