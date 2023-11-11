const express = require("express");
const app = express(); // instantiate express
const cors = require("cors");
const bodyParser = require("body-parser");
const videoRoutes = require("./routes/videos");

require("dotenv").config();
const { PORT, CORS_ORIGIN } = process.env;

app.use(cors({ origin: CORS_ORIGIN })); // CORS middleware

app.get("/video", videoRoutes);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
