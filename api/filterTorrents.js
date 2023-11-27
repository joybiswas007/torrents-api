const { Search } = require("./../db/scrapeSchema");

//Filter dead torrents and exclude them in results and save in DB
// If data is already present in db then don't save it just return the result

const filterTorrents = (res, torrents) => {
  const filteredTorrents = torrents.filter((torrent) => torrent.Seeders !== 0);
  if (filteredTorrents.length > 0) {
    filteredTorrents.map(async (search) => {
      const existingRecord = await Search.findOne({
        Name: search.Name,
        Size: search.Size,
        Seeders: search.Seeders,
      });
      if (!existingRecord) {
        const scrape = new Search({
          Name: search.Name,
          Size: search.Size,
          Seeders: search.Seeders,
          Leechers: search.Leechers,
          Magnet: search.Magnet,
        });
        await scrape.save();
      }
    });
    res.status(202).send(filteredTorrents);
  } else {
    res.status(404).send({ error: "No magnets found :(" });
  }
};

module.exports = filterTorrents;
