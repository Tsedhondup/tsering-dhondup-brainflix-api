const express = require("express");
const router = express.Router();

router.get("/video", (req, res) => {
  res.send("this is your first get request");
});
module.exports = router;
