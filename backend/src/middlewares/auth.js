const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config();
const secret = process.env.JWT_SECRET;
const userAuth = async (req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is invalid!!!");
        }
        const decodedObj = jwt.verify(token,secret);
        const {_id} = decodedObj;
        const user =await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }catch(err){
        res.status(404).send("Error: "+err.message);
    }

}
module.exports = {
    userAuth
}