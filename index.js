const express = require("express");
const app = express(); // instantiate express
const cors = require("cors");
require("dotenv").config();
const { PORT, CORS_ORIGIN } = process.env;
// ROUTES
const videoRoutes = require("./routes/videos");

// MIDDLEWARES
app.use(cors({ origin: CORS_ORIGIN }));
express.static("public");
app.use(express.json());
// app.use(express.urlencoded());

// ROUTES
app.get("/videos", videoRoutes);
app.get("/videos/:id", videoRoutes);
app.post("/videos", videoRoutes); // post video
app.post("/videos/:id/comments", videoRoutes); // post comment - id == id of video
app.delete("/videos/:id/comments/:commentId", videoRoutes); // id == id of video, commentId == id of a comment
app.put("/comments/:commentId/like", videoRoutes); // id == id of comments

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
