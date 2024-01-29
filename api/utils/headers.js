require("dotenv").config({ path: "../../.env" });

const headers = {
  headers: {
    "User-Agent": process.env.USER_AGENT
  }
};

module.exports = headers;
