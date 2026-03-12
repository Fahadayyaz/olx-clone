const Chat = require("../models/Chat");
const Message = require("../models/Message");

// POST /api/chats  — start or get existing chat
exports.startChat = async (req, res) => {
  try {
    const { adId, sellerId } = req.body;
    const buyerId = req.user._id;

    if (buyerId.toString() === sellerId) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }

    let chat = await Chat.findOne({
      ad: adId,
      participants: { $all: [buyerId, sellerId] },
    });

    if (!chat) {
      chat = await Chat.create({
        ad: adId,
        participants: [buyerId, sellerId],
      });
    }

    chat = await Chat.findById(chat._id)
      .populate("ad", "title images price")
      .populate("participants", "name avatar");

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/chats
exports.getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate("ad", "title images price")
      .populate("participants", "name avatar")
      .sort("-updatedAt");
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/chats/:chatId/messages
exports.getMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat || !chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name avatar")
      .sort("createdAt");

    // Mark unread messages as read
    await Message.updateMany(
      { chat: req.params.chatId, sender: { $ne: req.user._id }, read: false },
      { read: true },
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/chats/:chatId/messages
exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat || !chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const message = await Message.create({
      chat: chat._id,
      sender: req.user._id,
      text,
    });

    chat.lastMessage = {
      text,
      sender: req.user._id,
      createdAt: new Date(),
    };
    await chat.save();

    const populated = await message.populate("sender", "name avatar");

    // Emit via socket.io (handled in server.js)
    const io = req.app.get("io");
    io.to(chat._id.toString()).emit("newMessage", populated);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
