const { Router } = require('express');

const { createUserInTheDatabase, userLogin } = require('../controllers/user');
const {
  idIsValid,
  nameIsValid,
  emailIsValid,
  passwordIsValid,
  userExists,
  checkPassword,
} = require('../middlewares/user');

const router = Router();

router.post('/signUp', idIsValid, nameIsValid, emailIsValid, passwordIsValid, createUserInTheDatabase);
router.post('/signIn', userExists, checkPassword, userLogin);

module.exports = router;
