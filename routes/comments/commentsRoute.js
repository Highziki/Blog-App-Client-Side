const express = require('express');
const {
  createCommentCtrl,
  commmentDetailsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require('../../controllers/comments/commentsCtrl');
const isLoggedIn = require('../../middlewares/isLoggedIn');
const CommentsRouter = express.Router();

// POST api/v1/comments
CommentsRouter.post('/:id', isLoggedIn, createCommentCtrl);

// GET api/v1/comments/:id
CommentsRouter.get('/:id', isLoggedIn, commmentDetailsCtrl);

// DELETE api/v1/comments/:id
CommentsRouter.delete('/:id', isLoggedIn, deleteCommentCtrl);

// PUT api/v1/comments/:id
CommentsRouter.put('/:id', isLoggedIn, updateCommentCtrl);

module.exports = CommentsRouter;
