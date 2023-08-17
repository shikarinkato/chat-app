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
    chat: chatId,
  };
  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email pic ",
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
  const id = req.params.chatID;
  try {
    const messages = await Message.find({ chat: id })
      .populate("sender", "name pic")
      .populate("chat");

    if (!messages || messages.length === 0) {
      ErrorHandler2(
        res,
        400,
        "Messages are not Available. Check The Id it is Correct Or NOt"
      );
      return;
    }

    res.status(200).json(messages);
  } catch (error) {
    errorHandler(error, res);
  }
};
