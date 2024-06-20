const express = require("express");
const app = express();
const session = require("express-session");

const sessionOptions = {
  secret : "mysupersecrectstring",
  resave:false,
  saveUninitialized:true
}

app.use(session(sessionOptions));

app.get("/register", (req, res) => {
  let {name="defaulname"} = req.query;
  req.session.name = name;
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
 res.send(req.session.name);
});

app.listen(3000, () => {
  console.log("server is listening to 3000");
});
