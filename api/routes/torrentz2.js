const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const headers = require("../headers");

router.post("/", async (req, res) => {
  const { search } = req.body;
  try {
    const search_url = `${process.env.TORRENTZ2}/search?q=${search}`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    const $element = $(".results");
    const torrents = [];
    for (const torrent of $element.find("dl")) {
      const Name = $(torrent).find("dt a").text().trim();
      const Magnet = $(torrent).find("dd a").attr("href");
      const Size = $(torrent).find("dd span").eq(2).text().trim();
      const Seeders = parseInt($(torrent).find("dd span").eq(3).text().trim());
      const Leechers = parseInt($(torrent).find("dd span").eq(4).text().trim());
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
