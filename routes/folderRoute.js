const wrapasync = require("../wrapasync")
const express = require("express")
const router = express.Router()
const folderModel = require("../models/folder")
const { authenticate } = require("../middleware")
const {deleteFolderAndTheirFiles} = require("../util.js")

router.post("/create", authenticate, wrapasync(async (req, res) => {
    const { folderName, parentFolder } = req.body
    const createFolder = {
        folderName: folderName,
        parentFolder: parentFolder,
        user: {
            id: req.user._id,
            name: req.user.username
        }
    }
    const newFolder = new folderModel(createFolder)
     const parent = await folderModel.findById(newFolder.parentFolder)
        if(!parent){
            return res.status(400).json({error:"Parent Folder Not Found"})
        }
        if(parent.subFolder)
            parent.subFolder.push(newFolder._id)
        else{
            parent.subFolder = [newFolder._id]
        }
    await newFolder.save()
    await parent.save()
    res.send("Success")
}))

router.get("/read/:id", authenticate, wrapasync(async (req, res) => {
    const { id } = req.params
    const folder = await folderModel.findById(id).populate("files").populate("subFolder")
    if (!folder) {
        return res.status(404).json({ error: "Folder not found" })
    }
    res.json({
        folder:folder
    })
}))

router.delete("/delete/:id", authenticate, wrapasync(async (req, res) => {
    const { id } = req.params
    const folderToDelete = await folderModel.findById(id)
    if(folderToDelete.folderName==="root" && folderToDelete.parent===null){
        const error = new Error("Cannot delete root folder");
        error.status = 403;
        throw error;
    }
    await deleteFolderAndTheirFiles(id)
    res.json({message:"Success"}).status(200)
}))
module.exports = router