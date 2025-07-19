const CityModel=require("./../models/citiesModel")
const UserModel=require("./../models/userModel")

// {
//   "id": 1,
//   "cityName": "Gurugram",
//   "country": "India",
//   "emoji": "🇮🇳",
//   "date": "2025-07-03T00:13:51.443Z",
//   "notes": "",
//   "position": {
//     "lat": "28.424976670137422",
//     "lng": "76.99357851232588"
//   }
// },

exports.getAllCities = async (req, res) => {
  try {
  const userID = req.userId;
  const user = await UserModel.findOne({ _id: userID });
  if (!user) {
    return res.status(401).json({
      message: "user does not exist",
    });
  }
    const data = await user.populate('citiesVisited.city');
   

    const formattedCities = user.citiesVisited.map((visit) => ({
      id: visit._id.toString(), // Use MongoDB ObjectId for future lookup
      cityName: visit.city.cityName,
      country: visit.city.country,
      emoji: visit.city.emoji,
      date: visit.date,
      notes: visit.notes,
      position: {
        lat: visit.city.position.lat,
        lng: visit.city.position.lng,
      },
    }));
  res.status(200).json({
    status: "success",
    data: {
      formattedCities
    }
  })
  }
  catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
  
}

// exports.createCity = async (req, res) => {
//   try {
//     const userID = req.userId;
//     const { cityName, country, emoji, date, notes, position } = req.body;
//      if (
//         !cityName ||
//         !country ||
//         !emoji ||
//         !date ||
//         !position?.lat ||
//         !position?.lng
//       ) {
//         return res
//           .status(400)
//           .json({ status: "fail", message: "Missing required fields" });
        
//     }
//     let existing = await CityModel.findOne({ cityName, countryName: country });
//     if (!existing) {
//       const newCity = {
//         cityName,
//         country,
//         emoji,
//         position: {
//           lat: position.lat,
//           lng: position.lng,
//         },
//       };
  
//       existing = await CityModel.create(newCity);
//     }
   
//     const user = await UserModel.findOne({ _id: userID });
//     if (!user) {
//       return res.status(401).json({
//         message: "user does not exist",
//       });
//     }
//     user.citiesVisited.push({
//       city: existing._id,
//       date: new Date(),
//       notes
//     });
//     await user.save();
  
//     return res.status(201).json({
//       status: "success",
//       message: "City visit saved successfully",
//       data: {
//         city: existing,
//         visited: { city: existing._id, date, notes },
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// }

exports.createCity = async (req, res) => {
  try {
    const userID = req.userId;
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

    let existing = await CityModel.findOne({
      cityName,
      countryName: country,
    });

    if (!existing) {
      existing = await CityModel.create({
        cityName,
        country,
        emoji,
        position: {
          lat: position.lat,
          lng: position.lng,
        },
      });
    }

    const user = await UserModel.findById(userID);
    if (!user) {
      return res.status(401).json({ message: "user does not exist" });
    }

    const newVisit = {
      city: existing._id,
      date: new Date(date),
      notes: notes || "",
    };

    user.citiesVisited.push(newVisit);
    await user.save();

    const savedVisit = user.citiesVisited[user.citiesVisited.length - 1]; // Get last added visit

    return res.status(201).json({
      status: "success",
      data: {
        id: savedVisit._id.toString(),
        cityName: existing.cityName,
        country: existing.country,
        emoji: existing.emoji,
        date: savedVisit.date,
        notes: savedVisit.notes,
        position: {
          lat: existing.position.lat,
          lng: existing.position.lng,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};


// exports.getCity = async (req, res) => {
//   try {
//     const user = await UserModel.findById(req.userId).populate(
//       "citiesVisited.city"
//     );

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const visit = user.citiesVisited.id(req.params.visitId);

//     if (!visit) {
//       return res.status(404).json({ error: "Visit not found" });
//     }

//     res.status(200).json({ status: "success", data: visit });
//   } catch (err) {
//     console.error("Error in getCity:", err.message);
//     res.status(500).json({ status: "fail", message: "Server Error" });
//   }
// };


exports.getCity = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).populate(
      "citiesVisited.city"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const visit = user.citiesVisited.id(req.params.visitId);

    if (!visit) {
      return res.status(404).json({ error: "Visit not found" });
    }

    const city = visit.city;

    const formattedVisit = {
      id: visit._id.toString(),
      cityName: city.cityName,
      country: city.country,
      emoji: city.emoji,
      date: visit.date,
      notes: visit.notes || "",
      position: {
        lat: city.position.lat,
        lng: city.position.lng,
      },
    };

    res.status(200).json({ status: "success", data: formattedVisit });
  } catch (err) {
    console.error("Error in getCity:", err.message);
    res.status(500).json({ status: "fail", message: "Server Error" });
  }
};

exports.deleteCity = async (req, res) => {
  try {
    const user = await UserModel.findOne({_id:req.userId});
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message:"User not found"
      })
    }
    console.log("hola");
    const index = user.citiesVisited.findIndex(curr => curr._id.toString() === req.params.visitId)
    if (index === -1) return res.status(404).json({ error: "Visit not found" });
    user.citiesVisited.splice(index, 1);
    await user.save();
    res.json({ message: "Visit deleted" });
  }
  catch (err) {
    res.status(500).json({ status: "fail", message: "Server Error" });
  }
}