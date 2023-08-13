import { errorHandler, ErrorHandler2 } from "../middlewares/errorhandler.js";
import Chat from "../models/chatSchema.js";
import User from "../models/UserModel.js";

export const accessChats = async (req, res) => {
  const userid = req.params.id;
  if (!userid) {
    ErrorHandler2(res, 400, "UserID Not Sent With Params");
    return;
  }
  let isChat = await Chat.find({
    isGroupChat: false,

    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userid } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatdata = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userid],
    };
    console.log(req.user);
    try {
      const createdChat = await Chat.create(chatdata);
      const Fullchat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(201).json(Fullchat);
    } catch (error) {
      errorHandler(error, res);
    }
  }
};

export const fetchChats = async (req, res) => {
  console.log(req.user)
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("GroupAdmin", "-password")
      .sort({ updatedAt: -1 });

    const results = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).json(results);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const creategroupChat = async () => {
  res.send(req.user);
};


export const renameGroupChat = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("GroupAdmin", "-password");

  if (!updatedChat) {
    ErrorHandler2(res, 404, "Chat Not Found");
  } else {
    res.status(201).json(updatedChat);
  }
};

export const addTogroup = async (req, res) => {
  const { chatID, userID } = req.body;

  try {
    const removed = await Chat.findByIdAndUpdate(
      chatID,
      { $push: { users: userID } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("GroupAdmin", "-password");

    if (!removed) {
      ErrorHandler2(res, 404, "Chat Not Found");
      return;
    } else {
      res.status(200).json(removed);
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

export const removefromGroup = async (req, res) => {
  const { chatID, userID } = req.body;

  try {
    const removed = await Chat.findByIdAndUpdate(
      chatID,
      { $pull: { users: userID } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("GroupAdmin", "-password");

    if (!removed) {
      ErrorHandler2(res, 404, "Chat Not Found");
      return;
    } else {
      res.status(200).json(removed);
    }
  } catch (error) {
    errorHandler(error, res);
  }
};
