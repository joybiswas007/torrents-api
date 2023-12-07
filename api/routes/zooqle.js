const router = require('express').Router();
const axios = require('axios');
const cheerio = require('cheerio');
const filterTorrents = require('../filterTorrents');

router.post('/', async (req, res) => {
  const { search } = req.body;
  const ZOOQLE = process.env.ZOOQLE;
  const headers = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': process.env.USER_AGENT,
    },
  };
  try {
    const response = await axios.post(
      `${ZOOQLE}/search/`,
      {
        q: search,
      },
      headers
    );
    const $ = cheerio.load(response.data);
    const $element = $('section table tbody');
    const torrents = [];
    for (const torrent of $element.find('tr')) {
      const Name = $(torrent).find('a').text().trim();
      const Size = $(torrent).find('td').eq(1).text().trim();
      const Seeders = parseInt($(torrent).find('td').eq(2).text().trim());
      const Leechers = parseInt($(torrent).find('td').eq(3).text().trim());
      const id = $(torrent).find('form input').attr('value');
      const page = await axios.post(`${ZOOQLE}/torrent-page/`, { id }, headers);
      const magnet_link = cheerio.load(page.data);
      const Magnet = magnet_link('a[href^="magnet:?xt=urn:btih"]').attr('href');

      torrents.push({
        Name,
        Size,
        Seeders,
        Leechers,
        Magnet,
      });
    }

    if (torrents[0].Magnet === undefined) {
      return res.status(404).send({ error: 'No magnets found :(' });
    }
    filterTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
