const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login_controller');


router.post('/login', loginController.login);

module.exports = router;
