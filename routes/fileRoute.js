const wrapasync = require("../wrapasync")
const express = require("express")
const router  = express.Router()
const {authenticate,uploadToCloudinary} = require("../middleware")
const fileModel = require("../models/file")
const folderModel = require("../models/folder")
const upload = require("../multer")
const cloudinary = require("../cloudinary")

router.post("/create",authenticate,upload.single("file"),uploadToCloudinary,wrapasync(async(req,res)=>{
    const {fileName,cloudinaryId,url,size,type,mimeType,parentFolder} = req.body
    const createFile = {
        fileName:fileName,
        user:{
            id:req.user._id,
            name: req.user.username
        },
        type: type,
        mimeType: mimeType,
        parentFolder: parentFolder,
        cloudinaryId:cloudinaryId,
        url:url,
        size:size
    }
    const newFile =  new fileModel(createFile)
    const parent = await folderModel.findById(newFile.parentFolder)
    if(!parent){
        return res.status(400).json({error:"Parent Folder Not Found"})
    }
    if(parent.files)
        parent.files.push(newFile._id)
    else{
        parent.files= [newFile._id]
    }
    await newFile.save()
    await parent.save()
    res.send("success")
}))

router.delete("/delete/:id",authenticate,wrapasync(async(req,res)=>{
    const {id} = req.params
    const fileToDelete = await fileModel.findByIdAndDelete(id)
    if (!fileToDelete) {
        return res.status(404).json({ error: "File not found" })
    }
    cloudinary.uploader.destroy(fileToDelete.cloudinaryId,{resource_type:"raw"},function(err,res){
        if(err)
            return res.status(404).json({ error: "File not found" })
    })
    await folderModel.findByIdAndUpdate(fileToDelete.parentFolder,{ $pull: { files: id } },{ new: true })
    res.send("Success")
}))


module.exports = router