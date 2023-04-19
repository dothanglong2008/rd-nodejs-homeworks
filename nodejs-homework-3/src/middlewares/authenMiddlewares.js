const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});
const secretKey = process.env.JWT_KEY;
exports.signToken = (payload) => {
  return jwt.sign(
      {
        _id: payload.id,
      },
      secretKey);
};
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const jwtToken = token.split(' ')[1];
    const verifiedToken = jwt.verify(
        jwtToken,
        secretKey);
    const user = verifiedToken;
    const userID = user._id;
    const savedUser = await User.findById(userID);
    if (!savedUser) {
      return res.status(400).json({
        message: 'User Not Found',
      });
    } else {
      req.user = savedUser;
      next();
    }
  } catch (err) {
    next(err);
  }
};
