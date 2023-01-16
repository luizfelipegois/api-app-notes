const bcrypt = require('bcrypt');
const User = require('../models/user');

const idIsValid = (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) return res.status(422).json({ message: 'id is required', error: true });

    return next();
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}'`, error: true });
  }
};

const nameIsValid = (req, res, next) => {
  try {
    const { name } = req.body;
    const regex = /^[a-zA-ZÀ-ÿ ]+$/;

    if (!name) return res.status(422).json({ message: 'Name is required', error: true });
    if (name.length < 3) return res.status(422).json({ message: 'Name requires a minimum of 3 characters', error: true });
    if (!regex.test(name)) return res.status(422).json({ message: 'Name cannot have numbers or special characters (@, $, !, %, *, ?, or &)', error: true });

    return next();
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}'`, error: true });
  }
};

const emailIsValid = async (req, res, next) => {
  try {
    const { email } = req.body;
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const user = await User.findOne({ email });

    if (!email) return res.status(422).json({ message: 'E-mail is required', error: true });
    if (!regex.test(email)) return res.status(422).json({ message: 'Invalid email format', error: true });
    if (user) return res.status(422).json({ message: 'E-mail already registered', error: true });

    return next();
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}'`, error: true });
  }
};

const passwordIsValid = (req, res, next) => {
  try {
    const { id, password } = req.body;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password && id.length !== 21) return res.status(422).json({ message: 'Password is required', error: true });
    if (!regex.test(password) && id.length !== 21) return res.status(422).json({ message: 'Password must contain at least 8 characters and include at least one lowercase character, one uppercase character, one digit, and one special character (@, $, !, %, *, ?, or &)', error: true });

    return next();
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}'`, error: true });
  }
};

const userExists = async (req, res, next) => {
  try {
    const { id, email } = req.body;
    let user = null;

    if (id) {
      user = await User.findById({ _id: id });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) return res.status(422).json({ message: 'User not found', error: true });

    return next();
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}'`, error: true });
  }
};

const checkPassword = async (req, res, next) => {
  try {
    const { id, email, password } = req.body;

    if (!id) {
      const user = await User.findOne({ email });
      const passwordIsCorrect = await bcrypt.compare(password, user.password);

      if (!passwordIsCorrect) return res.status(422).json({ message: 'Incorrect password', error: true });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}'`, error: true });
  }
};

module.exports = {
  idIsValid,
  nameIsValid,
  emailIsValid,
  passwordIsValid,
  userExists,
  checkPassword,
};
