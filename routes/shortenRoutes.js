const express = require("express");
const {
    shortenUrl,
    redirectUrl,
    getUrlDetails,
    getTopUrls,
} = require("../controllers/shortenControllers");

const router = express.Router();

router.post("/shorten", shortenUrl);
router.get("/redirect/:shortUrl", redirectUrl);
router.get('/details/:existingUrl', getUrlDetails);
router.get('/top/:number', getTopUrls);

module.exports = router;