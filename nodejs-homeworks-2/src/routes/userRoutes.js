const express = require('express');
const router = new express.Router();

const userControllers = require('../controllers/userControllers');
const {checkToken} = require('../controllers/utils');

router.get('/api/users/me', checkToken,
    userControllers.getUser);

router.delete('/api/users/me', checkToken,
    userControllers.deleteUser);

router.patch('/api/users/me', checkToken,
    userControllers.patchUser);

module.exports = router;
