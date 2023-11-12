const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const headers = require("../headers");

router.post("/", async (req, res) => {
  const { search } = req.body;
  try {
    const search_url = `${process.env.BIT_SEARCH}/search?q=${search}`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    let torrents = [];
    const $search = $("li.search-result");
    for (let i = 0; i < $search.length; i++) {
      const torrent = $search[i];
      const Name = $(torrent).find("h5").text().trim();
      const Magnet = $(torrent).find(".links a.dl-magnet").attr("href");
      const Size = $(torrent).find('img[alt="Size"]').parent().text().trim();
      const Seeders = $(torrent)
        .find('img[alt="Seeder"]')
        .parent()
        .text()
        .trim();
      const Leechers = $(torrent)
        .find('img[alt="Leecher"]')
        .parent()
        .text()
        .trim();
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
