const {v4: uid} = require('uuid');
const bcrypt = require('bcrypt');
const Credential = require('../models/Credential');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const {username, password} = req.body;
    User.findOne({username: username}).then(async (data) => {
      if (data) {
        return res.json({message: 'Bad request'});
      }
      const newUser = new User({
        _id: uid(),
        username: username,
        createdDate: new Date().toDateString(),
      });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newCredential = new Credential({
        username: username,
        password: hashedPassword,
      });
      newCredential.save();
      newUser.save().then(() => res.status(200).json({message: 'Success'}));
    },
    );
  } catch (error) {
    res.status(500).json(
        {
          message: 'Internal server error',
        },
    );
  }
};

exports.login = async (req, res) => {
  try {
    const {username, password} = req.body;
    User.findOne({username: username}).then((checkUser) => {
      if (checkUser) {
        Credential
            .findOne({username: username})
            .then(async (checkCredential) => {
              const checkPassword = await bcrypt
                  .compare(password, checkCredential.password);
              if (checkPassword) {
                const accessToken = jwt.sign(
                    {
                      _id: checkUser._id,
                      username: checkUser.username,

                    },
                    process.env.TOKEN_SECRET,
                );
                res.status(200)
                    .json({message: 'Success', jwt_token: accessToken});
              } else {
                res.status(400).json({message: 'Bad Request'});
              }
            });
      } else {
        res.status(400).json({message: 'Bad request'});
      }
    });
  } catch (error) {
    res.status(500).json(
        {
          message: 'Internal server error',
        },
    );
  }
};
