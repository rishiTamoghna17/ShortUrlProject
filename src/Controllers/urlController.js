const UrlModel = require('../Models/urlModel')
const shortId = require('shortid')
const validUrl = require('valid-url')
const redis = require('redis')
const {promisify} = require('util')

const isValidString = function (data) {
    if (typeof (data) != "string") {
        return false
    } else {
        return true
    }
}

const redisClient = redis.createClient(
    19993,
    "redis-19993.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    {no_ready_check: true}
)

redisClient.auth("KdotkLVn5TbUDs4p52VCi1LmWJVMkN5o", function (err) {
    if (err) {
        throw err
    }
})

redisClient.on("connect", async function () {
    console.log("Connected to Redis..")
})

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient)
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient)


const createShortUrl = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({status: false, message: "Body cannot be empty"})
        }
        if (Object.keys(data).length > 1) {
            return res.status(400).send({status: false, message: "Body can only have longUrl"})
        }
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

        let cachedUrlString = await GET_ASYNC(`${data.longUrl}`)
        let cachedUrl = JSON.parse(cachedUrlString)
        // console.log(cachedUrl)
        if (cachedUrl) {
            return res.status(200).send({ status: true, message: "Short Url for this Url already created before", data: cachedUrl })
        } else {
            if (urlCode || shortUrl) {
                return res.status(400).send({ status: false, message: "Invalid request" })
            }

            if (!urlCode) {
                urlCode = shortId.generate(longUrl)
                urlCode = urlCode.trim().toLowerCase()
                // console.log(urlCode)
                create.urlCode = urlCode
            }

            if (!shortUrl) {
                shortUrl = "http://localhost:" + (process.env.PORT || 3000) + `/${urlCode}`
                // console.log(shortUrl)
                create.shortUrl = shortUrl
            }

            let created = await UrlModel.create(create)
            let result = await UrlModel.findOne({ longUrl: longUrl }).select({ _id: 0, urlCode: 1, longUrl: 1, shortUrl: 1 })
            await SET_ASYNC(`${data.longUrl}`, JSON.stringify(result))
            return res.status(201).send({ status: true, data: result })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, error: error.message })
    }
}


const goToPage = async function (req, res) {
    try {
        let urlCode = req.params.urlCode
        // let cached = await GET_ASYNC(`${urlCode}`)
        // if (cached) {
        //     return res.status(200).send({status: true, data: cached})
        // } else {

        // }
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