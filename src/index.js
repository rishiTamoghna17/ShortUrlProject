const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const router = require('./routes/route')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDB is Connected"))
    .catch(error => console.log(error))

app.use('/', router)

app.listen(process.env.PORT || 3000, function () {
    console.log("Express app running on port" + (process.env.PORT || 3000))
})