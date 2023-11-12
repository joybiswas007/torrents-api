const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const headers = require("../headers");

router.post("/", async (req, res) => {
  const { search } = req.body;
  try {
    const search_url = `${process.env.ANIME_TOSHO}/search?q=${search}`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    const $element = $("#content");
    let torrents = [];
    for (const torrent of $element.find(".home_list_entry")) {
      const Name = $(torrent).find(".link").text().trim();
      const Size = $(torrent).find(".size").text().trim();
      const Magnet = $(torrent)
        .find('a[href^="magnet:?xt=urn:btih"]')
        .attr("href");
      const SL = $(torrent)
        .find('span[style*="color: #808080;"]')
        .text()
        .trim();
      // Regular expression to match numbers and arrows
      const regex = /(\d+)\s*↑\/\s*(\d+)\s*↓/;

      // Match the regular expression against the span content
      const match = SL.match(regex);

      // Extract seeders and leechers
      const Seeders = match ? parseInt(match[1]) : 0;
      const Leechers = match ? parseInt(match[2]) : 0;

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
