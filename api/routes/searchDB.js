const router = require("express").Router();
const { Search } = require("../db/scrapeSchema");
const logger = require("../config/logger");

router.post("/", async (req, res) => {
  try {
    const { search } = req.body;
    const query = await Search.find({
      Name: {
        $regex: search,
        $options: "i"
      }
    });
    if (query.length > 0) {
      return res.status(202).send({ statusCode: 200, query });
    }
    res
      .status(404)
      .send({ statusCode: 404, error: "No match found! Try again." });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
