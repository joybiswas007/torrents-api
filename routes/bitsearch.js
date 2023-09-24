const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.post("/", async (req, res) => {
  const { search } = req.body;
  try {
    const search_url = `${process.env.BITSEARCH}/search?q=${search}`;
    const response = await axios.get(search_url);
    const $ = cheerio.load(response.data);
    let torrents = [];
      const $search = $("li.search-result");
      for (let i = 0; i < $search.length; i++) {
        const torrent = $search[i];
        const torrent_name = $(torrent).find("h5").text().trim();
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
