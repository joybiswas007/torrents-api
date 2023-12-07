const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

const Search = require("./models/scrapeModel");

module.exports = { Search };
