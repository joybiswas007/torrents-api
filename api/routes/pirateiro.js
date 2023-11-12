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
  try {
    const search_url = `${process.env.PIRATEIRO}/search?query=${search}`;
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
      const Name = $(torrent).find(".pt-title").text().trim();
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
      torrents.push({
        Name,
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
