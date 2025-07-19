const mongoose = require("mongoose");

const visitedCitiesSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City"
  },
  date: Date,
  notes: String
}, {_id:true})

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  email: {
    type: String, 
    required: true,
    unique:true
  },
  password:String,
  citiesVisited:[visitedCitiesSchema]
})

const userModel = new mongoose.model("User", userSchema);
module.exports = userModel;