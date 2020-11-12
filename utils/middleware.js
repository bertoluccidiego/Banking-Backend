function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ message: err.toString() });

  next(err);
}

function unknownEndpoint(req, res) {
  res.status(404).json({ message: 'Unknown path' });
}

function getToken(req, res, next) {
  const authorizationHeader = req.get('Authorization');
  if (authorizationHeader) {
    if (authorizationHeader.slice(0, 7) === 'Bearer ') {
      req.token = authorizationHeader.slice(7);
    }
  }

  next();
}

module.exports = {
  errorHandler,
  unknownEndpoint,
  getToken,
};
