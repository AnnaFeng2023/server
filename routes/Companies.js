const express = require("express");
const router = express.Router();
const { Company } = require("../models");  // Assuming your model is named "Company"
const { validateToken } = require("../middleware/Authmiddleware");

// Get all companies
router.get("/", async (req, res) => {
  try {
    const listOfCompanies = await Company.findAll({
      attributes: ['CompanyID', 'EmployerID', 'CompanyName', 'CompanyInfo', 'ContactInfo', 'createdAt', 'updatedAt'],
      order: [['CompanyID', 'DESC']],  // Use 'CompanyID' or the correct column name you want to order by
      limit: 5,
    });
    res.json(listOfCompanies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a company by ID
router.get("/byId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const company = await Company.findByPk(id);
    if (!company) {
      res.status(404).json({ error: 'Company not found' });
    } else {
      res.json(company);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new company
router.post("/", validateToken, async (req, res) => {
  try {
    const { EmployerID, CompanyName, CompanyInfo, ContactInfo } = req.body;

    // Validate that required fields are present
    if (!EmployerID || !CompanyName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const createdCompany = await Company.create({
      EmployerID,
      CompanyName,
      CompanyInfo,
      ContactInfo,
    });

    res.status(201).json(createdCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;