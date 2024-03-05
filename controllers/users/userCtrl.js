const bcrypt = require('bcryptjs');
const User = require('../../model/user/User');

// Register user controller
const registerCtrl = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role, bio } = req.body;

    if ((!fullName || !email || !password, !confirmPassword))
      return res.render('users/register', { error: 'All fields are required' });

    // Check if user exists(email)
    const userFound = await User.findOne({ email });

    // Throw an error if there is not user
    if (userFound)
      return res.render('users/register', { error: 'Email is taken' });

    if (password !== confirmPassword)
      return res.render('users/register', { error: 'Passwords must match' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Register user
    await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      bio,
    });

    res.redirect('/api/v1/users/profile-page');
  } catch (error) {
    res.render('users/register', { error: error.message });
  }
};

// Login user controller
const loginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.render('users/login', {
        error: 'All fields are required',
      });

    // Check if email exists
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res.render('users/login', { error: 'Invalid login credentials' });

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userFound.password);
    if (!isValidPassword)
      return res.render('users/login', { error: 'Invalid login credentials' });

    // Save user into session
    req.session.userAuth = userFound._id;

    res.redirect('/api/v1/users/profile-page');
  } catch (error) {
    res.render('users/login', { error: error.message });
  }
};

// Fetch single user datails controller
const userDetailsCtrl = async (req, res) => {
  try {
    // Get user ID from params
    const userID = req.params.id;

    // Find the user
    const user = await User.findById(userID);

    res.render('users/updateUser', { user, error: '' });
  } catch (error) {
    res.render('users/updateUser', { error: error.message });
  }
};

// User profile controller
const profileCtrl = async (req, res) => {
  try {
    // Get the logged in user
    const userID = req.session.userAuth;

    // Find the user and populate posts and comments
    const user = await User.findById(userID)
      .populate('posts')
      .populate('comments');

    res.render('users/profile', { user });
  } catch (error) {
    res.render('users/errorPage', { message: error.message });
  }
};

// Profile photo upload controller
const uploadProfilePhotoCtrl = async (req, res) => {
  try {
    // Check if file exixts
    if (!req.file)
      return res.render('users/uploadProfilePhoto', {
        error: 'Please upload an image',
      });
    // Find the user to be updated`
    const userID = req.session.userAuth;
    const userFound = await User.findById(userID);

    // Check if user does not exists
    if (!userFound)
      return res.render('users/uploadProfilePhoto', {
        error: 'User not found',
      });

    // Update profile photo
    await User.findByIdAndUpdate(
      userID,
      { profileImage: req.file.path },
      { new: true }
    );

    res.redirect('/api/v1/users/profile-page');
  } catch (error) {
    return res.render('users/uploadProfilePhoto', { error: error.message });
  }
};

// Cover photo upload controller
const uploadCoverPhotoCtrl = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file)
      return res.render('users/uploadCoverPhoto', {
        error: 'Please upload an image',
      });

    // Find the user to be updated
    const userID = req.session.userAuth;
    const userFound = await User.findById(userID);

    // Check if user does not exists
    if (!userFound)
      return res.render('users/uploadCoverPhoto', {
        error: 'User not found',
      });

    // Update cover photo
    await User.findByIdAndUpdate(
      userID,
      { coverImage: req.file.path },
      { new: true }
    );

    res.redirect('/api/v1/users/profile-page');
  } catch (error) {
    return res.render('users/uploadCoverPhoto', {
      error: error.message,
    });
  }
};

// Update password controller
const updatePasswordCtrl = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const userID = req.session.userAuth;

    // Check if user is updating the password
    if (!password || !confirmPassword)
      return res.render('users/updatePassword', {
        error: 'Please fiil out all fields',
      });

    if (password !== confirmPassword)
      return res.render('users/updatePassword', {
        error: 'Passwords must match',
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user
    await User.findByIdAndUpdate(
      userID,
      { password: hashedPassword },
      { new: true }
    );

    res.redirect('/api/v1/users/profile-page');
  } catch (err) {
    return res.render('users/updatePassword', { error: err.message });
  }
};

// Update user controller
const updateUserCtrl = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const userID = req.session.userAuth;

    if (!fullName || !email)
      return res.render('users/updateUser', {
        error: 'Please provide details',
        user: '',
      });

    // Check if email is already taken
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken)
        return res.render('users/updateUser', {
          error: 'Email taken',
          user: '',
        });
    }

    // Update user
    await User.findByIdAndUpdate(
      userID,
      {
        fullName,
        email,
      },
      { new: true }
    );

    res.redirect('/api/v1/users/profile-page');
  } catch (error) {
    return res.render('users/updateUser', { error: error.message, user: '' });
  }
};

// Logout user controller
const logoutCtrl = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/api/v1/users/login');
  });
};

module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverPhotoCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
};
