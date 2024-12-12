const Url = require("../models/shortenModel");
const crypto = require('crypto');
const formatDate = require("../util/formatDate")
const generateShortUrl = () => crypto.randomBytes(4).toString('hex');

module.exports.shortenUrl = async(req, res) => {
    const { longUrl } = req.body;
    if(!longUrl)
        return res.status(400).json({ error: 'Long url is required.'});
    try {
        const existingUrl = await Url.findOne({ longUrl });
        if(existingUrl) {
            return res.status(200).json({ shortUrl: `${req.protocol}://${req.get('host')}/redirect/${existingUrl.shortUrl}`});
        }
        const shortUrl = generateShortUrl();
        const newUrl = new Url({ longUrl, shortUrl});
        await newUrl.save();
        res.status(201).json({ shortUrl: `${req.protocol}://${req.get('host')}/redirect/${shortUrl}`});
    } catch(error) {
        console.error("Error", error);
        res.status(500).json({message: "Internal sever error", error});
    }
};

module.exports.redirectUrl = async(req, res) => {
    try {
        const { shortUrl } = req.params;
        const existingUrl = await Url.findOne({ shortUrl });
        if(!existingUrl) {
            return res.status(404).json({ error: 'Short URL not found.'});
        }

        const now = new Date();
        const currentDate = formatDate(now);

        if(existingUrl.lastAccessDate !== currentDate) {
            existingUrl.dailyCount = 0;
            existingUrl.lastAccessDate = currentDate;
        }

        existingUrl.dailyCount += 1;
        existingUrl.hitRate += 1;
        await existingUrl.save();

        if(existingUrl.dailyCount > 20) {
            return res.status(429).json({ error: 'Rate limit(20) exceede for this URL.'});
        }

        
        if (existingUrl.hitRate % 10 ===0) {
            return res.redirect('https://www.google.com');
        }

        res.redirect(existingUrl.longUrl)
    } catch (error) {
        console.error("Error in redirect url.");
        res.status(500).json({ message: "Internal server error"});
    }
};

module.exports.getUrlDetails = async (req, res) => {
    try {
        const { existingUrl } = req.params;
        const urlData = await Url.findOne({
            $or: [
                { shortUrl: existingUrl },
                { longUrl: existingUrl }
            ]
        });

        if (!urlData) {
            console.error("No URL found with query:", query);
            return res.status(404).json({ error: 'URL not found.' });
        }
        const now = new Date();
        const currentDate = formatDate(now);

        if(urlData.lastAccessDate !== currentDate) {
            urlData.dailyCount = 0;
            urlData.lastAccessDate = currentDate;
        }
        await urlData.save();
        res.status(200).json({ url: urlData, hitRate: urlData.hitRate });
    } catch (error) {
        console.error("Error in getUrlDetails:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports.getTopUrls = async (req, res) => {
    const { number } = req.params;
    const urls = await Url.find().sort({ hitRate: -1 }).limit(Number(number));
    res.status(200).json(urls);
};