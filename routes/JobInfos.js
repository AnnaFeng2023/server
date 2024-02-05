const express = require("express");
const router = express.Router();
const { JobInfos } = require("../models");
const { validateToken } = require("../middleware/Authmiddleware");

router.get("/", async (req, res) => {
  try {
    const listOfJobs = await JobInfos.findAll({
      attributes: ['JobID', 'CompanyID', 'Title', 'Description', 'Location', 'Requirements', 'PostedDate', 'StartDate', 'EndDate', 'SalaryRange', 'CompanyLogo', 'createdAt', 'updatedAt'],
      order: [['JobID', 'DESC']],  // Use 'JobID' or the correct column name you want to order by
      limit: 5,
    });
    res.json(listOfJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get("/byId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const job = await JobInfos.findByPk(id);
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
    } else {
      res.json(job);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post("/", validateToken, async (req, res) => {
  try {
    const { CompanyID, 
      Title, 
      Description,
      Location,
      Requirements,
      PostedDate,
      StartDate,
      EndDate,
      SalaryRange, 
      CompanyLogo,} = req.body;

    // Validate that required fields are present
    if (!CompanyID || !Title || !Description || !PostedDate) {
      return res.status(400).json({ error: 'Missing required fields' });
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
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post("/byId/:id", validateToken, async (req, res) => {
  try {
    const {
      id,  // Add id to the destructuring assignment
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
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if the id is provided to determine if it's an update
    if (id) {
      const existingJob = await JobInfos.findByPk(id);

      // Check if the job exists
      if (!existingJob) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Update the existing job
      const updatedJob = await existingJob.update({
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

      res.json(updatedJob);
    } 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Delete a job by ID
router.delete("/byId/:id", validateToken, async (req, res) => {
  try {
    const jobId = req.params.id;

    // Check if the job exists
    const existingJob = await JobInfos.findByPk(jobId);
    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Perform the deletion
    await existingJob.destroy();

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;