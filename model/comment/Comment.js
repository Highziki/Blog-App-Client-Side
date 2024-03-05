const mongoose = require('mongoose');

// Comment Schema: User, Message

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      ref: 'User',
    },
    post: {
      type: String,
      required: true,
      ref: 'Post',
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compile schema to form model
const Comment = mongoose.model('Comment', commentSchema);

// Export model
module.exports = Comment;
