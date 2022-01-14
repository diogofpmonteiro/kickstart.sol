const { createServer } = require("http");
// create a next server
const next = require("next");
const app = next({
  // specifies whether we are developing in a production or development mode
  dev: process.env.NODE_ENV !== "production",
});

const routes = require("./routes");
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  createServer(handler).listen(3000, (err) => {
    if (err) throw err;
    console.log("Listening on localhost:3000");
  });
});
