import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { sendCookies } from "../middlewares/Cookies.js";
import { ErrorHandler2, errorHandler } from "../middlewares/errorhandler.js";
import { query } from "express";

export const Register = async (req, res) => {
  const { name, email, password, pic } = req.body;
  try {
    let user = await User.findOne({ email });

    // To handle errors
    if (user) {
      return ErrorHandler2(res, 400, "User Already Exists");
    }

    const hashedpasword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedpasword, pic });
    res.status(201).json({
      _id: user._id,
      name,
      email,
      pic,
      token: sendCookies(user._id),
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      return ErrorHandler2(res, 401, "Invalid Email Or Password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    user = await User.findById(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: sendCookies(user._id),
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const Allusers = async (req, res) => {
  const keyword = req.query.search;
  const query = keyword
    ? {
        $or: [
          { name: { $regex: new RegExp(req.query.search, "i") } },
          { email: { $regex: new RegExp(req.query.search, "i") } },
        ],
      }
    : {};
  try {
    const users = await User.find({ ...query, _id: { $ne: req.user.id } });
    res.send(users);

    if (!users) {
      return res.status(400).json({ message: "User Not Found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};
