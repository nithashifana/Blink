const crypto = require('crypto');
const { shortenUrl } = require('./shortenControllers');

module.exports.generateShortUrl = async(req, res) => {
  const urlLink = await Url.findOne(shortenUrl);

  if(urlLink) {
    return res.status(200).json({ shortUrl: `${req.protocol}://${req.host}/${url.shortUrl}`});
  }
  
  return crypto.randomBytes(4).toString('hex');
};

