const express = require("express")
const app = express()
const port = 3000
const mongoose = require("mongoose")
const fileRouter = require("./routes/fileRoute")
const authRouter = require("./routes/authRoute")
const folderRouter = require("./routes/folderRoute")
const cookieParser = require("cookie-parser")
const cors = require('cors')

app.use(cors({ origin: 'http://localhost:5173',
  credentials:true
 }))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())

mongoose.connect('mongodb://127.0.0.1:27017/FMS')
.then(() => console.log('Connected!'))

app.get("/",async(req,res)=>{
  res.send("homepage")
})

app.use("/user",authRouter)
app.use("/file",fileRouter)
app.use("/folder",folderRouter)

//gloabl error handler
app.use((err, req, res, next) => {
  if(err.code === 11000){
    res.status(500).json({
      error: "User Already Exits"
    })
  }
  res.status(500).json({
    error: err.message || "Something went wrong"
  })
})

app.listen(port,()=>{
    console.log("listening")
})