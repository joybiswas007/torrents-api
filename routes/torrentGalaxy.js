const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const TORRENT_GALAXY = process.env.TORRENT_GALAXY;
  try {
    const search_url = `${TORRENT_GALAXY}/torrents.php?search=${search}`;
    const response = await axios.get(search_url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(response.data);
    const torrent_table = $(".tgxtable");
    let torrents = [];
    for (const torrent of torrent_table.find(".tgxtablerow")) {
      const torrent_name = $(torrent).find("a").eq(1).text().trim();
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
        Name: torrent_name,
        Magnet,
        Size,
        Seeders,
        Leechers,
      });
    }
    if (torrents.length > 0) {
      res.status(202).send(torrents);
    } else {
      res.status(404).send("No magnets found :(");
    }
  } catch (error) {
    res.status(500).send({ error: "Something went wrong. Please try again!" });
  }
});

module.exports = router;
