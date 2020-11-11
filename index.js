const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./middleware.js');

const app = express();

const port = process.env.PORT || 5000;
const uri = process.env.DB_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.err(err);
  });

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>');
});

app.use('/login', loginRouter);
app.use('/users', usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
