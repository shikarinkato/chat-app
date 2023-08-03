import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { errorHandler } from "./errorhandler.js";

export const IsAuthenticated = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // decoded id
      const decodedid = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decodedid.id).select("-password");
      next();
    } catch (error) {
      console.log(error.message);
      errorHandler(error, res);
    }
  }
  if (!token) {
    res.status(401).json({ message: "Token Did Not Exists" });
  }
};
