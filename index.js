const jsonServer = require("json-server");
const cors = require("cors");
const server = jsonServer.create();
const router = jsonServer.router("db.json");

//Enable cors middleware
server.use(cors());

// Middleware function to authenticate requests
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send("Unauthorized");
  } else {
    const credentials = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");
    const username = credentials[0];
    const password = credentials[1];

    const users = router.db.get("users").value();
    if (users[username]["password"] === password) {
      next();
    } else {
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
