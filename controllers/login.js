const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();

const User = require('../models/users');

// eslint-disable-next-line
loginRouter.post('/', async (req, res, next) => {
  const userCredentials = req.body;

  try {
    const userObj = await User.findOne({
      username: userCredentials.username,
    });
    if (!userObj) {
      // Implement error throwing here
      return res.status(404).json({ message: 'Error, username not found' });
    }

    const passwordMatch = await bcrypt.compare(
      userCredentials.password,
      userObj.password
    );
    if (!passwordMatch) {
      //  Implement error throwing here
      return res.status(401).json({ message: "Error, passwords don't match" });
    }

    const token = await jwt.sign(userCredentials, 'discourse');

    res.json({ username: userCredentials.username, token });
  } catch (err) {
    next(err);
  }
});

module.exports = loginRouter;
