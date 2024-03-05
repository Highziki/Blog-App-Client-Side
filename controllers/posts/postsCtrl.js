const User = require('../../model/user/User');
const Post = require('../../model/post/Post');
const appErr = require('../../utils/appErr');

// Create post controller
const createPostCtrl = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description || !category || !req.file)
      return res.render('posts/addPost', { error: 'All fields are required' });

    // Find the user
    const userID = req.session.userAuth;
    const userFound = await User.findById(userID);

    // Create the post
    const post = await Post.create({
      title,
      description,
      category,
      user: userFound._id,
      image: req.file.path,
    });

    // Push post created into the array of user's post
    userFound.posts.push(post._id);

    // Resave user
    userFound.save();

    // Redirect
    res.redirect('/api/v1/users/profile-page');
  } catch (error) {
    return res.render('posts/addPost', { error: error.message });
  }
};

// Fetch all posts controller
const fetchPostsCtrl = async (_, res, next) => {
  try {
    // Retrieve all posts
    const posts = await Post.find().populate('comments').populate('user');
    if (!posts)
      return next(appErr('Please login or register first to access posts'));

    res.json({ status: 'Success', data: posts });
  } catch (error) {
    next(appErr(error.message));
  }
};

// Fetch single post controller
const fetchPostCtrl = async (req, res, next) => {
  try {
    const postID = req.params.id;
    const post = await Post.findById(postID)
      .populate({
        path: 'comments',
        populate: 'user',
      })
      .populate('user');
    res.render('posts/postDetails', { post, error: '' });
  } catch (error) {
    next(appErr(error.message));
  }
};

// Delete post controller
const deletePostCtrl = async (req, res, next) => {
  try {
    const postID = req.params.id;

    // Find the post
    await Post.findById(postID);

    const deletedPost = await Post.findByIdAndDelete(postID);
    if (!deletedPost) return next(appErr('Post does not exist'));

    res.redirect('/api/v1/users/profile-page');
  } catch (error) {
    next(appErr(error.message));
  }
};

// Update post controller
const updatePostCtrl = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const postID = req.params.id;
    const userID = req.session.userAuth;

    // Find the post
    const post = await Post.findById(postID);

    // Check if post belongs to user
    if (post.user.toString() !== userID.toString())
      return res.render('posts/updatePost', {
        error: 'You are not authorized to update this post',
        post: '',
      });

    // Check if user is updating image
    if (req.file) {
      // Update
      await Post.findByIdAndUpdate(
        postID,
        { title, description, category, image: req.file.path },
        { new: true }
      );
    } else {
      // Update
      await Post.findByIdAndUpdate(
        postID,
        { title, description, category },
        { new: true }
      );
    }

    res.redirect('/api/v1/users/profile-page');
  } catch (error) {
    return res.render('posts/updatePost', {
      error: error.message,
      post: '',
    });
  }
};

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
};
