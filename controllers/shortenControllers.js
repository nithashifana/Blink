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
            return res.status(400).json({ shortUrl: `${req.protocol}://${req.host}/${existingUrl.shortUrl}`});
        }
        const shortUrl = generateShortUrl();
        newUrl = new Url({ longUrl, shortUrl});
        await newUrl.save();
        res.status(201).json({ shortUrl: `${req.protocol}://${req.host}/${existingUrl.shortUrl}`});
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
        if(existingUrl.dailyCount > 20) {
            return res.status(429).json({ error: 'Rate limit(20) exceede for this URL.'});
        }

        existingUrl.hitRate += 1;
        if (existingUrl.hitRate % 10 ===0) {
            await existingUrl.save();
            return res.redirect('https://www.google.com');
        }
        
        await existingUrl.save();
        res.redirect(existingUrl.longUrl)
    } catch (error) {
        console.error("Error in redirect url.");
        res.status(500).json({ message: "Internal server error"});
    }
};

module.exports.getUrlDetails = async (req, res) => {
    try {
        const { existingUrl } = req.params;
        let query = { longUrl: existingUrl };
        
        console.log("Query:", query); 

        const now = new Date();
        const currentDate = formatDate(now);

        if(existingUrl.lastAccessDate !== currentDate) {
            existingUrl.dailyCount = 0;
            existingUrl.lastAccessDate = currentDate;
        }

        const urlData = await Url.findOne(query);
        const url = await Url.find();
        console.log(url);
        if (!urlData) {
            console.error("No URL found with query:", query);
            return res.status(404).json({ error: 'URL not found.' });
        }

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