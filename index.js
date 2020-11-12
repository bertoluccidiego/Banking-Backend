const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const accountsRouter = require('./controllers/accounts');
const middleware = require('./utils/middleware.js');
const config = require('./utils/config');

const app = express();

mongoose
  .connect(config.DB_URI, {
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
app.use(middleware.getToken);
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>');
});

app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/accounts', accountsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
