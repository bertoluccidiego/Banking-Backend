const jwt = require('jsonwebtoken');
const movementsRouter = require('express').Router();

const Movement = require('../models/movement');
const Account = require('../models/account');
const User = require('../models/user');
const config = require('../utils/config');

movementsRouter.post('/', async (req, res, next) => {
  const userToken = req.token;
  if (!userToken) {
    throw new Error('Authorization token not provided');
  }

  const movementData = req.body;

  try {
    const userCredentials = await jwt.verify(userToken, config.JWT_SECRET);
    const userObj = await User.findOne({
      username: userCredentials.username,
    });
    if (!userObj) {
      throw new Error('Username not found');
    }

    const accountFromObj = await Account.findById(movementData.from);

    if (accountFromObj.owner.toString() !== userObj._id.toString()) {
      throw new Error("The logged in user and from account owner don't match");
    }
    if (accountFromObj.balance < movementData.amount) {
      throw new Error('Not enough funds in the from account');
    }

    const accountToObj = await Account.findById(movementData.to);

    accountToObj.balance += movementData.amount;
    accountFromObj.balance -= movementData.amount;

    const newMovementObj = new Movement({
      date: new Date(),
      ...movementData,
    });

    const newMovement = await newMovementObj.save();

    accountFromObj.movements = accountFromObj.movements.concat(newMovement._id);
    accountToObj.movements = accountToObj.movements.concat(newMovement._id);

    await accountFromObj.save();
    await accountToObj.save();

    res.status(201).json(newMovement);
  } catch (err) {
    next(err);
  }
});

module.exports = movementsRouter;
