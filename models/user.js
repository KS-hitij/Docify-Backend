const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const { required } = require("joi");
const userSchema = mongoose.Schema({
    username: String,
    email: {
        type:String,
        unique: true
    },
    password: String,
    createdAt:{
        type: Date,
        default: Date.now
    },
    rootFolder:{
        type: mongoose.Schema.ObjectId,
        required:true
    }
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))
        return next();
    try{
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(this.password,salt)
        this.password = hash
        next()
    }
    catch(err){
        next(err)
    }
})

module.exports = mongoose.model("userModel",userSchema)