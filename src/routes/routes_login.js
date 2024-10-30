const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login_controller');

// Define la ruta POST para /login
router.get('/login', loginController.login);

module.exports = router;
