const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../filterTorrents");
const scrapeTorrent = require("./scrapeTorrent");

router.post("/", async (req, res) => {
  try {
    const { TORRENT_GALAXY, TGX_COOKIE, USER_AGENT } = process.env;
    const { search } = req.body;
    const headers = {
      headers: {
        "Content-Type": "text/html",
        Cookie: TGX_COOKIE,
        "User-Agent": USER_AGENT,
      },
    };
    const searchUrl = `${TORRENT_GALAXY}/torrents.php?search=${search}`;
    const response = await axios.get(searchUrl, headers);
    const $ = cheerio.load(response.data);
    const torrentTable = $(".tgxtable");
    const torrents = [];
    for (const torrent of torrentTable.find(".tgxtablerow")) {
      const torrentDetails = scrapeTorrent(TORRENT_GALAXY, torrent, $);
      torrents.push(torrentDetails);
    }
    filterTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
