require("dotenv").config()
const mongoose = require("mongoose")
const startServer = require('./server')
const port = process.env.PORT
const dbUri = process.env.MONGODB_URI

mongoose.connect(dbUri).then(() => {
  console.log("Mongodb connected at ", dbUri)
})

startServer(port)