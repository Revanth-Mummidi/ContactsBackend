const asyncHandler= require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/userModel");



const registerUser = asyncHandler(async (req,res)=>{
    const {username,email,password}=req.body;
    console.log("BODY",req.body);
    if(!username || !email || !password)
    {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable=await User.findOne({email});
    if(userAvailable)
    {
        
        res.status(400);
        throw new Error("User already registered!");
    }
    const hashedPassword = await bcrypt.hash(password,10);
    console.log("Hashed password",hashedPassword);
    const user = await User.create(
        {
            username,
            email,
            password:hashedPassword
        }
    )
    console.log("USER IS CREATER",user);
    if(user){
        res.status(201).json({
            _id:user.id,
            email:user.email
        });
    }
    else{
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json({
        message:"Register the user"
    });
})


const loginUser = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password)
    {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({email});
    if(!user)
    {
        res.status(400);
        throw new Error("User doesn't exist with the email");
    }
    const accesstoken = jwt.sign({
        user:{
            username:user.username,
            email:user.email,
            id:user.id
        }
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:"4h"
    }
);
    const check=await bcrypt.compare(password,user.password);
    if(check)
    {
        res.status(200).json({accesstoken});
    }
    else{
     res.status(401);
     throw new Error("Password is incorrect");
    }
})

const currentUser = asyncHandler(async (req,res)=>{
    res.json(req.user);
})

module.exports = {registerUser,loginUser,currentUser}