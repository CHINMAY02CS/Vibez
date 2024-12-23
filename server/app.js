const http = require("http");

const server = http.createServer((req, res) => {
  console.log("Server created");
  res.end("Working");
});

server.listen(5000, "localhost", () => {
  console.log("Server is running on port 5000");
});
