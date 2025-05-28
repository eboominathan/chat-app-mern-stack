import User from "../models/user.model";
import Message from "../models/message.model";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterUser = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
    res.status(200).json(filterUser);
  } catch (error) {
    console.error("Error fetching users for sidebar:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {}
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    if (image) {
      const uploadResponse = await cloudinary.uplaoder.upload(image);
      const imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      text,
      image,
      imageUrl,
      senderId,
      receiverId,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
