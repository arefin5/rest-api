const User = require("../models/userModel");
const List = require('../models/listModel'); // Assuming List is your property model
const Booking = require("../models/bookingSchema"); // Assuming Booking is a separate model or schema

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

// Function to check if the dates are booked and, if not, proceed with booking
exports.bookProperty = async (req, res) => {
  try {
    const { propertyId, userId, checkinDate, checkoutDate, price } = req.body;
    // Find the property by ID
    const property = await List.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    // Check if the requested dates conflict with existing bookings
    const isBooked = property.bookings.some(booking => {
      return (
        (new Date(checkinDate) >= new Date(booking.checkinDate) && 
         new Date(checkinDate) <= new Date(booking.checkoutDate)) ||
        (new Date(checkoutDate) >= new Date(booking.checkinDate) && 
         new Date(checkoutDate) <= new Date(booking.checkoutDate))
      );
    });
    if (isBooked) {
      return res.status(400).json({ message: 'The selected dates are already booked' });
    }
    // If no conflict, proceed to create a new booking
    const newBooking = {
      user: userId,
      checkinDate: new Date(checkinDate),
      checkoutDate: new Date(checkoutDate),
      price,
      status: 'pending' // Default status
    };
    // Add the new booking to the property's bookings array
    property.bookings.push(newBooking);
    // Save the property with the new booking
    await property.save();
    res.status(200).json({ message: 'Booking successful', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error booking the property', error });
  }
};
