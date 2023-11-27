const mongoose = require("mongoose");
const { schemaOptions } = require("../config");

const scrapedDataSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Size: {
      type: String,
      required: true,
    },
    Seeders: {
      type: Number,
      required: true,
    },
    Leechers: {
      type: Number,
      required: true,
    },
    Magnet: {
      type: String,
      required: true,
    },
  },
  schemaOptions
);

const Search = mongoose.model("Search", scrapedDataSchema);

module.exports = Search;
