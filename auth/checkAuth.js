const jwt = require('jsonwebtoken');

module.export = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
  }
  catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
};
