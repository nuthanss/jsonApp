const express = require("express");
const app = express();
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const jwt = require("jsonwebtoken");

// Secret key used to sign JWT tokens
const jwtSecret = "your_secret_key";

app.use(express.json());
// Route for user authentication
app.post("/login", (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  // Get the users object from the JSON database
  const users = router.db.get("users").value();

  // Check if the user exists and the password is correct
  if (users[username] && users[username].password === password) {
    // Create a JWT token
    const token = jwt.sign({ username }, jwtSecret);

    // Send the token back to the client
    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// Middleware function to authenticate requests
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).send("Unauthorized");
  } else {
    const token = authHeader.split(" ")[1];
    try {
      const decodedToken = jwt.verify(token, jwtSecret);
      req.user = decodedToken.username;
      next();
    } catch (error) {
      res.status(401).send("Unauthorized");
    }
  }
};

// Add the authentication middleware to the JSON server
server.use(authenticate);
server.use(router);

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});

app.listen(3001, () => {
  console.log("Express is listening on port 3001...");
});
