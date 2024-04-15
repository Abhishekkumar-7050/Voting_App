const express = require("express");
const User = require("../models/User.js");
const router = express.Router();
const Candidate = require("../models/Candidate.js");

const { jwtAuthMiddleware } = require("../jwt.js");

const checkadmin = async (userid) => {
  try {
    const user = await User.findById(userid);
    return user.role === "admin";
  } catch (error) {
    return false;
  }
};

router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkadmin(req.user.id))) {
      return res.status(404).json({ message: "user has not a admin role" });
    }

    const data = req.body; // assuming req.body containing the candidate data
    const newCandidate = new Candidate(data);
    const respons = await newCandidate.save();
    console.log("save sucsessfully");
    return res.status(200).json({ respons: respons });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "internal server error" });
  }
});

router.put("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!checkadmin(req.user.id)) {
      return res.status(403).json({ message: "user has not a admin role" });
    }
    const candidateId = req.params.id;
    const dataToupadate = req.body;

    const updatedCandidateData = await Person.findByIdAndUpdate(
      candidateId,
      dataToupadate,
      {
        new: true, // return updated document
        runValidators: true, // run mongoose validations
      }
    );
    if (!updatedPersonData) {
      return res.status(404).json({ error: "Candidate  Not Found" });
    }

    console.log(" Candidate data updated");
    return res.status(200).json(updatedPersonData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.delete("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!checkadmin(req.user.id)) {
      return res.status(403).json({ message: "user has not a admin role" });
    }
    const candidateId = req.params.id;

    const respons = await Person.findByIdAndDelete(candidateId);
    if (!updatedPersonData) {
      return res.status(404).json({ error: "Candidate  Not Found" });
    }
    if (!respons) {
      return res.status(404).json({ error: "candidate not Found" });
    }
    console.log(" candidate Deleted");
    return res.status(200).json(respons);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.post("/vote/:candidatID", jwtAuthMiddleware, async (req, res) => {
  // no admin can vote
  // user can vote once

  const candidateId = req.params.candidatID;
  const userId = req.user.id;

  try {
    // find candidate document
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: " candidate not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: " user not found not found" });
    }
    if (user.isVoted) {
      res.status(403).json({ message: " You have already voted" });
    }
    if (user.role == "admin") {
      res.status(403).json({ message: " admin is not allowed to vote" });
    }
    // update the candidate document to record the vote
    candidate.votes.push({ user: userId });
    candidate.voteCount++;

    await candidate.save();
    // update the user document
    user.isVoted = true;
    await user.save();
    return res.status(201).json({ message: "Vote recorded Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/vote/count", async (req, res) => {
  try {
    // find all candidate and sort them by vote count in decending order
    const candidate = await Candidate.find().sort({ voteCount: "desc" });
    const voteRecord = candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });
    return res.status(201).json(voteRecord);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/getcandidate", async (req, res) => {
  try {
    const respons = await Candidate.find();
    if (!respons) {
      return res.send(403).json({ message: "No Cndidate present" });
    } else {
      const candidates = respons.map((data) => {
        // console.log(data.name);
        // console.log(data.party);
        return{
        name: data.name,
         party: data.party
        }
      });
      return res.status(201).json({candidates:candidates} );
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
