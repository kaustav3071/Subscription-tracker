// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Log error for debugging (in production, use a proper logger)
  console.error('Error:', err);

  const status = err.status || err.statusCode || 500;
  
  // Don't leak error details in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation error',
      errors: isProduction ? undefined : err.errors 
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate entry' });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // Generic error response
  const message = isProduction && status === 500 
    ? 'Internal server error' 
    : err.message || 'Server error';
    
  res.status(status).json({ message });
}
