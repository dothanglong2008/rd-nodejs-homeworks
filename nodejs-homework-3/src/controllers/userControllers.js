const bcrypt = require('bcrypt');
/* eslint-disable require-jsdoc */
const User = require('../models/User');
const Credential = require('../models/Credential');
const {signToken} = require('../middlewares/authenMiddlewares');

exports.register = async (req, res, next) => {
  try {
    const requestBody = await req.body;
    const {email, password, role} = requestBody;
    const existedUser = await User.findOne({email: email});
    if (existedUser) {
      return res.status(400).json({
        message: 'User Existed',
      });
    }
    const user = new User();
    user.email = email;
    user.role = role;

    const credential = new Credential();
    credential.email = email;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    credential.password = await bcrypt.hash(password, salt);
    user.created_date = new Date().toDateString();
    const savedUser = await user.save();
    const savedCredential = await credential.save();
    const responseBody = {
      message: 'Profile created successfully',
    };
    if (savedCredential && savedUser) {
      res.status(200).json(responseBody);
    } else {
      throw new Error();
    }
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const requestBody = await req.body;
    const {email, password} = requestBody;
    const existedUser = await User.findOne({email});
    if (!existedUser) {
      return res.status(400).json({
        message: 'User Not Found',
      });
    }
    const existedCredential = await Credential.findOne({email});
    const result = await bcrypt.compare(password, existedCredential.password);
    if (!result) {
      return res.status(400).json({
        message: 'Password Not Correct',
      });
    }
    const token = signToken(existedUser);
    const responseBody = {
      jwt_token: token,
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const requestBody = await req.body;
    const {email} = requestBody;

    const existedUser = await User.findOne({email});
    if (existedUser) {
      const existedCredential = await Credential.findOne({email});
      existedCredential.overwrite({email: email});
      const newCredential = await existedCredential.save();
      if (newCredential) {
        const responseBody = {
          message: 'New password sent to your email address',
        };
        res.status(200).json(responseBody);
      }
    } else {
      return res.status(400).json({
        message: 'User Not Found',
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.getUserProfileInfo = async (req, res, next) => {
  try {
    const savedUser = req.user;
    const responseBody =
    {
      user: {
        _id: savedUser._id,
        role: savedUser.role,
        email: savedUser.email,
        created_date: savedUser.created_date,
      },
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

exports.changeUserPassword = async (req, res, next) => {
  try {
    const existedUser = req.user;
    const email = existedUser.email;
    const {oldPassword, newPassword} = req.body;
    const existedCredential = await Credential.findOne({email});
    const result = await bcrypt.compare(oldPassword,
        existedCredential.password);
    if (!result) {
      return res.status(400).json({
        message: 'Password Not Correct',
      });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    existedCredential.password = await bcrypt.hash(newPassword, salt);
    const savedCredential = await existedCredential.save();
    if (savedCredential) {
      const responseBody = {
        message: 'Password changed successfully',
      };
      res.status(200).json(responseBody);
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteUserProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const userID = user._id;
    const existedUser = await User.findById(userID);
    if (existedUser) {
      const deletedUser = await User.deleteOne({_id: userID});
      if (deletedUser) {
        const responseBody = {
          message: 'Profile deleted successfully',
        };
        res.status(200).json(responseBody);
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.uploadProfilePicture = async (req, res, next) => {
  try {
    const user = req.user;
    const userID = user._id;
    const existedUser = await User.findById(userID);
    if (!existedUser) {
      return res.status(400).json({
        message: 'User not found',
      });
    }
    const photo = req.file;
    const responseBody = photo;
    res.status(200).json({
      message: responseBody,
    });
  } catch (err) {
    next(err);
  }
};

