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
//* checks if posts exists first and returns post comments only if post exists.
  db.findById(req.params.id)
    .then(post => {
      if(post.length > 0) {
        db.findPostComments(req.params.id)
          .then(comments => {
            if(comments.length > 0) {
              res.status(200).json(comments);
            } else {
              res.status(200).json({ 
                message: "This post has no comments." 
              });
            }
          })
          .catch(err => {
            res.status(500).json({ 
              error: "The comments information could not be retrieved" ,
              err
            });
          });
      } else {
        res.status(404).json({ 
          message: "The post with the specified ID does not exist" 
        });
      } 
    })
    .catch(err => {
      console.log(err);
    });
});

//POST new post
router.post('/', (req, res) => {
  
  const newPost = req.body;

  if(newPost.title && newPost.contents) {
    db.insert(newPost)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });  
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
    //process.exit();
  }
});

//POST new comment to specific post
router.post('/:id/comments', (req, res) => {

  const id = req.params.id;
  const newComment = req.body.text;

  //first checking if post with specified id exists
  db.findById(id)
    .then(post => {
      if(post.length > 0) {
        if(req.body.text){
          db.insertComment({
            text: newComment,
            post_id: id
          })
          .then(comment => {
            res.status(201).json(comment);
          })
          .catch(err => {
            res.status(500).json({
              errorMessage: "There was a problem saving the comment to the database",
              err
            });
          });
        } else {
          res.status(400).json({
            errorMessage: "Please provide text for the comment"
          });
        }
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        })
      }
    })
    .catch(err => { //err message for post ID conditional check
      res.status(500).json({
        error: "The post information could not be retieved.",
        err
      });
    })
});

module.exports = router;