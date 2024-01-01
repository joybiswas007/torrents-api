const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../filterTorrents");
const scrapeTorrent = require("./scrapeTorrent");
const logger = require("../../../logger");

const headers = {
  headers: {
    Cookie: process.env.PIRATEIRO_COOKIE,
    "User-Agent": process.env.USER_AGENT
  }
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
    for (const torrent of $element.find("a")) {
      const torrentDetails = await scrapeTorrent(torrent, $, headers);
      torrents.push(torrentDetails);
    }
    filterTorrents(res, torrents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
