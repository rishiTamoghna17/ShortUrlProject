const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const urlSchema = new Schema({
    urlCode: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    longUrl: {
        type: String,
        required: true,
        trim: true
    },
    shortUrl: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    }
}, { timestamps: true })

module.exports = mongoose.model('Url', urlSchema)