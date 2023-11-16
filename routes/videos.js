const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

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
      res.send(reducedVideos);
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
      res.send(filteredVideo);
      return;
    }
  });
});

// POST THE VIDEO
router.post("/videos", (req, res, next) => {
  // get the video JSON file
  fs.readFile("./data/videos.json", (error, data) => {
    if (error) {
      res.send("no such directory is found!");
    } else {
      // parsing video.json and store in new array
      const videoArray = JSON.parse(data);
      // getting the request body and store in new variable
      const requestObject = req.body;
      // Dynamic timestamp
      requestObject.timestamp = new Date().getTime();
      // push the request body into new array
      videoArray.unshift(requestObject);
      // using fs.writeFile, update the videos.json file

      fs.writeFile("./data/videos.json", JSON.stringify(videoArray), (err) => {
        if (err) {
          console.log("Cannot update files");
        }
      });
      res.send(requestObject);

      return;
    }
  });
});

// POST COMMENTS
router.post("/videos/:id/comments", (req, res, next) => {
  // read videos.json file
  fs.readFile("./data/videos.json", (error, data) => {
    if (error) {
      console.log("cannot add comments");
    } else {
      const videoArrayInstance = JSON.parse(data); // store the video list in new variable
      const requestedObjectId = req.params.id; // get the value of req.params
      let commentObject; // create the commentObject

      // loop through the newArrayInstance and find the object that match the id of requestedObjectId
      videoArrayInstance.forEach((videoElement) => {
        if (videoElement.id === requestedObjectId) {
          const requestedComment = req.body.comment; // get the body of requet object
          // create comment object
          commentObject = {
            id: uuidv4(),
            name: "Tsering Dhondup",
            comment: requestedComment,
            likes: 0,
            timestamp: new Date().getTime(),
          };
          videoElement.comments.push(commentObject);
        }
      });

      // update the video.json file
      fs.writeFile(
        "./data/videos.json",
        JSON.stringify(videoArrayInstance),
        (error) => {
          console.log("cannot update file");
        }
      );
      // send the response
      res.json(commentObject);
      return;
    }
  });
});

// DELETE COMMENTS
router.delete("/videos/:id/comments/:commentId", (req, res, next) => {
  fs.readFile("./data/videos.json", (err, data) => {
    if (err) {
      res.send("Cannot delete comments");
      return;
    } else {
      const videoId = req.params.id; // get the video id
      const commentId = req.params.commentId; // get the comment id
      const videoArrayCopy = JSON.parse(data); // create a shallow copy of video.json data
      // deleting comment
      videoArrayCopy.forEach((videoObj) => {
        if (videoObj.id === videoId) {
          videoObj.comments = videoObj.comments.filter((comment) => {
            return comment.id !== commentId;
          });
        }
      });
      // updating data base
      fs.writeFile(
        "./data/videos.json",
        JSON.stringify(videoArrayCopy),
        (err) => {
          if (err) {
            res.send("cannot delete comment!");
          }
        }
      );
      res.json({ id: commentId }); // sending deleted comment Id
      return;
    }
  });
});

// UPDATE LIKES
router.put("/comments/:commentId/like", (req, res, next) => {
  res.send("Thank for liking comments");
});
module.exports = router;
