const axios = require("axios");
const cheerio = require("cheerio");
const headers = require("../../utils/headers");

const { TOR_LOCK } = process.env;

const scrapeTorrent = async (torrent, $) => {
  const Name = $(torrent).find("a b").text();
  const Size = $(torrent).find(".ts").text();
  const Seeders = parseInt($(torrent).find(".tul").text(), 10);
  const Leechers = parseInt($(torrent).find(".tdl").text(), 10);

  // Visit every torrent link and fetch magnet link
  const findUrl = $(torrent).find("a").attr("href");
  const Url = `${TOR_LOCK}${findUrl}`;
  const magnetPage = await axios.get(Url, { headers });
  const magnetData = cheerio.load(magnetPage.data);
  const Magnet = magnetData("h4 a").eq(0).attr("href");

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
