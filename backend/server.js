const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const users = require("./routes/api/users");
const cors  = require("cors")
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());
app.use(cors())
const dbURL = "mongodb://localhost:27017/login";
//connect to MongoDB
mongoose
  .connect(dbURL,
    { useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Routes
app.use("/api/users", users);

const port = 5000;

app.listen(port, () => console.log(`Server up and running on port ${port}`));