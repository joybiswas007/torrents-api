const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const headers = require("../headers");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const TOR_LOCK = process.env.TOR_LOCK;
  try {
    const search_url = `${TOR_LOCK}/?qq=1&q=${search}`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    const $element = $("article div.table-responsive tbody").last();
    const torrents = [];
    for (const element of $element.find("tr")) {
      const Name = $(element).find("a b").text();
      const Size = $(element).find(".ts").text();
      const Seeders = parseInt($(element).find(".tul").text());
      const Leechers = parseInt($(element).find(".tdl").text());

      //Visit every torrent link and fetch magnet link
      const link = $(element).find("a").attr("href");
      const torrent_link = `${TOR_LOCK}${link}`;
      const magnetPage = await axios.get(torrent_link);
      const magnetData = cheerio.load(magnetPage.data);
      const Magnet = magnetData("h4 a").eq(0).attr("href");

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
