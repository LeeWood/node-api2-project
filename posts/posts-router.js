const express = require('express');
const db = require('../data/db');
const router = express.Router();

//! Try the abort() method for actually stopping a request if a condition has been met. If successful, try this in the first project as well.

//GET all posts
router.get('/', (req, res) => {

  db.find(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({
        error: "error retrieving posts",
        err
      });
    });
});

//GET post by specific id
router.get('/:id', (req, res) => {
  
  db.findById(req.params.id)
    .then(post => {
      if(post.length > 0) {
        res.status(200).json(post[0]);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The post information could not be retrieved",
        err
      });
    });
});

//GET comments for specified post.
router.get('/:id/comments', (req, res) => {
//* need to see if post exists FIRST...then search for comments.

  db.findById(req.params.id)
    .then(post => {
      if(post.length > 0) {
        db.findPostComments(req.params.id)
          .then(comments => {
            console.log(comments);
            res.status(200).json(comments);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist" })
      } 
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;