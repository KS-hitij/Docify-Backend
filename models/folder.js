const mongoose = require("mongoose")

const folderSchema = mongoose.Schema({
    folderName: {
        type: String,
        required: true
    },
    user: {
        id: {
            type: mongoose.Schema.ObjectId,
            ref: "userModel",
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    parentFolder: {
        type: mongoose.Schema.ObjectId,
        ref: "folderModel"
    },
    files:[{
        type: mongoose.Schema.ObjectId,
        ref:"fileModel"
    }],
    subFolder:[{
        type: mongoose.Schema.ObjectId,
        ref: "folderModel"
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }
})
folderSchema.index({"user.id":1,parentFolder:1,folderName:1},{unique:true})
module.exports = mongoose.model("folderModel",folderSchema)