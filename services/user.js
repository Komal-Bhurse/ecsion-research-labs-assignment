import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

function generateToken(user){
    return jwt.sign({
       _id: user._id,
       email: user.email
    },process.env.JWT_SECRET_KEY)
}

function validateToken(token){
    if(!token){
        return null;
    }else{
        return jwt.verify(token,process.env.JWT_SECRET_KEY);
    } 
}

export {
    generateToken,
    validateToken,
}