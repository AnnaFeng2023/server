const express = require("express");
const router = express.Router();
const { Applications, Users } = require("../models");
const { validateToken } = require("../middleware/Authmiddleware");

router.get("/", async (req, res) => {
  const listOfApplications = await Applications.findAll({
    limit: 5,
    order: [["id", "DESC"]],
  });
  res.json(listOfApplications);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const applied = await Applications.findByPk(id); //try catch, 500
  //if no art, 404
  res.json(applied);
});

const allowedStatusValues = ['Applied', 'In Review', 'Accepted', 'Rejected'];

router.post("/", validateToken, async (req, res) => {
  try {
    const { JobID, CandidateID, ApplicationDate, Status, Resume } = req.body;

    if (!JobID || !CandidateID || !ApplicationDate || !Status) {
      return res.status(400).json({ error: "Missing Application data" });
    }

    // Validate Status field
    if (!allowedStatusValues.includes(Status)) {
      return res.status(400).json({ error: "Invalid Status value" });
    }

    const newApplication = await Applications.create(req.body);

    // Respond with the newly created application data
    res.status(200).json(newApplication);
  } catch (error) {
    console.error("Error creating job application:", error);

    // Check for specific Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      // If validation error, return 400 Bad Request with error details
      return res
        .status(400)
        .json({ error: "Validation error", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
