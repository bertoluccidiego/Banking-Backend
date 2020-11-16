const usersRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Account = require('../models/account');
const utils = require('../utils/utils');
const config = require('../utils/config');

usersRouter.get('/', async (req, res, next) => {
  const userToken = req.token;
  if (!userToken) {
    throw new Error('Authorization token not provided');
  }

  try {
    const userCredentials = await jwt.verify(userToken, config.JWT_SECRET);
    const user = await User.findOne({
      username: userCredentials.username,
    }).populate({
      path: 'accounts',
      model: 'Account',
      populate: {
        path: 'movements',
        model: 'Movement',
      },
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
});

usersRouter.get('/all', async (req, res, next) => {
  try {
    const usersList = await User.find({}).populate({
      path: 'accounts',
      model: 'Account',
      populate: {
        path: 'movements',
        model: 'Movement',
      },
    });

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

usersRouter.delete('/', async (req, res, next) => {
  const userToken = req.token;
  if (!userToken) {
    throw new Error('Authorization token not provided');
  }

  try {
    const userCredentials = await jwt.verify(userToken, config.JWT_SECRET);
    const userObj = await User.findOne({ username: userCredentials.username });
    await Account.deleteMany({ owner: userObj._id });

    await User.findByIdAndDelete(userObj._id);
    res.end();
  } catch (err) {
    next(err);
  }
});

module.exports = usersRouter;
