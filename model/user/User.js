const mongoose = require('mongoose');

// User Schema: FullName, Email, Password, Profile Image, Cover Image, Posts

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2022/09/26/04/24/swan-7479623_1280.jpg',
    },
    coverImage: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2022/10/03/19/03/building-7496662_1280.jpg',
    },
    role: {
      type: String,
      default: 'Blogger',
      enum: [
        'Fullstack developer',
        'Front-end developer',
        'Back-end developer',
        'Blogger',
      ],
    },
    bio: {
      type: String,
      default:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit officiis tenetur rem, quo ad rerum labore aut incidunt ex assumenda voluptas fugit quidem quas quod consequuntur distinctio fugiat, atque harum.',
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

// Compile schema to form model
const User = mongoose.model('User', userSchema);

// Export model
module.exports = User;
