const Router = require('express');
const AuthController = require('../controller/authController');

const router = new Router();
const authController = new AuthController();

router.post('/auth', authController.authUser.bind(authController));

module.exports = router;