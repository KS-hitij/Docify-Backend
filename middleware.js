const jwt = require("jsonwebtoken")
const userModel = require("./models/user")
const cloudinary = require("cloudinary").v2

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: "User Must LogIn Or SignUp" })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findOne({ mail: decoded.mail })
    if (!user) {
      return res.status(401).json({ message: "User Must LogIn Or SignUp" })
    }
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }
    req.body.url = req.file.path
    req.body.cloudinaryId = req.file.filename
    req.body.mimeType = req.file.mimetype
    next()
  } catch (err) {
    console.error("Cloudinary upload error:", err)
    res.status(500).json({ error: "Failed to upload to Cloudinary" })
  }
}

module.exports = {authenticate,uploadToCloudinary}