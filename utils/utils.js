const bcrypt = require('bcrypt');

async function passwordEncrypter(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSaltSync(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

module.exports = {
  passwordEncrypter,
};
