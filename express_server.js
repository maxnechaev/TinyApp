/*jshint esversion: 6 */
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "CfGU4Q": "http://www.facebook.com"
// };

const urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    id: "user1"
  },
  "CfGU4Q": {
    url: "http://www.facebook.com",
    id: "user2"},
  "f3r45d": {
    url: "http://www.twitter.com",
    id: "user2"
  }
};


// Object.keys(urlDatabase).filter(shortURL => user === urlDatabase[shortURL].id);// filter through array

// var user = "user1";

// const fetchUser = id => {
//   const filteredUrls = {};
//   // const id = urlDatabase[shortURL].id;
//
//   for (const shortURL in urlDatabase){
//     if (id === urlDatabase[shortURL].id) {
//       filteredUrls[shortURL] = urlDatabase[shortURL];
//       // console.log(urlDatabase[shortURL].url);
//     } else return null;
//   }
//   return filteredUrls;
// };
// const user2 = urlDatabase.CfGU4Q.id;
// console.log(fetchUser(user2));

// filterUrls(/*user*/);
// // urlDatabase[shortURL].url

const users = {
  "user1": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// console.log(users.user1);
// console.log(urlDatabase.CfGU4Q);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ //gives oportunity to use req.body object
  extended: true
}));

app.use(bodyParser.json());
app.use(cookieParser());

function generateRandomString() {
  var shortURL = "";
  var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++) {
    shortURL += abc.charAt(Math.floor(Math.random() * abc.length));
  }
  return shortURL;
}

app.get("/", (req, res) => {
  res.redirect("/urls");
});


app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { username, password, password_confirm, email } = req.body;
  // console.log(username, password, password_confirm, email );
  // res.clearCookie("id", "username", "password");
  if (username && password && password_confirm && email){
    if (password === password_confirm){
      // console.log(password, password_confirm);
      const id = generateRandomString();
      const user = {
        id: id,
        username: username,
        password: password,
        email: email
      };
      users[id] = user;
      res.cookie("id", id, { maxAge: 10 * 60 * 1000});
      // res.cookie("username", username, { maxAge: 10 * 60 * 1000});
      // res.cookie("password", password, { maxAge: 10 * 60 * 1000});
      // console.log("id is ", id, "username is ", username, "password is ", password);
      res.redirect("/urls");
    } else {
      console.log("Passwords do not match.");
      res.send(`Your passwords do not match. Please, try again. <a href="http://localhost:8080/register">Go back to registration page</a>`);
      // res.redirect("register");
    }
  } else {
    console.log("Please provide your username, password and e-mail.");
    res.send(`Please provide your username, password and e-mail. <a href="http://localhost:8080/register">Go back to registration page</a>`);
    // res.redirect("/register");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const id = req.cookies.id;
  console.log("req.body is ", req.body);
  // console.log("req.params is ", req.params);
  if (id){
    // console.log(password, password_confirm);
    const user = {
      id: id,
      username: username,
      password: password,
    };
    users[id] = user;
    // console.log("user is ", user);
    res.cookie("id", id, { maxAge: 10 * 60 * 1000});
    // res.cookie("username", username, { maxAge: 10 * 60 * 1000});
    // res.cookie("password", password, { maxAge: 10 * 60 * 1000});
    // console.log("id is ", id, "username is ", username, "password is ", password);
    res.redirect("/urls");
  } else {
    console.log("Please enter correct username and password.");
    res.send(`Please enter correct username and password.
      Please, try again. Go back to the <a href="http://localhost:8080/login">login page</a>
       or you can
      <a href="http://localhost:8080/register"> register here</a>`);
    // res.redirect("register");
  }
});


app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    id: req.cookies.id,
    // username: req.cookies.username,
    // password: req.cookies.password
  };
  res.render("urls_new", templateVars);
});

app.post("/urls/new", (req, res) => {
  let templateVars ={
    id: req.cookies.id,
    // username: req.cookies.username,
    // password: req.cookies.password,
    url: req.body.longURL
  };
  // console.log(templateVars.id);
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = templateVars;
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  // console.log(req.cookies.username);
  let templateVars = {
    id: req.cookies.id,
    urls: urlDatabase,
    // username: req.cookies.username,
    // password: req.cookies.password
  };
  // console.log(templateVars.users.username);
  res.render("urls_index", templateVars);
});

// console.log(urlDatabase.b2xVn2.url);

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  let username = res.cookie.username;
  // let id = res.cookie.id;
  urlDatabase[shortURL] = longURL;
  res.send(
    `<html>
    <body style="font-size:15px; margin: 20px;">
    <title>Tiny App</title>
    Here is your short link, ${username}:
    <a href="http://localhost:8080/u/${shortURL}">http://localhost:8080/u/${shortURL}</a>
    <br />
    <br />
    <a href="http://localhost:8080/urls">Go to the main page</a>
    </body>
    </html>`);
  });

app.get("/urls/:longURL", (req, res) => {
  let templateVars = {
    id: req.cookies.id,
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    // username: req.cookies.username,
    // password: req.cookies.password
  };
  // console.log(templateVars.longURL);

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].url;
  // console.log(longURL);
  res.redirect(longURL);
});

app.get("/urls/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].url;
  const templateVars = {
    shortURL: shortURL,
    longURL: longURL,
    id: req.cookies.id,
    // username: req.cookies.username,
    // password: req.cookies.password
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  // console.log("shortURL in update is", shortURL);
  // console.log("longURL in update is", longURL);
  const templateVars = {
    shortURL: shortURL,
    longURL: longURL,
    id: req.cookies.id,
    // username: req.cookies.username,
    // password: req.cookies.password
  };
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  // console.log("id", "username", "password");
  const clearCookies = ["id", "username", "password"];
  clearCookies.forEach(c => res.clearCookie(c));
  res.redirect("/urls");
});

app.listen(PORT);
console.log(`Server is listening to port ${PORT}`);
