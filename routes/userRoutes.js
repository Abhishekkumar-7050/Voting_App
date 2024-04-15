const express = require("express");

const router = express.Router();
const User = require("../models/User");
const { generateToken, jwtAuthMiddleware } = require("../jwt.js");

router.post("/signup", async (req, res) => {
    try {
      const data = req.body;
      const newUser = new User(data);
      const respons = await newUser.save();
      console.log("save sucsessfully");
      const payload = {
        id: respons.id,
        
      };
      const token = generateToken(payload);
      // console.log(" token is", token);
      res.status(200).json({ Respons: respons, Token: token });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: "internal server error" });
    }
  })


  router.post("/login", async (req, res) => {
    try {
      // extract the username and password from the body
      const { aadharCardNumer, password } = req.body;
  
      const user = await User.findOne({ aadharCardNumer: aadharCardNumer });
      //  if(!user){
      //   res.status(401).json({error:" user is not present"})
      //  }
      if (!user || !(await user.comparePassword(password))) {
        console.log(" invlaid user name and password");
        return res.status(401).json({ error: "Invalid username and password" });
      }
      // generate token
      const payload = {
        id: user.id,
    
      };
      const token = generateToken(payload);
      res.json({ token });
    } catch (error) {
      console.log(error, "error");
      res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
    try {
      const userdata = req.user; // jwt file se useridmil rahi hogi
      const userId = userdata.id;
    
      const user = await User.findById(userId);
      if( !user){
        return res.status(401).send("user not found");
      }
       res.status(201).send(user);
    } catch (error) {
      console.log(error);
      res.status(501).json(error, "internal server error");
    }
  });

  router.put("/profile/password",jwtAuthMiddleware, async (req, res) => {
    try {
      const userId = req.user; // Extract the id from token
      const {currentPassword, newPassword} = req.body;

   const user = await User.findById(userId);
   if ( !(await user.comparePassword(currentPassword))) {
    // console.log(" invlaid user name and password");
    return res.status(401).json({ error: "Invalid username and password" });
  }
     user.password  = newPassword;
     await user.save();
      return res.status(200).json({ message:"Password Updated"});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "internal server error" });
    }
  });


  module.exports = router