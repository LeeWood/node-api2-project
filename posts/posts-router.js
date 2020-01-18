const express = require('express');
const db = require('../data/db');
const router = express.Router();


//GET all posts
router.get('/', (req, res) => {
  db.find(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "error retrieving posts",
        err
      });
    });
});

module.exports = router;