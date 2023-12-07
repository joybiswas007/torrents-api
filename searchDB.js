const router = require("express").Router();
const { Search } = require("./db/scrapeSchema");

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

router.post("/", async (req, res) => {
  try {
    const { search } = req.body;
    const escapedUserInput = escapeRegExp(search);
    const modifiedInput = escapedUserInput.replace(/[\s.]/g, "[\\s.]*");
    const regex = new RegExp(`^${modifiedInput}`, "gi");
    const query = await Search.find({ Name: regex });
    if (query.length > 0) {
      res.status(202).send(query);
    } else {
      res.status(404).send({ error: "No match found! Try again." });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
