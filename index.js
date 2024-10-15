const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
const { PORT, CORS_ORIGIN } = process.env;
// ROUTES
const videoRoutes = require("./routes/videos");

// MIDDLEWARES
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.static("public"));
app.use(express.json());

// ROUTES
app.get("/videos", videoRoutes);
app.get("/videos/:id", videoRoutes);
app.post("/videos", videoRoutes); // post video
app.post("/videos/:id/comments", videoRoutes); // post comment - id == id of video
app.delete("/videos/:videoId/comments/:commentId", videoRoutes); // id == id of video, commentId == id of a comment
app.put("/comments/:commentId/like", videoRoutes); // like comment
app.put("/videos/:videoId/like", videoRoutes); // like video
app.put("/videos/:videoId/view", videoRoutes); // view video
app.get("/resume", videoRoutes);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
