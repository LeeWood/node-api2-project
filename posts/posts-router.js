const express = require('express');
const db = require('../data/db');
const router = express.Router();

//GET all posts
router.get('/', (req, res) => {

  db.find(req.query)
    .then(posts => {
      res.status(200).json({
        success: true,
        posts
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
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
        res.status(200).json({
          success: true,
          post: post[0]
        });
      } else {
        res.status(404).json({
          success: false,
          message: "The post with the specified ID does not exist."
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: "The post information could not be retrieved",
        err
      });
    });
});

//GET comments for specified post.
router.get('/:id/comments', (req, res) => {


  db.findById(req.params.id) //* checks if posts exists first and returns post comments only if post exists.
    .then(post => {
      if(post.length > 0) {
        db.findPostComments(req.params.id)
          .then(comments => {
            if(comments.length > 0) {
              res.status(200).json({
                success: true,
                comments
              });
            } else {
              res.status(200).json({ 
                success: true,
                message: "This post has no comments." 
              });
            }
          })
          .catch(err => {
            res.status(500).json({ 
              success: false,
              error: "The comments information could not be retrieved" ,
              err
            });
          });
      } else {
        res.status(404).json({
          success: false, 
          message: "The post with the specified ID does not exist" 
        });
      } 
    })
    .catch(err => { //* err message for ID conditional check
      res.status(500).json({
        success: false,
        message: "Post information could not be retrived.",
        err
      })
    });
});

//POST new post
router.post('/', (req, res) => {
  
  const newPost = req.body;

  if(newPost.title && newPost.contents) { //* must have both title and content key/value pairs
    db.insert(newPost)
      .then(post => {
        res.status(201).json({
          success: true,
          post
        });
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          error: "There was an error while saving the post to the database"
        });
      });  
  } else {
    res.status(400).json({
      success: false,
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

//POST new comment to specific post
router.post('/:id/comments', (req, res) => {

  const id = req.params.id;
  const newComment = req.body.text;

  db.findById(id) //* checking if post exists
    .then(post => {
      if(post.length > 0) {
        if(req.body.text){ //* comment must have text value in body
          db.insertComment({
            text: newComment,
            post_id: id
          })
          .then(comment => {
            res.status(201).json({
              success: true,
              comment
            });
          })
          .catch(err => {
            res.status(500).json({
              success: false,
              errorMessage: "There was a problem saving the comment to the database",
              err
            });
          });
        } else {
          res.status(400).json({
            success: false,
            errorMessage: "Please provide text for the comment"
          });
        }
      } else {
        res.status(404).json({
          success: false,
          message: "The post with the specified ID does not exist."
        })
      }
    })
    .catch(err => { //* err message for ID conditional check
      res.status(500).json({
        success: false,
        error: "The post information could not be retieved.",
        err
      });
    });
});

//PUT edit existing post
router.put('/:id', (req, res) => {

  const id = req.params.id;
  const body = req.body;

  db.findById(id) //* checking if post exists
    .then(post => {
      if(post.length > 0) {
        if(body.title && body.contents) {
          db.update(id, body)
            .then(editedPost => { //* returns updated version of the post
              db.findById(id)
                .then(post => {
                  res.status(200).json({
                    success: true,
                    post
                  });
                });
            })
            .catch(err => {
              res.status(500).json({
                success: false,
                error: "The post information could not be modified.",
                err
              });
            })
        }else {
          res.status(400).json({
            success: false,
            errorMessage: "Please provide title and contents for the post."
          })
        }
      }else {
        res.status(404).json({
          success: false,
          message: "The post with the specified ID does not exist."
        })
      }
    })
    .catch(err => {
      res.status(500).json({ //* err message for ID conditional check
        success: false,
        error: "The post informatio could not be retrieved.",
        err
      });
    });
});

//DELETE existing post
router.delete('/:id', (req, res) => {

  const id = req.params.id;

  db.findById(id) //* checking if post exists
    .then(post => {
      if(post.length > 0) {
        db.remove(id)
          .then(delPost => {
            res.status(200).json({
              success: true,
              message: "Post has been deleted."
            });
          })
          .catch(err => {
            res.status(500).json({
              success: false,
              message: "The post could not be removed"
            });
          })
      } else {
        res.status(404).json({
          success: false,
          message: "The post with the specified ID does not exist."
        });
      }
    })
    .catch(err => { //* err message for ID conditional check
      res.status(500).json({
        success: false,
        error: "The post information could not be retrieved.",
        err
      });
    });
});

module.exports = router;