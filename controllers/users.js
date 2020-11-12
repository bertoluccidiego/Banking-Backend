const usersRouter = require('express').Router();

const utils = require('../utils/utils');
const User = require('../models/user');

usersRouter.get('/', async (req, res, next) => {
  try {
    const usersList = await User.find({}).populate('accounts');
    res.json(usersList);
  } catch (err) {
    next(err);
  }
});

usersRouter.post('/', async (req, res, next) => {
  const userData = req.body;

  const userObj = new User({
    username: userData.username,
    password: await utils.passwordEncrypter(userData.password),
  });

  try {
    const addedUser = await userObj.save();
    res.status(201).json(addedUser);
  } catch (err) {
    next(err);
  }
});

usersRouter.put('/:id', async (req, res, next) => {
  const userId = req.params.id;
  const userData = req.body;

  // If the password is changed, encrypt it before saving it
  if (userData.password) {
    userData.password = await utils.passwordEncrypter(userData.password);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    });
    res.status(201).json(updatedUser);
  } catch (err) {
    next(err);
  }
});

usersRouter.delete('/:id', async (req, res, next) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndDelete(userId);
    res.end();
  } catch (err) {
    next(err);
  }
});

module.exports = usersRouter;
