const http = require("http");
const { validateEnv } = require("@book-in/config");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<h1>BookIn - Marketing Website</h1><p>Ready to register your clinic.</p>");
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Marketing app listening at http://localhost:${PORT}`);
});
