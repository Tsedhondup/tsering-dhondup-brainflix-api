const express = require("express");
const router = express.Router();
const fs = require("fs");

// GET NEXT VIDEO LIST
router.get("/videos", (req, res, next) => {
  // get the video JSON file
  fs.readFile("./data/videos.json", (error, data) => {
    /*
     file should be written from the perspective of entry or 
    staring point of server - which in this case is index.js 
    */
    if (error) {
      res.send("no such directory is found!");
    } else {
      // removing extra keys from videos
      const reducedVideos = JSON.parse(data).map((video) => {
        return (videoInstance = {
          id: video.id,
          title: video.title,
          channel: video.channel,
          image: video.image,
        });
      }); /* 
       when using json has respond method:
       it will automatically convert the object into json on sending
       */
      res.json(reducedVideos);
      return;
    }
  });
});

// GET MAIN-VIDEO
router.get("/videos/:id", (req, res, next) => {
  // get the video JSON file
  fs.readFile("./data/videos.json", (error, data) => {
    if (error) {
      res.send("no such directory is found!");
    } else {
      // get the id of param from the URL
      const videoId = req.params.id;
      // filtering video array
      const filteredVideo = JSON.parse(data).filter((vidObject) => {
        return vidObject.id === videoId;
      });
      res.json(filteredVideo);
      return;
    }
  });

  //   res.send("this is your main video");
});
router.post("/videos", (req, res, next) => {
  res.send("your video had posted successfully!");
});
router.post("/videos/:id/comments", (req, res, next) => {
  res.send("comment posted succesfully");
});
router.delete("/videos/:id/comments/:commentId", (req, res, next) => {
  res.send("Comment had been deleted!");
});
router.put("/comments/:commentId/like", (req, res, next) => {
  res.send("Thank for liking comments");
});
module.exports = router;
