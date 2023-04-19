const express = require('express');
const router = new express.Router();

const credentialControllers = require('../controllers/credentialControllers');

router.post('/api/auth/register', credentialControllers.register);

router.post('/api/auth/login', credentialControllers.login);

module.exports = router;
