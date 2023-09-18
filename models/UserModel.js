import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserModel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    pic: {
      type: String,
      default: "https://cdn150.picsart.com/upscale-245339439045212.png",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserModel);
export default User;
