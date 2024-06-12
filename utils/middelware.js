
/**
 * Middleware function to check if the user is authenticated.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
async function isAuthenticated(req, res, next) {
  const { user } = req;
  if (!user) {
    return res.status(401).json({ Error: 'Unauthenticated' });
  }
  next();
}

module.exports = isAuthenticated;
