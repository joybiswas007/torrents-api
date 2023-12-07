const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../filterTorrents");
const scrapeTorrent = require("./scrapeTorrent");

const headers = {
  headers: {
    Cookie: process.env.PIRATEIRO_COOKIE,
    "User-Agent": process.env.USER_AGENT,
  },
};

router.post("/", async (req, res) => {
  try {
    const { PIRATEIRO } = process.env;
    const { search } = req.body;
    const searchUrl = `${PIRATEIRO}/search?query=${search}`;
    const response = await axios.get(searchUrl, headers);
    const $ = cheerio.load(response.data);
    const $element = $("ul");
    const torrents = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const torrent of $element.find("a")) {
      // eslint-disable-next-line no-await-in-loop
      const torrentDetails = await scrapeTorrent(torrent, $, headers);
      torrents.push(torrentDetails);
    }
    filterTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
