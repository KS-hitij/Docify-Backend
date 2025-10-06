const folderModel = require("./models/folder")
const fileModel = require("./models/file")
const cloudinary = require("cloudinary").v2
const deleteFolderAndTheirFiles = async(id)=>{
    const folderToDelete = await folderModel.findById(id).populate('files')
    if(!folderToDelete)
        return
    const parent = await folderModel.findById(folderToDelete.parentFolder)
    parent.subFolder = parent.subFolder.filter((file) => file._id != folderToDelete._id)
    if (folderToDelete.files.length > 0) {
        for(const file of folderToDelete.files){
            console.log(file);
            await cloudinary.uploader.destroy(file.cloudinaryId, { resource_type: "raw" }, function (err, res) {
                if (err)
                    return
            })
            await fileModel.findByIdAndDelete(file._id)
        }
    }
    if(folderToDelete.subFolder.length>0){
        for(const childFolder of folderToDelete.subFolder){
            await deleteFolderAndTheirFiles(childFolder._id)
        }
    }
    await folderModel.findByIdAndDelete(id)
    await parent.save()
}
module.exports={deleteFolderAndTheirFiles}