const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);         
router.get('/publico', userController.getAllPublico); 
router.get('/:id', userController.getUserById);
router.post('/register', userController.registerUser);
router.put('/:id', userController.updateUser);

module.exports = router;
