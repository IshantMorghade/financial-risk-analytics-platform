const User = require("../models/User");
const Dataset = require("../models/Dataset");

exports.listUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  await Dataset.deleteMany({ userId });
  await User.findByIdAndDelete(userId);

  res.json({ message: "User and datasets deleted" });
};