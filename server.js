const express = require("express");
const cors = require("cors");
const userRouter=require("./routes/userRoutes")
const cityRouter=require("./routes/cityRoutes")
const app = express();
const mongoose = require("mongoose");
const { authUser } = require("./middlewares/auth");
require("dotenv").config();

//MIDDLEWARE
app.use(cors());
app.use(express.json());

//MONGODB CONFIG 
const mongoURI = process.env.MONGO_DB_URI; 
const connectDB = async () => { 
  try {
    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

//API ENDPOINTS
app.use("/api/user", userRouter);
app.use("/api/city",authUser, cityRouter);


app.get("/api", (req, res) => {
  res.json({
    message: "API Working",
  });
});


//Starting the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log("Server Started");
});