const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
router.post("/", async (req, res) => {
  try {
    const { search } = req.body;
    const headers = {
      headers: {
        "Content-Type": "text/html",
        Cookie: process.env.TGX_COOKIE,
        "User-Agent": process.env.USER_AGENT,
      },
    };
    const search_url = `${process.env.TORRENT_GALAXY}/torrents.php?search=${search}`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    const torrent_table = $(".tgxtable");
    const torrents = [];
    for (const torrent of torrent_table.find(".tgxtablerow")) {
      const Name = $(torrent).find("a").eq(1).attr("title");
      const Magnet = $(torrent).find('a[href^="magnet:"]').attr("href");
      const Size = $(torrent)
        .find("table tbody tr td span")
        .eq(2)
        .text()
        .trim();
      const SL = $(torrent).find("table tbody tr td").eq(3);
      const Seeders = parseInt($(SL).find("b").eq(0).text().trim());
      const Leechers = parseInt($(SL).find("b").eq(1).text().trim());

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
