const User = require("../models/userModel");

exports.addFavoritelist = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $addToSet: { favoritelist: id },
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error adding to favoritelist" });
  }
};

exports.removeFavoritelist = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $pull: { favoritelist: id },
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error removing from favoritelist" });
  }
};
