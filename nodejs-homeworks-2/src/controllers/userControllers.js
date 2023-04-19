const User = require('../models/User');
const Credential = require('../models/Credential');
const bcrypt = require('bcrypt');

exports.getUser = async (req, res) => {
  try {
    const {_id} = req.user;
    User.findById(_id).then((data) => {
      if (data !== null) {
        res.status(200).json({user: data});
      } else {
        throw new Error();
      }
    }).catch(() => res.status(400).json({message: 'Bad request'}));
  } catch (error) {
    res.status(500).json(
        {
          message: 'Internal server error',
        },
    );
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const {_id} = req.user;
    User.deleteOne({_id: _id}).then(() => {
      res.status(200).json({
        message: 'Success',
      });
    }).catch(() => res.status(400).json({message: 'Bad request'}));
  } catch (error) {
    res.status(500).json(
        {
          message: 'Internal server error',
        },
    );
  }
};

exports.patchUser = async (req, res) => {
  try {
    const {oldPassword, newPassword} = req.body;
    const {_id} = req.user;
    User.findById(_id).then(async (data) => {
      if (data) {
        Credential.findOne({username: data.username})
            .then(async (checkCredential) => {
              if (checkCredential) {
                const checkPassword = await bcrypt
                    .compare(oldPassword, checkCredential.password);
                if (checkPassword) {
                  const salt = await bcrypt.genSalt(10);
                  const hashedPassword = await bcrypt.hash(newPassword, salt);
                  checkCredential.password = hashedPassword;
                  checkCredential.save().then(() => res
                      .status(200)
                      .json({message: 'Success'}));
                } else {
                  res.status(400).json({message: 'Bad request'});
                }
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
