const scrapeTorrent = (LINUX_TRACKER, torrent, $) => {
  const Name = $(torrent).find("td").eq(1).find("strong").eq(0).text().trim();
  const findUrl = $(torrent).find("td").eq(1).find("a").eq(0).attr("href");
  const Url = `${LINUX_TRACKER}/${findUrl}`;
  const infos = $(torrent).find("table tbody").eq(0);
  const Size = $(infos)
    .find("tr")
    .eq(1)
    .find("td")
    .text()
    .replace("Size: ", "")
    .trim();
  const Seeders = parseInt(
    $(infos).find("tr").eq(2).find("td").text().replace("Seeds ", "").trim(),
    10
  );
  const Leechers = parseInt(
    $(infos).find("tr").eq(3).find("td").text().replace("Leechers ", "").trim(),
    10
  );
  const Magnet = $(infos)
    .find("tr")
    .eq(4)
    .find("td")
    .eq(1)
    .find("a")
    .attr("href");
  return {
    Name,
    Size,
    Magnet,
    Url,
    Seeders,
    Leechers
  };
};

module.exports = scrapeTorrent;
