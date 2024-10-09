// backend/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = "Duplicate field value entered";
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const fields = Object.keys(err.errors);
    message = "Validation error occurred.";
    const errorDetails = {};
    fields.forEach((field) => {
      errorDetails[field] = err.errors[field].message;
    });
    return res.status(400).json({
      success: false,
      message,
      errorDetails,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails: err.message,
  });
};

module.exports = errorHandler;
