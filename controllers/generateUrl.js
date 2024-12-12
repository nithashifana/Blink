const crypto = require('crypto');

module.exports.generateShortUrl = () => {
  return crypto.randomBytes(4).toString('hex');
};

