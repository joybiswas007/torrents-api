const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.post("/", async(req, res) => {
    const { search } = req.body;
    try {
        const search_url = `${process.env.KNABEN}${search}&search=fast`;
        const response = await axios.get(search_url);
        const $ = cheerio.load(response.data);
        const $element = $(".table");
        let torrents = [];
        for(let i = 0; i < $element.length; i++){
            console.log($element.length);
            const torrent = $element[i];
            const total = $(torrent).find("p").text().trim();
            const magnet = $(torrent).find(".text-wrap a").attr("href"); 
            torrents.push({
                total,
                magnet,
            });
        }
        res.send(torrents);
    } catch (error) {
        res.status(500).send({error: "undefined"})
    }
});

module.exports = router;