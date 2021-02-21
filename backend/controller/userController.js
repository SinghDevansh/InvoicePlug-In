import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import bcrypt from 'bcryptjs'

const addUser = asyncHandler(async (req, res) => {
    const { name, email, password, isSuperAdmin, isSalesRep } = req.body
    const userExists = await User.findOne({ email })
    if (userExists)
    {
        res.status(404)
        throw new Error('User Exists')
    }
    const user = await User.create({
        name,
        email,
        password,
        isSuperAdmin,
        isSalesRep
    })
    if (user)
    {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isSuperAdmin: user.isSuperAdmin,
            isSalesRep:user.isSalesRep,
            token: generateToken(user._id)
        })
    }else {
        res.status(401)
        throw new Error('Invalid User')
    }
    
})


const loginUser = async (req, res) => {
   
    const { email, password } = req.body
    const user = await User.findOne({ email })
    let matchPassword = (password) => {
        const confirmPassword = user.password
        return bcrypt.compare(password, confirmPassword)
    }
    //console.log(user)
    if (user && (await matchPassword(password)))
    {
        res.json({
            id: user._id,
            name: user.name,
            //email: user.email,
            isSuperAdmin: user.isSuperAdmin,
            isSalesRep: user.isSalesRep,
            token:generateToken(user._id)
        })    
    } else {
       res.json({message:'Email or Password is incorrect'})
    }
    
}
const getUsers = asyncHandler(async (req, res) => {
    
    const users = await User.find({})
    res.json(users)
    //console.log(users)
})
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
  
    if (user) {
      res.json(user)
    } else {
      res.status(404)
      throw new Error('User not found')
    }
})
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
  
    if (user) {
      user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.password = req.body.password
        user.isAdmin = req.body.isAdmin
        
      user.isSalesRep = req.body.isSalesRep  
        
  
      const updatedUser = await user.save()
  
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isSuperAdmin: updatedUser.isSuperAdmin,
        isSalesRep:updateUser.isSalesRep
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
})
const deleteUser = asyncHandler(async (req, res) => {
    
    const user = await User.findByIdAndDelete(req.params.id)
    if (user)
    {
        //await user.remove()
        res.json({message:'User Removed'})
    } else {
        res.status(404)
        throw new Error('User Not Found')
    }
})
export {
    addUser,
    loginUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
}
