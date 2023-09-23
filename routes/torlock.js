const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const TOR_LOCK = process.env.TOR_LOCK;
  try {
    const search_url = `${TOR_LOCK}/?qq=1&q=${search}`;
    const response = await axios.get(search_url);
    const $ = cheerio.load(response.data);
    const $element = $("article div.table-responsive tbody").last();
    let torrents = [];

    //Convert element to object for async/await usage
    for (const element of Array.from($element.find("tr"))) {
      const link = $(element).find("a").attr("href");
      const torrent_link = `${TOR_LOCK}${link}`;
      const torrent_name = $(element).find("a b").text();
      const size = $(element).find(".ts").text();
      const seeders = $(element).find(".tul").text();
      const leechers = $(element).find(".tdl").text();

      //Visit every torrent link and fetch magnet link
      const $magnet_link = await axios.get(torrent_link);
      const $magnet = cheerio.load($magnet_link.data);
      const magnet = $magnet("h4 a").eq(0).attr("href");

      torrents.push({
        torrent_name,
        magnet,
        size,
        seeders,
        leechers,
      });
    }
    res.send(torrents);
  } catch (error) {
    res.status(500).send({ error: "undefined" });
  }
});

module.exports = router;
