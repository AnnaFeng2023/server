const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");

//Routers
const jobRouter = require("./routes/JobInfos");
app.use("/jobInfos", jobRouter);
const companyRouter = require("./routes/Companies");
app.use("/companies", companyRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const userRouter = require("./routes/SeekerProfile");
app.use("/profile", userRouter);

// insert
app.post("/api/insert", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const sqlSelect = "INSERT INTO users (FirstName, LastName) VALUES(?,?)";
  db.query(sqlSelect, [firstName, lastName], (err, result) => {
    console.log(err);
  });
});

/*
// 
app.get('/api/get', (req, res) =>{
  const sqlSelect = "SELECT * FROM USERS";
  db.query(sqlSelect, (err, result) =>{
    res.send(result);
  });
});

// delete
app.delete('/api/delete/:userID', (req, res) =>{  /// firstname to id
  const userID = req.params.userID;  //// userid
  const sqlDelete = "DELETE FROM users WHERE userID = ?";
  
  db.query(sqlDelete, userID, (err, result) =>{
    if(err)console.log(err);
  });
});


// update
app.put('/api/update/: userID', (req, res) =>{
  const userID = req.params.userID;  
  const sqlUpdate = "UPDATE users SET FirstName = ?, LastName = ? WHERE userID = ?";
  db.query(sqlUpdate, [firstName, lastName, userID], (err, result) =>{
    if(err)console.log(err)
  });
});
*/

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
});
