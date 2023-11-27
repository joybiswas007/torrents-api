const mongoose = require("mongoose");
const { schemaOptions } = require("../config");

const pcgamesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    genre: {
      type: Array,
      required: true,
    },
    release_date: {
      type: String,
      required: true,
    },
    magnet: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
  },
  schemaOptions
);

const PCG = mongoose.model("Pcgamestorrent", pcgamesSchema);

module.exports = PCG;
