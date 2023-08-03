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

    try {
      const createdChat = await Chat.create(chatdata);
      const Fullchat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(201).json({ data: Fullchat });
    } catch (error) {
      errorHandler(error, res);
    }
  }
};

export const fetchChats = async (req, res) => {
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

    res.status(200).send({ data: results });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const creategroupChat = async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      errorHandler(res, 400, "Please Fill All The Fields");
      return;
    }

    // let users = req.body.users;
    // console.log(req.body.users);ss

    let users = await JSON.parse(req.body.users);

    console.log(users);
    if (users.length < 2) {
      ErrorHandler2(
        res,
        400,
        "More Than 2 Members are Required To Form a Group Chat"
      );
      return;
    }

    users.push(req.user);
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users,
      isGroupChat: true,
      GroupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("GroupAdmin", "-password");

    res.status(201).json(fullGroupChat);
  } catch (error) {
    errorHandler(error, res);
  }
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
