const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();

const User = require('../models/user');
const config = require('../utils/config');

loginRouter.post('/', async (req, res, next) => {
  const userCredentials = req.body;

  try {
    const userObj = await User.findOne({
      username: userCredentials.username,
    });
    if (!userObj) {
      throw new Error('Username not found');
    }

    const passwordMatch = await bcrypt.compare(
      userCredentials.password,
      userObj.password
    );
    if (!passwordMatch) {
      throw new Error("Passwords don't match");
    }

    const token = await jwt.sign(userCredentials, config.JWT_SECRET);

    res.json({ username: userCredentials.username, token });
  } catch (err) {
    next(err);
  }
});

module.exports = loginRouter;
