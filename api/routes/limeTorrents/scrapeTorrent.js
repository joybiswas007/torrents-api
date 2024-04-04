const axios = require("axios");
const cheerio = require("cheerio");
const headers = require("../../utils/headers");

const { LIME_TORRENTS } = process.env;

const scrapeTorrent = async (torrent, $) => {
  const Name = $(torrent).find("a").last().text().trim();
  const torrentUrl = $(torrent).find("a").last().attr("href");
  const Size = $(torrent).find(".tdnormal").last().text().trim();
  const Seeders = parseInt($(torrent).find(".tdseed").text().trim(), 10);
  const Leechers = parseInt($(torrent).find(".tdleech").text().trim(), 10);
  // Got to torrent details page and find magnet
  const Url = `${LIME_TORRENTS}${torrentUrl}`;
  const magnetPage = await axios.get(Url, { headers });
  const magnetLink = cheerio.load(magnetPage.data);
  const Magnet = magnetLink('a[href^="magnet:?xt=urn:btih"]').attr("href");
  return {
    Name,
    Size,
    Seeders,
    Leechers,
    Url,
    Magnet
  };
};

module.exports = scrapeTorrent;
