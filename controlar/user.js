const User = require("../models/userModel");
const List = require('../models/listModel'); 
const Booking = require("../models/bookingSchema"); 
const FailedBooking = require('../models/failedBookingSchema'); 

const { initPayment } = require('../service/payment');
exports.addFavoritelist = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $addToSet: { favoritelist: id }, 
      },
      { new: true,upsert: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error adding to favoritelist" });
  }
};

// exports.addFavoritelist = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.auth._id,
//       {
//         $addToSet: { favoritelist: id },
//       },
//       { new: true }
//     );
//     res.json(updatedUser);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Error adding to favoritelist" });
//   }
// };
exports.removeFavoritelist = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $pull: { favoritelist: id }, // removes the item from the array
      },
      { new: true ,upsert: true} // returns the updated document
    );
    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error removing from favoritelist" });
  }
};
exports.favoritelist=async(req,res)=>{
  const userId=req.params.id;
  try {
    const user = await User.findById(userId)
    .sort({ createdAt: -1 })    
    if (!user) {
      return res.status(400).json({ message: 'This user not found' });
    }
    res.status(200).json({
      user,
      message:"user find success"
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking availability', error });
  }
}
exports.checkAvailability = async (req, res) => {
    try {
      const propertyId = req.params.id;
      const { checkinDate, checkoutDate } = req.body;

      // Check if the requested dates conflict with existing bookings for this property
      const isBooked = await Booking.findOne({
        property: propertyId,
        $or: [
          { checkinDate: { $lte: new Date(checkoutDate), $gte: new Date(checkinDate) } },
          { checkoutDate: { $gte: new Date(checkinDate), $lte: new Date(checkoutDate) } }
        ],
      });

      if (isBooked) {
        return res.status(400).json({ message: 'The selected dates are already booked' });
      }

      res.status(200).json({ message: 'The selected dates are available' });
    } catch (error) {
      res.status(500).json({ message: 'Error checking availability', error });
    }
  };
exports.getCurrentUser = async (req, res) => {
  try {
    const userid= req.params.id;
    const user = await User.findById(userid);
    if (!user) {
      return res.status(400).json({ message: 'This user not found' });
    }
    res.status(200).json({
      user,
      message:"user find success"
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking availability', error });
  }
};
exports.UserBooklist=async(req,res)=>{
  try {
    const userId = req.auth._id; // Assuming req.auth contains the authenticated user's info

    // Fetch all bookings for the logged-in user, populating related fields
    const bookings = await Booking.find({ user: userId })
    .populate({
      path: 'property',
      select: 'propertyTitle description image', // Select only specific fields
    })
    .exec();

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching user booking list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.bookProperty=async (req, res) => {
  try {
    const propertyId = req.params.id;
    console.log(propertyId)
    const { checkinDate, checkoutDate, price } = req.body;

    // Find the property by ID
    const property = await List.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    console.log("start")
    // Check for date conflicts
    const isBooked = await Booking.findOne({
      property: propertyId,
      $or: [
        { checkinDate: { $lte: new Date(checkoutDate), $gte: new Date(checkinDate) } },
        { checkoutDate: { $gte: new Date(checkinDate), $lte: new Date(checkoutDate) } }
      ],
    });

    if (isBooked) {
      return res.status(400).json({ message: 'The selected dates are already booked' });
    }

    // Payment data object
    const paymentData = {
      total_amount: property.price,
      currency: 'BDT',
      success_url: 'http://localhost:3000/success',
      fail_url: 'http://localhost:3000/fail',
      cancel_url: 'http://localhost:3000/cancel',
      ipn_url: 'http://localhost:3000/ipn',
      product_name: 'Property Booking',
      cus_name: "testrest",
      cus_email:  "testrest",
      cus_phone: "testrest",
      cus_add1:  "testrest",
    };

    // Step 1: Initialize Payment
    const apiResponse = await initPayment(paymentData);
    const GatewayPageURL = apiResponse.GatewayPageURL;

    if (!GatewayPageURL) {
      return res.status(500).json({ message: 'Payment gateway initialization failed' });
    }

    // Step 2: Create a new booking with status 'pending'
    const newBooking = new Booking({
      user: req.auth._id,
      property: propertyId,
      checkinDate: new Date(checkinDate),
      checkoutDate: new Date(checkoutDate),
      price,
      status: 'pending',
      tran_id: paymentData.tran_id, // Save the transaction ID
    });

    // Save the booking (in 'pending' state)
    const savedBooking = await newBooking.save();

    // Add the booking's ID to the property
    property.bookings.push(savedBooking._id);
    await property.save();

    // Step 3: Redirect the user to the payment gateway for payment
    res.json({ GatewayPageURL, message: 'Redirecting to payment gateway' });

  } catch (error) {
    console.error('Error booking the property:', error);
    res.status(500).json({ message: 'Error booking the property', error });
  }
};
exports.paymentSuccess = async (req, res) => {
  try {
    const { tran_id, status } = req.body; // Use actual payment gateway response
    const booking = await Booking.findOne({ tran_id });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (status === 'success') {
      booking.status = 'confirmed'; // Update booking status to 'confirmed'
      await booking.save();
      res.status(200).json({ message: 'Payment successful, booking confirmed', booking });
    } else {
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment success', error });
  }
};
exports.paymentFail = async (req, res) => {
  try {
    const { tran_id } = req.body; // Payment provider sends this data

    // Find the booking by transaction ID
    const booking = await Booking.findOne({ tran_id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Save the failed booking details in the FailedBooking collection
    const failedBooking = new FailedBooking({
      user: booking.user,
      property: booking.property,
      tran_id: booking.tran_id,
      checkinDate: booking.checkinDate,
      checkoutDate: booking.checkoutDate,
      price: booking.price,
      reason: 'Payment failed'
    });

    await failedBooking.save(); // Save the failed booking for future tracking

    // Update the booking status to 'failed'
    booking.status = 'failed';
    await booking.save();

    // Remove the booking from the property's bookings array to free the dates
    const property = await List.findById(booking.property);
    if (property) {
      property.bookings = property.bookings.filter(
        (bookingId) => bookingId.toString() !== booking._id.toString()
      );
      await property.save();
    }

    res.status(400).json({ message: 'Payment failed, booking canceled, dates freed' });
  } catch (error) {
    console.error('Error in payment failure:', error);
    res.status(500).json({ message: 'Error processing payment failure', error });
  }
};
