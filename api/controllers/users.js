/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.usersSignUp = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((result) => {
      if (result.length >= 1) {
        return res.status(422).json({
          message: 'Email exists'
        });
      }
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        }
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash
        });
        user
          .save()
          .then((result2) => {
            console.log(result2);
            res.status(201).json({
              message: 'User created'
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              error
            });
          });
      });
    });
};

exports.usersLogin = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed1'
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed2'
          });
        }
        if (result) {
          const token = jwt.sign({
            email: user.email,
            userId: user._id
          }, process.env.JWT_KEY, {
            expiresIn: '1h'
          });
          return res.status(200).json({
            message: 'Auth successful',
            token
          });
        }
        return res.status(401).json({
          message: 'Auth failed3'
        });
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error
      });
    });
};

exports.usersDelete = (req, res) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'User deleted'
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error
      });
    });
};
