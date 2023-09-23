const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.post("/", async (req, res) => {
  const { search, mode } = req.body;
  try {
    const search_url = `${process.env.KNABEN}/search/index.php?cat=000000000&q=${search}&search=${mode}`;
    const response = await axios.get(search_url);
    const $ = cheerio.load(response.data);
    const $element = $(".table tbody");
    let torrents = [];
    for (const torrent of Array.from($element.find("tr"))) {
      const torrent_name = $(torrent).find(".text-wrap a").text().trim();
      const magnet = $(torrent).find(".text-wrap a").attr("href");
      const size = $(torrent).find(".text-nowrap td").eq(2).text();
      const seeders = $(torrent).find(".text-nowrap td").eq(4).text();
      const leechers = $(torrent).find(".text-nowrap td").eq(5).text();
      torrents.push({
        torrent_name,
        magnet,
        size,
        seeders,
        leechers,
      });
    }
    if (torrents.length > 0) {
      res.status(202).send(torrents);
    } else {
      res.status(404).send("NO Torrent(s) found :-/");
    }
  } catch (error) {
    res.status(500).send({ error: "undefined" });
  }
});

module.exports = router;
