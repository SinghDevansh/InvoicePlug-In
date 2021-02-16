import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import dotenv from 'dotenv'

dotenv.config()

const protect = asyncHandler(async (req, res, next) => {
    //console.log(req.headers)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
       try {
           let token = req.headers.authorization.split(' ')[1]
           const decoded = jwt.verify(token, process.env.JWT_SECRET)
           //console.log(decoded)
           req.user = await User.findById(decoded.id).select('-password')
           //console.log('reached here')
           next()
       } catch (error) {
           console.log(error)
           res.status(401)
           throw new Error('user not found')
       }
        
    }
    else
    {
        res.status(401)
        throw new Error('token not found')
    }
    
})

const admin = (req, res, next) => {
    //console.log(req.user)
    if (req.user && req.user.isSuperAdmin)
    {
        next()    
    }
    else {
        res.json({message:'You are not authorized'})

    }
    
}
export { admin, protect }