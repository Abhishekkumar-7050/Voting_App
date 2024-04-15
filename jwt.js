const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtAuthMiddleware = (req, res, next) => {

const authorization = req.headers.authorization;
if( !authorization) return res.status(401).json({error:"Token not Found"});

  // Extract the jwt token from request header
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthrized" });

  try {
    // verify the jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user information to request object
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "invalid token" });
  }
};
// function generate token
const generateToken = function (userData){
  // generate a new jwt token using user data
  return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:300000});
};

module.exports = {generateToken, 
               jwtAuthMiddleware}

