const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

const Search = require("./models/scrapeModel");
const PCG = require("./models/pcgModel");

module.exports = { Search, PCG };
