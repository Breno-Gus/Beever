var express = require('express');
var router = express.Router();
const UserController = require('../controllers/UserController');

// GET /api/users → só teste
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', UserController.register); //cadastro de user
router.post('/login', UserController.login); //login do user

module.exports = router;