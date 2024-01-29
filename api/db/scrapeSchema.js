const mongoose = require("mongoose");

const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI);

const Search = require("./models/scrapeModel");

module.exports = { Search };
