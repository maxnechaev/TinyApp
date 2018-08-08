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
app.use(bodyParser.urlencoded({
  extended: true
}));

function generateRandomString() {
  var shortURL = "";
  var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++) {
    shortURL += abc.charAt(Math.floor(Math.random() * abc.length));
  }
  return shortURL;
}

app.get("/", (req, res) => {
  let templateVars = {
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:longURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  // console.log("request body", req.body);
  urlDatabase[shortURL] = longURL;
  res.send(
    `<html>
      <body>
        Here is your short link:
        <a href="http://localhost:8080/u/${shortURL}">http://localhost:8080/u/${shortURL}</a>
        <br />
        <br />
        <a href="http://localhost:8080/urls">Go to the main page</a>
      </body>
    </html>`);
});

app.get("/urls/:shortURL/update", (req, res) => { //gives the full list for some reason
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = {
    shortURL: shortURL,
    longURL: longURL
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");

});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.listen(PORT);
console.log(`Server is listening to port ${PORT}`);
