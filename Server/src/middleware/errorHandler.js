export const errorHandler = (err, req, res, next) => {
  console.error("🚨 Server error:", err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  
  res.status(statusCode).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === "development" ? err.stack : "Something went wrong",
    timestamp: new Date().toISOString(),
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
};