const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middleware/Authmiddleware");
const AWS = require("aws-sdk");

const S3_BUCKET = "test-group6";
const REGION = "us-east-2";

AWS.config.update({
  accessKeyId: "AKIAYS2NQRCMGDJQVPXL",
  secretAccessKey: "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",
  region: REGION,
});

const s3 = new AWS.S3();

router.post("/", async (req, res) => {
  const { username, email, password, userType } = req.body;
  if (!username || !email || !password || !userType) {
    return res.status(400).json({ error: "Missing registration data" });
  }
  const user = await Users.findOne({ where: { username: username } });

  if (!user) {
    bcrypt.hash(password, 10).then(async (hash) => {
      try {
        await Users.create({
          username: username,
          email: email,
          password: hash,
          UserType: userType,
        });
        res.json("Success");
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  } else {
    res.json({ error: "User already exists" }); // 409
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing Login data" });
  }
  const user = await Users.findOne({ where: { username: username } }); //try catch

  if (user) {
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        res.json({ error: "Password does not match." });
      } else {
        const accessToken = sign(
          { username: user.username, id: user.id },
          "secure" //ovB5\&}wXe}7>^5{Jze.pt7#olQu+nVde9h[(hUQd+HFzx$\V'
        );
        res.status(200).json(accessToken);
      }
    });
  } else {
    res.status(400).json({ error: "User does not exist" }); //400
  }
});

router.post("/upload", async (req, res) => {
  const { fileName, fileType } = req.body;

  // Set S3 upload parameters
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    ContentType: fileType,
  };

  // Generate the pre-signed URL
  s3.getSignedUrl("putObject", s3Params, (err, url) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    // Send the pre-signed URL to the client
    res.json({ url });
  });
});

router.get("/", validateToken, (req, res) => {
  res.json(res.user);
});

module.exports = router;
