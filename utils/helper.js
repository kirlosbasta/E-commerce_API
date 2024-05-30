import bcrypt from 'bcrypt';

/**
 * Hash password
 * @param {String} password 
 * @returns {String} hashed password
 */
export const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

/**
 * Compare password with hash
 * @param {String} password 
 * @param {String} hash 
 * @returns {boolean} true if password matches hash, false otherwise 
 */
export const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
}
