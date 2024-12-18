const mongoose = require('mongoose');
const formatDate = require("../util/formatDate")

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true,
        unique: true,
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true,
    },
    hitRate: {
        type: Number,
        required: true,
        default: 0,
    },
    dailyHit: {
        type: Number,
        required: true,
        default: 0
    },
    lastAccessDate: {
        type: String,
        default: () => formatDate(new Date()),
        
        required: true
    },
},
{ timestamps: true }
);

module.exports = mongoose.model('Url', urlSchema);