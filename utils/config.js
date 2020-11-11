require('dotenv').config();

const { PORT } = process.env;
const { DB_URI } = process.env;
const { JWT_SECRET } = process.env;

module.exports = {
  PORT,
  DB_URI,
  JWT_SECRET,
};
