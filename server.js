const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "DATA", "cities.json");


function readCities() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeCities(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

//Get all cities
app.get("/cities", (req, res) => {
  const cities = readCities();
  res.status(200).json({
    status: "success",
    data: cities,
  });
});


//Get city
app.get("/cities/:id", (req, res) => {
  const cities = readCities();
  const id = parseInt(req.params.id);
  const city = cities.find((c) => c.id === id);

  if (!city) {
    return res.status(404).json({ status: "fail", message: "City not found" });
  }

  res.status(200).json({ status: "success", data: city });
});


// POST a new city
app.post("/cities", (req, res) => {
  const { cityName, country, emoji, date, notes, position } = req.body;

  if (
    !cityName ||
    !country ||
    !emoji ||
    !date ||
    !position?.lat ||
    !position?.lng
  ) {
    return res
      .status(400)
      .json({ status: "fail", message: "Missing required fields" });
  }

  const cities = readCities();
  const newCity = {
    id: cities.length ? cities[cities.length - 1].id + 1 : 1,
    cityName,
    country,
    emoji,
    date,
    notes,
    position,
  };

  cities.push(newCity);
  writeCities(cities);

  res.status(201).json({ status: "success", data: newCity });
});

//Delete a city
app.delete("/cities/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let cities = readCities();

  const cityExists = cities.some((c) => c.id === id);
  if (!cityExists) {
    return res.status(404).json({ status: "fail", message: "City not found" });
  }

  cities = cities.filter((c) => c.id !== id);
  writeCities(cities);

  res.status(204).end();
});


// Root route for testing
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Pass",
    data: {
      app: "Globe-Tales Backend",
    },
  });
});


//Starting the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log("Server Started");
});
