const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const headers = require("../headers");

router.post("/", async (req, res) => {
  const { search, mode } = req.body;
  try {
    const search_url = `${process.env.KNABEN}/search/index.php?cat=000000000&q=${search}&search=${mode}`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    const $element = $(".table tbody");
    let torrents = [];
    for (const torrent of Array.from($element.find("tr"))) {
      const Name = $(torrent).find(".text-wrap a").text().trim();
      const Magnet = $(torrent).find(".text-wrap a").attr("href");
      const Size = $(torrent).find(".text-nowrap td").eq(2).text();
      const Seeders = $(torrent).find(".text-nowrap td").eq(4).text();
      const Leechers = $(torrent).find(".text-nowrap td").eq(5).text();
      torrents.push({
        Name,
        Magnet,
        Size,
        Seeders,
        Leechers,
      });
    }
    filterTorrents(res, torrents);
  } catch (error) {
    res.status(error.response.status).send({ error: error.message });
  }
});

module.exports = router;
