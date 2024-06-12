const isAuthenticated = require('../../utils/middelware.js');


describe('Test Middleware', () => {
  const req = {};
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
    send: jest.fn(),
  };
  const next = jest.fn();

  it('should return 401 if user is not authenticated', async () => {
    await isAuthenticated(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ Error: 'Unauthenticated' });
  });

  it('should call next if user is authenticated', async () => {
    req.user = { name: 'John Doe' };
    await isAuthenticated(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
