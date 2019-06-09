/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const express = require('express');
const User = require('../models/user');
const UserController = require('../controllers/users');

const router = express.Router();


router.post('/signup', UserController.usersSignUp);

router.post('/login', UserController.usersLogin);

router.delete('/:userId', UserController.usersDelete);

module.exports = router;
