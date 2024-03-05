require('dotenv').config(); // Dotenv configuration
require('./config/dbConnect');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const app = express();
const UserRouter = require('./routes/users/usersRoute');
const PostsRouter = require('./routes/posts/postsRoute');
const CommentsRouter = require('./routes/comments/commentsRoute');
const globalErrHandler = require('./middlewares/globalHandler');
const Post = require('./model/post/Post');
const { truncatePost } = require('./utils/helpers');

// ------------
// Helpers
app.locals.truncatePost = truncatePost;

// ------------
// Middlewares

// Configure ejs
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(`${__dirname}/public`));

app.use(express.json()); // Parse incoming JSON data

app.use(express.urlencoded({ extended: true })); // Parse form data

// Method override
app.use(methodOverride('_method'));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60, // 1 day
    }),
  })
);

// ------------

app.use((req, res, next) => {
  if (req.session.userAuth) res.locals.userAuth = req.session.userAuth;
  else res.locals.userAuth = null;
  next();
});

app.get('/', async (req, res) => {
  try {
    const post = await Post.find().populate('user');
    res.render('index', { post });
  } catch (error) {
    res.render('index', { error: error.message });
  }
});

// Users route
app.use('/api/v1/users', UserRouter);

// Posts route
app.use('/api/v1/posts', PostsRouter);

// Comments route
app.use('/api/v1/comments', CommentsRouter);

// Error handler middlewares
app.use(globalErrHandler);

const port = process.env.PORT || 9000;

// Server listener
app.listen(port, () => {
  console.log(`Server up and running on PORT ${port}`);
});

