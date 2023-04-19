const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

exports.checkToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (header) {
    const token = header.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          message: 'Bad request',
        });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({
      message: 'Bad request',
    });
  }
};
