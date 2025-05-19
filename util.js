const folderModel = require("./models/folder")
const fileModel = require("./models/file")
const deleteFolderAndTheirFiles = async(id)=>{
    const folderToDelete = await folderModel.findByIdAndDelete(id)
    if(!folderToDelete)
        return
    const parent = await folderModel.findById(folderToDelete.parentFolder)
    parent.subFolder = parent.subFolder.filter((file) => file._id != folderToDelete._id)
    if (folderToDelete.files.length > 0) {
        for(const file of folderToDelete.files){
            await cloudinary.uploader.destroy(file.cloudinaryId, { resource_type: "raw" }, function (err, res) {
                if (err)
                    return res.status(404).json({ error: "File not found" });
            })
            await fileModel.findByIdAndDelete(file._id)
        }
    }
    if(folderToDelete.subFolder.length>0){
        for(const childFolder of folderToDelete.subFolder){
            await deleteFolderAndTheirFiles(childFolder._id)
        }
    }
    await parent.save()
}
module.exports={deleteFolderAndTheirFiles}