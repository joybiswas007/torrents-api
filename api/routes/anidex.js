const router = require("express").Router();
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const filterTorrents = require("../filterTorrents");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const ANIDEX = process.env.ANIDEX;
  try {
    const search_url = `${ANIDEX}/?q=${search}`;
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(search_url);
    // Wait for 5 seconds using a Promise and setTimeout
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const pageContent = await page.content();
    const $ = cheerio.load(pageContent);
    const $element = $("table tbody");
    let torrents = [];
    for (const torrent of $element.find("tr")) {
      const torrent_name = $(torrent).find(".torrent .span-1440").text().trim();
      const Magnet = $(torrent)
        .find('a[href^="magnet:?xt=urn:btih"]')
        .attr("href");
      const Size = $(torrent).find("td").eq(6).text().trim();
      const Seeders = $(torrent).find("td").eq(8).text().trim();
      const Leechers = $(torrent).find("td").eq(9).text().trim();
      torrents.push({
        Name: torrent_name,
        Magnet,
        Size,
        Seeders,
        Leechers,
      });
    }
    filterTorrents(res, torrents);
    await browser.close();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
