const jwt = require('jsonwebtoken');
const accountsRouter = require('express').Router();

const Account = require('../models/account');
const User = require('../models/user');
const config = require('../utils/config');

accountsRouter.post('/', async (req, res, next) => {
  const userToken = req.token;
  if (!userToken) {
    throw new Error('Authorization token not provided');
  }

  try {
    const userCredentials = await jwt.verify(userToken, config.JWT_SECRET);
    const userObj = await User.findOne({
      username: userCredentials.username,
    });
    if (!userObj) {
      throw new Error('Username not found');
    }

    const newAccountObj = new Account({
      owner: userObj._id,
      date: Date.now(),
    });

    const newAccount = await newAccountObj.save();
    userObj.accounts = userObj.accounts.concat(newAccount._id);
    await userObj.save();

    res.status(201).json(newAccount);
  } catch (err) {
    next(err);
  }
});

accountsRouter.delete('/:id', async (req, res, next) => {
  const userToken = req.token;
  if (!userToken) {
    throw new Error('Authorization token not provided');
  }

  const accountId = req.params.id;

  try {
    const userCredentials = await jwt.verify(userToken, config.JWT_SECRET);
    const userObj = await User.findOne({
      username: userCredentials.username,
    });
    if (!userObj) {
      throw new Error('Username not found');
    }

    await Account.findByIdAndDelete(accountId);

    userObj.accounts = userObj.accounts.filter((a) => a._id !== accountId);
    await userObj.save();

    res.end();
  } catch (err) {
    next(err);
  }
});

module.exports = accountsRouter;
