const wrapasync = require("../wrapasync")
const userModel = require("../models/user")
const express = require("express")
const router  = express.Router()
const jwt = require("jsonwebtoken")
const folderModel = require("../models/folder")
const bcrypt = require("bcrypt")
const {authenticate} = require("../middleware")
require('dotenv').config()

router.post("/signUp",wrapasync(async(req,res)=>{
    const {username,email,password} = req.body
    const createUser = {
        username: username,
        email: email,
        password: password
    }
    const newUser = new userModel(createUser)
    let token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:"3 days"})
    res.clearCookie("token")
    res.cookie("token",token,{
        httpOnly: true,
        maxAge: 2*24*60*60*1000
    })
    const createRootFolder = {
        folderName: "root",
        user:{
            id: newUser._id,
            name: newUser.username
        },
        parentFolder: null,
    }
    const newRootFolder = new folderModel(createRootFolder)
    await newRootFolder.save()
    newUser["rootFolder"] = newRootFolder._id
    await newUser.save()
    res.send(newUser)
}))

router.post("/logIn",wrapasync(async(req,res)=>{
    const {email,password} = req.body
    const user = await userModel.findOne({email:email})
    if(!user){
        return res.status(401).json({message:"Email Or Password Is Incorrect."})
    }
    const result = await bcrypt.compare(password, user.password)
    if(!result){
        return res.status(401).json({message:"Email Or Password Is Incorrect."})
    }
    let token = jwt.sign({email:user.email},process.env.JWT_SECRET,{expiresIn:"3 days"})
    res.clearCookie("token")
    res.cookie("token",token,{
        httpOnly: true,
        maxAge: 3*24*60*60*1000
    })
    res.send(user)
}))

router.post("/logOut",wrapasync(async (req,res)=>{
    res.clearCookie("token",{
        httpOnly:true,
        path:'/'
    })
    res.send("Success")
}))

router.get("/checkAuthentication",authenticate,wrapasync(async(req,res)=>{
    res.json({message:"Success"}).status(200)
}))

router.post("/info",authenticate,wrapasync(async(req,res)=>{
    const user = req.user
    res.json({user:user}).status(200)
}))

module.exports = router