function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ message: 'Error' });

  next(err);
}

function unknownEndpoint(req, res) {
  res.status(404).json({ message: 'Unknown path' });
}

module.exports = {
  errorHandler,
  unknownEndpoint,
};
