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
  try {
    const search_url = `${process.env.PC_GAMES_TOR}/?s=${search}`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    const $element = $("main");
    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      headless: "new",
    });
    const torrents = [];
    for (const torrent of $element.find("article")) {
      const name = $(torrent).find(".uk-article-title a").text().trim();
      const url = $(torrent).find(".uk-article-title a").attr("href");
      //Visit the url to grab magnet links
      const torrentPage = await axios.get(url);
      const torrentPageResponse = cheerio.load(torrentPage.data);
      const size = torrentPageResponse("main article .uk-margin-medium-top")
        .eq(1)
        .find("p")
        .eq(15)
        .text()
        .trim()
        .replace("Release Size: ", "")
        .trim();
      const magnet_page = torrentPageResponse("main article .uk-card a").attr(
        "href"
      );
      const genre = torrentPageResponse("main article .uk-margin-medium-top")
        .eq(1)
        .find("p")
        .eq(10)
        .text()
        .trim()
        .replace("Genre: ", "")
        .split(",");
      const release_date = torrentPageResponse(
        "main article .uk-margin-medium-top"
      )
        .eq(1)
        .find("p")
        .eq(9)
        .text()
        .trim()
        .replace("Release Date: ", "")
        .trim();
      const overview = torrentPageResponse(".uk-dropcap").text().trim();
      const page = await browser.newPage();
      await page.goto(magnet_page);
      // Wait for 6 seconds using a Promise and setTimeout
      await new Promise((resolve) => setTimeout(resolve, 6000));
      const url_data = await page.evaluate(() => {
        const magnet_data = document
          .querySelector("#url")
          .getAttribute("value");
        return magnet_data;
      });

      const magnet_response = await axios.get(
        `${process.env.PC_GAMES_MAGNET}?url=${url_data}`,
        headers
      );
      const magnet_link = cheerio.load(magnet_response.data);
      const magnet = magnet_link("input").attr("value");

      torrents.push({
        name,
        url,
        size,
        genre,
        release_date,
        magnet,
        overview,
      });
    }
    if (torrents.length > 0) {
      res.status(202).send(torrents);
    } else {
      res.status(404).send({ error: "No magnets found :(" });
    }
    await browser.close();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
