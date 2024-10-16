const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer"); // multipart/form-data parser
const commaNumber = require("comma-number"); // comma number formater

// MULTER STORAGE CONFIGURATION
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

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
          views: video.views,
        });
      }); /* 
       when using json has respond method:
       it will automatically convert the object into json on sending
       */
      res.status(200).json(reducedVideos);
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
      res.status(200).json(filteredVideo[0]); // sending first/only one video from this array
      return;
    }
  });
});

// POST THE VIDEO
router.post("/videos", upload.single("thumbnail"), (req, res, next) => {
  // get the video JSON file
  fs.readFile("./data/videos.json", (error, data) => {
    if (error) {
      res.send("no such directory is found!");
    } else {
      // making a copy of video array object
      const videoDataCopy = JSON.parse(data);
      // creating video object
      const newVideo = {
        id: uuidv4(),
        title: req.body.title,
        channel: "Nerd of the Ring",
        image: `http://localhost:8080/images/${
          req.file ? req.file.originalname : "defaultThumbnail.jpeg"
        }`,
        description: req.body.description,
        views: "0",
        likes: "0",
        duration: "4:20",
        video: "https://project-2-api.herokuapp.com/stream",
        timestamp: new Date().getTime(),
        comments: [],
      };
      // push the request body into new array
      videoDataCopy.unshift(newVideo);
      fs.writeFile(
        "./data/videos.json",
        JSON.stringify(videoDataCopy),
        (err) => {
          if (err) {
            console.log("Cannot update files");
          }
        }
      );
      res.status(201).send(newVideo);
      return;
    }
  });
});
// Testing resume sending
router.get("/resume", (req, res, next) => {
  const resume = {
    resumeFile: `${"http://localhost:8080/pdf/Tsering_Dhondup.pdf"}`,
  };
  res.status(200).send(resume);
  return;
});
// POST COMMENTS
router.post("/videos/:id/comments", (req, res, next) => {
  // read videos.json file
  fs.readFile("./data/videos.json", (error, data) => {
    if (error) {
      console.log("cannot add comments");
      return res.status(500).send("Could not read file.");
    } else {
      const videoDataCopy = JSON.parse(data); // store the video list in new variable
      const requestedObjectId = req.params.id; // get the value of req.params
      let commentObject; // create the commentObject

      // loop through the newArrayInstance and find the object that match the id of requestedObjectId
      videoDataCopy.forEach((videoElement) => {
        if (videoElement.id === requestedObjectId) {
          const requestedComment = req.body.comment;
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
        JSON.stringify(videoDataCopy),
        (error) => {
          console.log("cannot update file");
        }
      );
      return res.status(201).json(commentObject);
    }
  });
});

// DELETE COMMENTS
router.delete("/videos/:videoId/comments/:commentId", (req, res, next) => {
  fs.readFile("./data/videos.json", (err, data) => {
    if (err) {
      res.send("Cannot delete comments");
      return;
    } else {
      const videoId = req.params.videoId; // get the video id
      const commentId = req.params.commentId; // get the comment id
      const videoDataCopy = JSON.parse(data); // create a shallow copy of video.json data
      // deleting comment
      videoDataCopy.forEach((videoObj) => {
        if (videoObj.id === videoId) {
          videoObj.comments = videoObj.comments.filter((comment) => {
            return comment.id !== commentId;
          });
        }
      });
      console.log(commentId);
      // updating data base
      fs.writeFile(
        "./data/videos.json",
        JSON.stringify(videoDataCopy),
        (err) => {
          if (err) {
            res.send("cannot delete comment!");
          }
        }
      );
      return res.json({ id: commentId }); // sending deleted comment Id
    }
  });
});

// UPDATE COMMENT LIKES
router.put("/comments/:commentId/like", (req, res, next) => {
  fs.readFile("./data/videos.json", (err, data) => {
    const commentId = req.params.commentId;
    const videoDataCopy = JSON.parse(data);
    let respondComment; // variable to store matched comment which will be sent to client

    // updating likes
    videoDataCopy.forEach((videoObj) => {
      // loopimg videoObj comment properties
      videoObj.comments.forEach((comment) => {
        // if comment.id === commentId params
        if (comment.id === commentId) {
          comment.likes += 1;
          // comment.likes + 1;
          respondComment = comment; // setting respongComment
        }
      });
    });

    // updating data base
    fs.writeFile("./data/videos.json", JSON.stringify(videoDataCopy), (err) => {
      if (err) {
        res.send("cannot update the data base");
      }
    });

    res.status(200).json(respondComment);
    return;
  });
});

// UPDATE VIDEO LIKES
router.put("/videos/:videoId/like", (req, res, next) => {
  fs.readFile("./data/videos.json", (err, data) => {
    const videoId = req.params.videoId;
    const videoDataCopy = JSON.parse(data);
    let respondVideo; // variable to store matched video that will be sent to client
    // updating likes
    videoDataCopy.forEach((video) => {
      if (video.id === videoId) {
        // get the likes
        const currentLikes = video.likes;
        // remove non-numeric character from currentLikes
        let currentLikesInNumber = Number(currentLikes.replace(",", "")); // regular expression for ',' or comma = /[\s,]/g
        // increment the currentLikesInNumber by +1
        currentLikesInNumber += 1;

        /*
         # set video.likes key with new value === currentLikesInNumber 
         # Convert likes value to comma separated number
        */
        video.likes = `${commaNumber(currentLikesInNumber)}`;
        // comment.likes + 1;
        respondVideo = video; // setting response video
      }
    });
    // updating data base
    fs.writeFile("./data/videos.json", JSON.stringify(videoDataCopy), (err) => {
      if (err) {
        res.send("cannot update the data base");
        // console.log("cannot update files!")
      }
    });
    res.status(200).json(respondVideo);
    return;
  });
});
// UDATE VIDE0 VIEWS
router.put("/videos/:videoId/view", (req, res, next) => {
  fs.readFile("./data/videos.json", (err, data) => {
    const videoId = req.params.videoId;
    const videoDataCopy = JSON.parse(data);
    let respondVideo; // variable to store matched video that will be sent to client
    // updating views
    videoDataCopy.forEach((video) => {
      if (video.id === videoId) {
        // get the views
        const currentViews = video.views;
        // remove non-numeric character from currentViews
        let currentViewsInNumber = Number(currentViews.replace(/,/g, "")); // replace comma
        // increment the currentViewsInNumber by +1
        currentViewsInNumber += 1;
        /*
         # set video.views key with new value === currentLikesInNumber 
         # Convert view value to comma separated number
        */
        video.views = `${commaNumber(currentViewsInNumber)}`;
        // comment.views + 1;
        respondVideo = video; // setting response video
      }
    });
    // updating data base
    fs.writeFile("./data/videos.json", JSON.stringify(videoDataCopy), (err) => {
      if (err) {
        res.send("cannot update the data base");
        // console.log("cannot update files!")
      }
    });
    res.status(200).json(respondVideo);
    return;
  });
});

module.exports = router;
