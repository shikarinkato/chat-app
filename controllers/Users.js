import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { sendCookies } from "../middlewares/Cookies.js";
import { ErrorHandler2, errorHandler } from "../middlewares/errorhandler.js";

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
    sendCookies(req, res, user, "Registered Succesfully", 201);
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
    sendCookies(req, res, user, `Welcome Back ${user.name}`, 200);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const Logout = async (req, res) => {
  try {
    res
      .cookie("cookies", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "Development" ? false : true,
      })
      .json({ success: true, message: "Logged Out Successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const GetMyProfile = async (req, res) => {
  try {
    const user = req.user;

    res.json({ success: true, message: `Hey ${user.name}`, user });
  } catch (error) {
    errorHandler(error, res);
  }
};
