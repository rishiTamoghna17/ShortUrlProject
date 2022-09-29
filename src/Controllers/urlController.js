const UrlModel = require('../Models/urlModel')
const shortId = require('shortid')
const validUrl = require('valid-url')


const isValidString = function (data) {
    if (typeof (data) != "string") {
        return false
    } else {
        return true
    }
}


const createShortUrl = async function (req, res) {
    try {
        let data = req.body
        let { longUrl, urlCode, shortUrl } = data
        let create = {}
        if (!longUrl) {
            return res.status(400).send({ status: false, message: "Long Url is required" })
        }
        longUrl = longUrl.trim().toLowerCase()

        if (!isValidString(longUrl)) {
            return res.status(400).send({ status: false, message: "Url must be String" })
        }
        if (!validUrl.isUri(longUrl)) {
            return res.status(400).send({ status: false, message: "Please provide a valid URL" })
        }
        create.longUrl = longUrl

        let available = await UrlModel.findOne({ longUrl: longUrl }).select({ _id: 0, urlCode: 1, longUrl: 1, shortUrl: 1 })
        if (available) {
            return res.status(200).send({ status: true, message: "Short Url for this Url already created before", data: available })
        } else {
            if (urlCode || shortUrl) {
                return res.status(400).send({ status: false, message: "Invalid request" })
            }

            if (!urlCode) {
                urlCode = shortId.generate(longUrl)
                urlCode = urlCode.trim().toLowerCase()
                console.log(urlCode)
                create.urlCode = urlCode
            }

            if (!shortUrl) {
                shortUrl = "http://localhost:" + (process.env.PORT || 3000) + `/${urlCode}`
                console.log(shortUrl)
                create.shortUrl = shortUrl
            }

            let created = await UrlModel.create(create)
            let result = await UrlModel.findOne({ longUrl: longUrl }).select({ _id: 0, urlCode: 1, longUrl: 1, shortUrl: 1 })
            return res.status(201).send({ status: true, message: "Success", data: result })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, error: error.message })
    }
}


const goToPage = async function (req, res) {
    try {
        let urlCode = req.params.urlCode
        let check = await UrlModel.findOne({ urlCode: urlCode })
        if (!check) {
            return res.status(400).send({ status: false, message: "Invalid request" })
        }
        let link = check.longUrl
        //console.log(link)
        return res.status(302).redirect(link)
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, error: error.message })
    }
}


module.exports = { createShortUrl, goToPage }