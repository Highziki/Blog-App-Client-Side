const globalErrHandler = (err, req, res, next) => {
  // Status, message, stack,
  const { message, stack } = err;

  // Send response
  res.render('users/errorPage', { message, stack });
};

module.exports = globalErrHandler;
