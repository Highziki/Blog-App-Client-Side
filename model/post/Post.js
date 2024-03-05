const mongoose = require('mongoose');

// Post Schema: Title, description, Category, Image, User
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['node js', 'react js', 'html', 'css', 'javascript', 'other'],
    },
    image: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
);

// Compile schema to form model
const Post = mongoose.model('Post', postSchema);

// Export model
module.exports = Post;
