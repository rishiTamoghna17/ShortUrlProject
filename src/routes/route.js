const express = require('express')
const router = express.Router()

const UrlController = require('../Controllers/urlController')

router.post("/url/shorten", UrlController.createShortUrl)
router.get("/:urlCode", UrlController.goToPage)

module.exports = router