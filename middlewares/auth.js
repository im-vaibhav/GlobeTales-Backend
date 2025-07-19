const jwt=require("jsonwebtoken")

exports.authUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Please Login" });
  }
  try {
    const decoded = jwt.verify(token, "MYSECRET");
    req.userId = decoded.id;
    next();
  }
  catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
}