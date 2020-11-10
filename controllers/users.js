const usersRouter = require('express').Router();
const User = require('../models/users');

usersRouter.get('/', async (req, res, next) => {
  try {
    const usersList = await User.find({});
    res.json(usersList);
  } catch (err) {
    next(err);
  }
});

usersRouter.post('/', async (req, res, next) => {
  const userData = req.body;

  const userObj = new User({
    username: userData.username,
    password: userData.password,
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

  console.log(`user id ${userId}`);
  console.log(`user data ${userData}`);

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
