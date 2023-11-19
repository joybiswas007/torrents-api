const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const headers = {
  headers: {
    Cookie: process.env.PIRATEIRO_COOKIE,
    "User-Agent": process.env.USER_AGENT,
  },
};

router.post("/", async (req, res) => {
  const { search } = req.body;
  try {
    const search_url = `${process.env.PIRATEIRO}/search?query=${search}`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    const $element = $("ul");
    const torrents = [];
    for (const torrent of $element.find("a")) {
      const Name = $(torrent).find(".pt-title").text().trim();
      const Seeders = parseInt($(torrent).find(".btn-seed-home").text().trim());
      const Leechers = parseInt(
        $(torrent).find(".btn-leech-home").text().trim()
      );
      const url = $(torrent).attr("href");

      const torrentPage = await axios.get(url, headers);
      const info = cheerio.load(torrentPage.data);
      const Size = info(".single-size").text().trim();
      const Magnet = info('a[href^="magnet:?xt=urn:btih"]').attr("href");
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
