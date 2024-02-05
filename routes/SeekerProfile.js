const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateToken } = require("../middleware/Authmiddleware");

/* router.get("/", async (req, res) => {
  //const { id, username } = req.body;
  const user = await Users.findOne({ where: { id: 1 } }); //try catch

  res.json(user);
}); */

router.get("/", validateToken, async (req, res) => {
  // Extract user ID and username from the decoded token

  const userId = req.userToken.id;
  const user = await Users.findOne({ where: { id: userId } });
  //try catch err 500
  res.json(user);
});

router.put("/:Id", validateToken, async (req, res) => {
  try {
    const userId = req.userToken.id;

    // Check if the logged-in user is the same as the one being updated
    if (userId != req.params.Id) {
      return res.status(403).json({
        error: `Forbidden - You can only update your own profile. Current userId:${userId}-${req.params.Id}`,
      });
    }

    // Update user profile in the database
    await Users.update(req.body, {
      where: { id: userId },
    });

    // Fetch and return the updated user profile
    const updatedUser = await Users.findOne({
      where: { id: userId },
      // Add other attributes as needed
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
