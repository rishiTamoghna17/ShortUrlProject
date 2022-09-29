const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const router = require('./routes/route')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb+srv://tamoghna_test:tamoghna17@test.uvbxgla.mongodb.net/group52Database", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDB is Connected"))
    .catch(error => console.log(error))

app.use('/', router)

app.listen(process.env.PORT || 3000, function () {
    console.log("Express app running on port " + (process.env.PORT || 3000))
})