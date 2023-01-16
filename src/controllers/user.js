const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const secret = process.env.SECRET;

const createUserInTheDatabase = async (req, res) => {
  try {
    const {
      id, name, email, password,
    } = req.body;
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    const token = await jwt.sign({ id, name, email }, secret, { expiresIn: '1h' });
    const user = new User({
      _id: id,
      name,
      email,
      password: id.length !== 21 ? passwordHash : '',
    });

    await user.save();

    return res.status(201).json({ message: `authenticated as ${email}`, error: false, token });
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}`, error: true });
  }
};

const userLogin = async (req, res) => {
  try {
    const { id, email } = req.body;
    let user = null;

    if (id) {
      user = await User.findById({ _id: id });
    } else {
      user = await User.findOne({ email });
    }

    const { _id, name, email: userEmail } = user;
    const token = await jwt.sign({ id: _id, name, email: userEmail }, secret, { expiresIn: '1h' });

    return res.status(200).json({ message: `authenticated as ${userEmail}`, error: false, token });
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}`, error: true });
  }
};

module.exports = {
  createUserInTheDatabase,
  userLogin,
};
