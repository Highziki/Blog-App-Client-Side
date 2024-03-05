const express = require('express');
const multer = require('multer');
const storage = require('../../config/cloudinary');
const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
} = require('../../controllers/posts/postsCtrl');
const PostsRouter = express.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn');
const Post = require('../../model/post/Post');

// Instance of multer
const upload = multer({ storage });

// Forms
PostsRouter.get('/get-post-form', (req, res) => {
  res.render('posts/addPost', { error: '' });
});

// POST api/v1/posts
PostsRouter.post('/', isLoggedIn, upload.single('file'), createPostCtrl);

// GET api/v1/posts/get-form-update/:id
PostsRouter.get('/get-form-update/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('posts/updatePost', { post, error: '' });
  } catch (error) {
    res.render('posts/updatePost', { error, post: '' });
  }
});

// GET api/v1/posts
PostsRouter.get('/', isLoggedIn, fetchPostsCtrl);

// GET api/v1/posts/:id
PostsRouter.get('/:id', isLoggedIn, fetchPostCtrl);

// DELETE api/v1/posts/:id
PostsRouter.delete('/:id', isLoggedIn, deletePostCtrl);

// PUT api/v1/posts/:id
PostsRouter.put('/:id', isLoggedIn, upload.single('file'), updatePostCtrl);

module.exports = PostsRouter;
