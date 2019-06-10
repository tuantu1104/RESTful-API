/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const express = require('express');
const UserController = require('../controllers/users');
const checkAuth = require('../auth/checkAuth');

const router = express.Router();


router.post('/signup', UserController.usersSignUp);

router.post('/login', UserController.usersLogin);

router.delete('/:userId', checkAuth, UserController.usersDelete);

module.exports = router;
