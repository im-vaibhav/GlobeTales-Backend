const UserModel = require("./../models/userModel")
const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt")
exports.signup = async (req, res) => {

  try {
    const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      status: "fail",
      message:"Fill all the details"
    })
  }

  const user = await UserModel.findOne({email});
  if (user) {
    return res.status(400).json({
      status: "fail",
      message: "User already exists with this email",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      status: "fail",
      message: "Password too short",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await UserModel.create({
    name,
    email,
    password:hashedPassword,
  })

  const token = jwt.sign({ id: newUser._id }, "MYSECRET", {
    expiresIn: "1h",
  });

  res
    .header("Authorization", `Bearer ${token}`)
    .status(201)
    .json({
      status: "success",
      token,
      user: { id: newUser._id, name: newUser.name },
    });
  }
  catch (err){
    res.status(500).json({
      message:err.message
    })
  }
};
 

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both fields are present
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Details Missing",
      });
    }

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid Credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, "MYSECRET", { expiresIn: "1h" });

    // Send response
    res
      .header("Authorization", `Bearer ${token}`)
      .status(200)
      .json({
        status: "success",
        token,
        user: { id: user._id, name: user.name },
      });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
