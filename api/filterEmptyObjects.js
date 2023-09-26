// Filter torrents array and remove empty objects
const filterEmptyObjects = (torrents) => {
  return torrents.filter((torrent) => {
    return (
      torrent.Name !== undefined &&
      torrent.Name !== "" &&
      torrent.Magnet !== undefined &&
      torrent.Magnet !== "" &&
      torrent.Size !== undefined &&
      torrent.Size !== "" &&
      torrent.Seeders !== undefined &&
      torrent.Seeders !== "" &&
      torrent.Leechers !== undefined &&
      torrent.Leechers !== ""
    );
  });
};

module.exports = filterEmptyObjects;
