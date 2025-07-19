const mongoose = require("mongoose");
const citySchema = new mongoose.Schema({
  cityName: String,
  countryName: String,
  emoji: String,
  position: {
    lat:String,
    lng:String
  }
})
const cityModel = mongoose.model("City", citySchema);
module.exports = cityModel;