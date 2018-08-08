/*jshint esversion: 6 */
const http = require("http");
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "CfGU4Q": "http://www.facebook.com"
};

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
  var shortURL = "";
  var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++){
    shortURL += abc.charAt(Math.floor(Math.random() * abc.length));
  }
  return shortURL;
}

console.log(generateRandomString());

app.get("/", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  res.redirect(urlDatabase[shortURL]);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  var shortURL = generateRandomString();
  var longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  console.log(urlDatabase);
  res.send(`<html><body><a href="http://localhost:8080/u/${shortURL}">http://localhost:8080/u/${shortURL}</a></body></html>`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/");
});

app.listen(PORT);
console.log(`Server is listening to port ${PORT}`);
generateRandomString();
