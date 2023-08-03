export const errorHandler = (error, res) => {
  console.log(error.message);
  res
    .status(500)
    .json({ success: false, message: "Some Internal Server Occured" });
};

export const ErrorHandler2 = (res, statusCode, message) => {
  res.status(statusCode).json({ success: false, message });
};
