const axios = require("axios");
const cheerio = require("cheerio");

const scrapeTorrent = async (torrent, $, headers) => {
  const Name = $(torrent).find(".pt-title").text().trim();
  const Seeders = parseInt($(torrent).find(".btn-seed-home").text().trim(), 10);
  const Leechers = parseInt(
    $(torrent).find(".btn-leech-home").text().trim(),
    10
  );
  const Url = $(torrent).attr("href");

  const torrentPage = await axios.get(Url, headers);
  const info = cheerio.load(torrentPage.data);
  const Size = info(".single-size").text().trim();
  const Magnet = info("a[href^=\"magnet:?xt=urn:btih\"]").attr("href");
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
