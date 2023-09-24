const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const PC_GAMES_TORRENTS = process.env.PC_GAMES_TORRENTS;
  try {
    const search_url = `${PC_GAMES_TORRENTS}/?s=${search}`;
    const response = await axios.get(search_url);
    const $ = cheerio.load(response.data);
    const $element = $("main");
    let torrents = [];
    for (const torrent of $element.find("article")) {
      const torrent_name = $(torrent).find(".uk-article-title a").text().trim();
      const Url = $(torrent).find(".uk-article-title a").attr("href");
      //Visit the url to grab magnet links
      const $magnet_search = await axios.get(url);
      const $magnet_data = cheerio.load($magnet_search.data);
      const $magnet_link = $magnet_data("main article .uk-card a").attr("href");
      torrents.push({
        Name: torrent_name,
        Url,
        Download_link: $magnet_link,
      });
    }
    if (torrents.length > 0) {
      res.status(202).send(torrents);
    } else {
      res.status(404).send({ error: "No magnets found :(" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;