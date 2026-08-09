const errorHandler = (error, req, res, next) => {
  console.error("UNHANDLED ERROR:", {
    name: error.name,
    message: error.message,
    stack: error.stack,
  });

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorHandler;
