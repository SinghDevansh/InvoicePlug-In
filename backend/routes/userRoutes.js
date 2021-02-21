import express from 'express'

import { addUser, deleteUser, getUserById, getUsers, loginUser, updateUser } from '../controller/userController.js'
import { admin, protect } from '../middleware/authMiddleware.js'


const Router = express.Router()

Router.route('/adduser').post(protect, admin, addUser)
Router.route('/getusers').get(protect, admin, getUsers)
Router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, updateUser)
    .delete(protect, deleteUser)
Router.route('/login').post(loginUser)
export default Router

//remember to add protect and admin middlewanre in getUsers