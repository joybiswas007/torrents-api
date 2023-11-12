const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const headers = require("../headers");

router.post("/", async (req, res) => {
  const { search } = req.body;
  try {
    const search_url = `${process.env.TORRENT_GALAXY}/torrents.php?search=${search}`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    const torrent_table = $(".tgxtable");
    let torrents = [];
    for (const torrent of torrent_table.find(".tgxtablerow")) {
      const Name = $(torrent).find("a").eq(1).text().trim();
      const Magnet = $(torrent).find('a[href^="magnet:"]').attr("href");
      const Size = $(torrent)
        .find("table tbody tr td span")
        .eq(2)
        .text()
        .trim();
      const SL = $(torrent).find("table tbody tr td").eq(3);
      const Seeders = $(SL).find("b").eq(0).text().trim();
      const Leechers = $(SL).find("b").eq(1).text().trim();

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
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
