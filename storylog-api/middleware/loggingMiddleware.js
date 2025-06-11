module.exports = (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    console.log(`[LOG] ${req.method} request to ${req.originalUrl} by ${req.user?.userId || 'unknown user'}`);
  }
  next();
};