const router = require("express").Router();
const { Search } = require("../db/scrapeSchema");
const logger = require("../configs/logger");

router.post("/", async (req, res) => {
  try {
    const { search } = req.body;
    const query = await Search.find({
      Name: {
        $regex: search,
        $options: "i"
      }
    }).select("_id Name Size Seeders Leechers Magnet Url");
    if (query.length > 0) {
      return res.status(200).send({ statusCode: 200, torrents: query });
    }
    res
      .status(200)
      .send({ statusCode: 200, error: "No match found! Try again." });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ statusCode: 500, error: error.message });
  }
});

module.exports = router;
