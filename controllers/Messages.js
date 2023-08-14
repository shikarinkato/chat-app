import { ErrorHandler2, errorHandler } from "../middlewares/errorhandler.js";
import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import Chat from "../models/chatSchema.js";

export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    ErrorHandler2(res, 400, "Invalid Data Passed into request");
    return;
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chatId,
  };
  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.status(201).json(message);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const Allmessages = async (req, res) => {
  const id = req.params.id;
  try {
    const messages = await Message.find({ chat: id })
      .populate("sender", "name pic")
      .populate("chat");
    if (!messages) {
      ErrorHandler2(
        res,
        400,
        "Messages Not Available Either Check The Id is Correct Or NOt"
      );
    }

    res.status(200).json(messages);
  } catch (error) {
    errorHandler(error, res);
  }
};
