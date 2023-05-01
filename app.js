const express = require("express");
const cors = require("cors");
const DBManager = require("./database.js");

const DatabaseManager = new DBManager();
DatabaseManager.connect()
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get("/getuserinfo", async (req, res) => {
  try {
    const {id} = req.query
    if (id == undefined || id == null) {
      res.status(400).send("Invalid user ID");
    }
    const result = await DatabaseManager.checkDatabase(req.query);
   
    if (result != null) {
      res.status(200).send(result);

    }else{
      res.status(400).send(result);    
    }
  

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/users", async (req, res) => {
  try {
    const {id} = req.body
    console.log(req.body)
    if (id == undefined || id == null) {
      res.status(400).send("Invalid user ID");
    }
    
    const result = await DatabaseManager.checkDatabase(req.body);
    console.log(result);
    if (result != null) {
      res.send(result);

    }
  

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(2005, () => {
  console.log("Server started on port 2005");
});
