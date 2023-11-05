const router = require("express").Router();
const axios = require("axios");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
const cheerio = require("cheerio");
const headers = require("../headers");

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

router.post("/", async (req, res) => {
  const { search } = req.body;
  const PC_GAMES_TOR = process.env.PC_GAMES_TOR;
  try {
    const search_url = `${PC_GAMES_TOR}/?s=${search}`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    const $element = $("main");
    let torrents = [];
    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      headless: "new",
    });
    for (const torrent of $element.find("article")) {
      const torrent_name = $(torrent).find(".uk-article-title a").text().trim();
      const Url = $(torrent).find(".uk-article-title a").attr("href");
      //Visit the url to grab magnet links
      const $magnet_search = await axios.get(Url);
      const $magnet_data = cheerio.load($magnet_search.data);
      const $magnet_link = $magnet_data("main article .uk-card a").attr("href");
      const page = await browser.newPage();
      await page.goto($magnet_link);
      // Wait for 6 seconds using a Promise and setTimeout
      await new Promise((resolve) => setTimeout(resolve, 6000));
      const url_data = await page.evaluate(() => {
        const magnet_data = document
          .querySelector("#url")
          .getAttribute("value");
        return magnet_data;
      });
      const anotherPage = await browser.newPage();
      await anotherPage.goto(`${process.env.PC_GAMES_MAGNET}?url=${url_data}`);

      const Magnet = await anotherPage.evaluate(() => {
        const magnet = document.querySelector("input").getAttribute("value");
        return magnet;
      });
      torrents.push({
        Name: torrent_name,
        Magnet,
        Url,
      });
    }
    await browser.close();
    if (torrents.length > 0) {
      res.status(202).send(torrents);
    } else {
      res.status(404).send({ error: "No magnets found :(" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
