const express = require("express");
const router = express.Router();
const { JobInfos, Applications } = require("../models");
const { validateToken } = require("../middleware/Authmiddleware");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  try {
    const listOfJobs = await JobInfos.findAll({
      attributes: [
        "JobID",
        "CompanyID",
        "Title",
        "Description",
        "Location",
        "Requirements",
        "PostedDate",
        "StartDate",
        "EndDate",
        "SalaryRange",
        "CompanyLogo",
        "createdAt",
        "updatedAt",
      ],
      order: [["JobID", "DESC"]], // Use 'JobID' or the correct column name you want to order by
      limit: 5,
    });
    res.json(listOfJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/byId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const job = await JobInfos.findByPk(id);
    if (!job) {
      res.status(404).json({ error: "Job not found" });
    } else {
      res.json(job);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", validateToken, async (req, res) => {
  try {
    const {
      CompanyID,
      Title,
      Description,
      Location,
      Requirements,
      PostedDate,
      StartDate,
      EndDate,
      SalaryRange,
      CompanyLogo,
    } = req.body;

    // Validate that required fields are present
    if (!CompanyID || !Title || !Description || !PostedDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const userId = req.userToken.id;
    const createdJob = await JobInfos.create({
      CompanyID,
      Title,
      Description,
      Location,
      Requirements,
      PostedDate,
      StartDate,
      EndDate,
      SalaryRange,
      CompanyLogo,
    });

    res.status(201).json(createdJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/apply", validateToken, async (req, res) => {
  try {
    const { JobID, CandidateID, ApplicationDate, Status, Resume } = req.body;
    if (!JobID || !CandidateID || !ApplicationDate || !Status) {
      return res.status(400).json({ error: "Missing Application data" });
    }
    const application = await Applications.create({
      JobID,
      CandidateID,
      ApplicationDate,
      Status,
      Resume,
    });

    res.status(200).json(application);
  } catch (error) {
    console.error("Error creating job application:", error);

    // Check for specific Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      // If validation error, return 400 Bad Request with error details
      return res
        .status(400)
        .json({ error: "Validation error", details: error.errors });
    }

    // Return 500 for any other unexpected error
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/update/:id", validateToken, async (req, res) => {
  try {
    const updatedJob = await JobInfos.update(req.body, {
      where: { JobID: req.params.id },
    });
    // Check if the id is provided to determine if it's an update

    res.json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
