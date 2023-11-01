const router = require("express").Router();
const cheerio = require("cheerio");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
const filterTorrents = require("../filterTorrents");

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

router.post("/", async (req, res) => {
  const { search } = req.body;
  const PIRATEIRO = process.env.PIRATEIRO;
  const search_url = `${PIRATEIRO}/search?query=${search}`;
  try {
    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      headless: "new",
    });
    const page = await browser.newPage();
    await page.goto(search_url);
    const pageContent = await page.content();
    const $ = cheerio.load(pageContent);
    const $element = $("ul");
    let torrents = [];
    for (const torrent of $element.find("a")) {
      const torrent_name = $(torrent).find(".pt-title").text().trim();
      const Seeders = $(torrent).find(".btn-seed-home").text().trim();
      const Leechers = $(torrent).find(".btn-leech-home").text().trim();
      const url = $(torrent).attr("href");
      await page.goto(url);
      const Magnet = await page.evaluate(() => {
        const magnet_lnk = document
          .querySelector('a[href^="magnet:?xt=urn:btih"]')
          .getAttribute("href");
        return magnet_lnk;
      });
      const Size = await page.evaluate(() => {
        const size = document.querySelector(".single-size").textContent;
        return size;
      });
      await browser.close();
      torrents.push({
        Name: torrent_name,
        Magnet,
        Size,
        Seeders,
        Leechers,
      });
    }
    filterTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
