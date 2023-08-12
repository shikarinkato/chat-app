export const errorHandler = (error, res) => {
  return res
    .status(500)
    .json({ success: false, message: "Some Internal Server Occured" });
};

export const ErrorHandler2 = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};
