import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const IsAuthenticated = async (req, res,next) => {
  const { cookies } = req.cookies;
  if (!cookies) {
    return res
      .status(401)
      .json({ success: false, message: "Log in or Register First" });
  }

  const decoded = jwt.verify(cookies, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  req.user = user;
  next()
};
