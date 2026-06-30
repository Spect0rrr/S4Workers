const Router = require('express');
const UserController = require('../controller/userController');

const router = new Router();
const userController = new UserController();

router.post('/user', userController.createUser.bind(userController));
router.delete('/user', userController.deleteUser.bind(userController));
router.patch('/user/password', userController.updatePassword.bind(userController));
router.post('/user/password', userController.updatePassword.bind(userController));

module.exports = router;