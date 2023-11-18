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
    const torrents = [];
    for (const torrent of $element.find("tr")) {
      const Name = $(torrent).find(".text-wrap a").text().trim();
      const Magnet = $(torrent).find(".text-wrap a").attr("href");
      const Size = $(torrent).find(".text-nowrap td").eq(2).text();
      const Seeders = parseInt($(torrent).find(".text-nowrap td").eq(4).text());
      const Leechers = parseInt(
        $(torrent).find(".text-nowrap td").eq(5).text()
      );
      torrents.push({
        Name,
        Size,
        Seeders,
        Leechers,
        Magnet,
      });
    }
    filterTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
