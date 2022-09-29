const UrlModel = require('../Models/urlModel')
const shortId = require('shortid')
const validUrl = require('valid-url')


const createShortUrl = async function (req, res) {
    try {
        let data = req.body
        let { longUrl, urlCode, shortUrl } = data
        let create = {}
        if (!longUrl) {
            res.status(400).send({ status: false, message: "Long Url is required" })
        }
        if (!validUrl.isUri(longUrl)) {
            res.status(400).send({ status: false, message: "Please provide a valid URL" })
        }
        create.longUrl = longUrl
        
        let check = await UrlModel.findOne({longUrl: longUrl})
        if (check) {
            return res.status(200).send({status: true, message: "Short Url already created before for this Url", data: check})
        } else {
            if (urlCode || shortUrl) {
                res.status(400).send({ status: false, message: "Invalid request" })
            }
    
            if (!urlCode) {
                urlCode = shortId.generate(longUrl)
                console.log(urlCode)
                create.urlCode = urlCode
            }
    
            if (!shortUrl) {
                shortUrl = "localhost:" + (process.env.PORT || 3000) + `/${urlCode}`
                console.log(shortUrl)
                create.shortUrl = shortUrl
            }
    
            let result = await UrlModel.create(create)
            res.status(201).send({ status: true, message: "Success", data: result })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, error: error.message })
    }
}


module.exports = { createShortUrl }