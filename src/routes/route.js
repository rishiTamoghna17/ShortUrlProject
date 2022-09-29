const express = require('express')
const router = express.Router()

const UrlController = require('../Controllers/urlController')

router.post("/url/shorten", UrlController.createShortUrl)

module.exports = router