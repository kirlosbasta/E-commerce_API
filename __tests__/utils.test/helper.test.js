const { hashPassword, comparePassword } = require('../../utils/helper.js');
const bcrypt = require('bcrypt');


describe('Test Helpers', () => {
  it('should hash password', () => {
    const password = 'password';
    const hashedPassword = hashPassword(password);
    const isMatch = bcrypt.compareSync(password, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it('should compare password', async () => {
    const password = 'password';
    const hashedPassword = bcrypt.hashSync(password, 10);
    const isMatch = comparePassword(password, hashedPassword);
    expect(isMatch).toBe(true);
  });
});
