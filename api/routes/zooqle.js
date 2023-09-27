const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const ZOOQLE = process.env.ZOOQLE;
  try {
    const response = await axios.post(
      `${ZOOQLE}/search/`,
      {
        q: search,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const $ = cheerio.load(response.data);
    const $element = $("section table tbody");
    let torrents = [];
    for (const torrent of $element.find("tr")) {
      const torrent_name = $(torrent).find("a").text().trim();
      const Size = $(torrent).find("td").eq(1).text().trim();
      const Seeders = $(torrent).find("td").eq(2).text().trim();
      const Leechers = $(torrent).find("td").eq(3).text().trim();
      const id = $(torrent).find("form input").attr("value");
      const page = await axios.post(
        `${ZOOQLE}/torrent-page/`,
        { id },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const $magnet_url = cheerio.load(page.data);
      const Magnet = $magnet_url('a[href^="magnet:?xt=urn:btih"]').attr("href");

      torrents.push({
        Name: torrent_name,
        Magnet,
        Size,
        Seeders,
        Leechers,
      });
    }

    if (torrents[0].Magnet === undefined) {
      res.status(404).send({ error: "No magnets found :(" });
      return;
    }
    filterTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
