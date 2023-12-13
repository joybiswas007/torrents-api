const axios = require("axios");
const cheerio = require("cheerio");

const scrapeTorrent = async (ONE337X, tr, $) => {
  const Name = $(tr).find(".coll-1.name a").last().text().trim();
  const Url = `${ONE337X}${$(tr).find(".coll-1.name a").last().attr("href")}`;
  const Seeders = parseInt($(tr).find(".coll-2.seeds").text().trim(), 10);
  const Leechers = parseInt($(tr).find(".coll-3.leeches").text().trim(), 10);
  const Size = $(tr).find(".coll-4.size").text().trim().replace(Seeders, "");
  const magnetPage = await axios.get(Url);
  const magnetLink = cheerio.load(magnetPage.data);
  const Magnet = magnetLink("a[href^=\"magnet:?xt=urn:btih\"]").attr("href");

  return {
    Name,
    Size,
    Seeders,
    Leechers,
    Url,
    Magnet,
  };
};

module.exports = scrapeTorrent;
