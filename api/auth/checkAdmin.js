/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded.isAdmin) {
      next();
    }
    else {
      throw new Error('Not admin');
    }
  }
  catch (error) {
    res.status(401).json({
      message: 'Auth failed'
    });
  }
};
