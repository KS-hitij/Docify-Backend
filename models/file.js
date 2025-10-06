const mongoose = require("mongoose")

const fileSchema = mongoose.Schema({
    user:{
        id:{
            type: mongoose.Schema.ObjectId,
            ref:"userModel",
            required: true
        },
        name: {
            type: String,
            required:true
        }
    },
    fileName: {
        type: String,
        required:true
    },
    cloudinaryId: String,
    url:{
        type: String,
        required:true
    },
    size: Number,
    type:{
        type: String,
        required:true
    },
    mimeType:{
        type: String,
        required:true
    },
    createAt:{
        type: Date,
        default: Date.now
    },
    parentFolder:{
        type: mongoose.Schema.ObjectId,
        ref:"folderModel",
        required:true
    }
})
fileSchema.index({"user.id":1,parentFolder:1,fileName:1},{unique:true})
module.exports = mongoose.model("fileModel",fileSchema)