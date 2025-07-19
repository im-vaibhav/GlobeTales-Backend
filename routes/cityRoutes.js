const express = require("express");
const { getAllCities, createCity, getCity, deleteCity } = require("./../controllers/cityController")

const router = express.Router();

router
  .route("/")
  .get(getAllCities) 
  .post(createCity); 

  router
    .route("/:visitId")
    .get( getCity)
    .delete( deleteCity);
module.exports = router
