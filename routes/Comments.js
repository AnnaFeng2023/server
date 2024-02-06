const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middleware/Authmiddleware");

router.get("/:companyId", async (req, res) => {
  const companyId = req.params.companyId; // Use correct parameter name companyId

  try {
    const comments = await Comments.findAll({
      where: { CompanyID: companyId },
    });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", validateToken, async (req, res) => {
  try {
    const { CompanyID, Rating, Comment } = req.body;

    // Validate that required fields are present
    if (!CompanyID || !Rating || !Comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const createdComment = await Comments.create({
      CompanyID: CompanyID,
      Rating: Rating,
      Comment: Comment,
      PostDate: new Date(),
    });

    res.status(201).json(createdComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
