const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("./cloudinary")

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    resource_type: "raw", 
    folder: "FMS",
    public_id: (req, file) => `${Date.now()}-${file.originalname}`
  }
})
const upload = multer({ storage })
module.exports = upload