const { Search } = require("../db/scrapeSchema");

const filterTorrents = (res, torrents) => {
  const filteredTorrents = torrents.filter(torrent => torrent.Seeders !== 0);
  if (filteredTorrents.length > 0) {
    filteredTorrents.map(async search => {
      const { Name, Size, Seeders, Leechers, Magnet, Url } = search;
      const existingRecord = await Search.findOne(
        Url ? { Url } : { Name, Size }
      );
      if (!existingRecord) {
        const data = new Search({
          Name,
          Size,
          Seeders,
          Leechers,
          Magnet,
          Url
        });
        await data.save();
      } else {
        const updateFields = {};
        if (existingRecord.Seeders !== Seeders) {
          updateFields.Seeders = Seeders;
        }
        if (existingRecord.Leechers !== Leechers) {
          updateFields.Leechers = Leechers;
        }
        if (Object.keys(updateFields).length > 0) {
          await Search.updateOne(
            { _id: existingRecord._id },
            { $set: updateFields }
          );
        }
      }
    });
    res.status(202).send(filteredTorrents);
  } else {
    res.status(404).send({ error: "No magnets found :(" });
  }
};

module.exports = filterTorrents;
