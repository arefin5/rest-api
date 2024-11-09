const User = require("../models/userModel");
const List = require('../models/listModel'); 
const Booking = require("../models/bookingSchema"); 
const FailedBooking = require('../models/failedBookingSchema'); 
const Review=require("../models/Review")
const { initPayment } = require('../service/payment');
const uuid = require('uuid'); // To generate unique transaction IDs

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
  
  const userId=req.auth._id;

  try {
    const user = await User.findById(userId)
    .sort({ createdAt: -1 }).populate("favoritelist","images location price serviceFee tex  avgRating reviews")   
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
    const userId = req.auth._id;
      
    const bookings = await Booking.find({ user: userId })
    .populate({
      path: 'property',
      select: 'propertyTitle description image',
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
    const { checkinDate, checkoutDate } = req.body;
    console.log(propertyId)
    // Find the property by ID
    const property = await List.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
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
    // Calculate the length of stay in days
    // success_url : `http://145.223.22.239:5001/api/success-payment/${transactionId}/`,

  const  amount=property.price;
  const transactionId = `TRANS_${uuid.v4()}`;
    const paymentData = {
      tran_id:transactionId,
      total_amount: amount,
      currency: 'BDT',
      success_url : `http:///145.223.22.239:5001/api/success-payment/${transactionId}/`,
      fail_url: 'http://localhost:3000/fail',
      cancel_url: 'http://localhost:3000/cancel',
      ipn_url: 'http://localhost:3000/ipn',
      cus_name: "testrest",
      cus_email:  "testrest",
      cus_phone: "testrest",
      cus_add1:  "testrest",
      shipping_method: 'NO',
      product_name: 'Property Booking',
      product_category: 'Real Estate',
      product_profile: 'travel-vertical',
      hotel_name: "bed bd",
      length_of_stay: `2 days`,
      check_in_time: "12:00 PM", 
      hotel_city: property.location.thana,
    };

    // Step 1: Initialize Payment
    const apiResponse = await initPayment(paymentData);
    const GatewayPageURL = apiResponse.GatewayPageURL;
  
    if (!GatewayPageURL) {
      return res.status(500).json({ message: 'Payment gateway initialization failed' });
    }
    console.log(property.Postedby)
    const newBooking = new Booking({
      user: req.auth._id,
      property: propertyId,
      checkinDate: new Date(checkinDate),
      checkoutDate: new Date(checkoutDate),
      price:property.price,
      tran_id: paymentData.tran_id,
      basePrice:property.GroundPrice,
     Host:property.Postedby,
    });

    // // Save the booking (in 'pending' state)
    const savedBooking = await newBooking.save();

    // // Add the booking's ID to the property
    property.bookings.push(savedBooking._id);
    await property.save();

    // Step 3: Redirect the user to the payment gateway for payment
    res.json({ GatewayPageURL, message: 'Redirecting to payment gateway' });
  //  after payment success then how can find tran_id here and use this into front end 
  } catch (error) {
    console.error('Error booking the property:', error);
    res.status(500).json({ message: 'Error booking the property', error });
  }
};
exports.paymentSuccess = async (req, res) => {
  
  try {
    const { tran_id, status } = req.body;
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

exports.softDeleteUser = async (req, res) => {
  try {
    const userId = req.auth.id; // Assuming the authenticated user's ID is available in req.auth.id
    
    const user = await User.findByIdAndUpdate(userId, { status: 'active' }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User account soft deleted successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.createReview = async (req, res) => {
  try {
      const listId = req.params.id;
      const userId = req.auth._id; // Authenticated user's ID
      const reviewData = req.body.reviewData;
      // Create a new review with reference to the user
      const newReview = new Review({
          listId: listId,
          categories: reviewData.categories,
          user: userId, // Store user ID for population
          reviewText: reviewData.reviewText
      });

      // Save the review to the database
      await newReview.save();

      // Populate the user details in the saved review
      const populatedReview = await Review.findById(newReview._id).populate('user', 'name');
      await List.findByIdAndUpdate(listId, { $push: { reviews: populatedReview._id } });

      // Send the created review with populated user details
      return res.status(201).json({
          message: 'Review created successfully',
          review: populatedReview,
          overallRating: populatedReview.overallRating
      });
  } catch (err) {
      console.error('Error creating review:', err);
      return res.status(500).json({ message: 'Error creating review', error: err.message });
  }
};


exports.PropertyBooklist=async(req,res)=>{
  
  try {
    const property = req.params.id;
      console.log(property);
    const bookings = await Booking.find({ property: property })
    .populate({
      path: 'property',
      select: 'propertyTitle description image',
    })
    .exec();

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching user booking list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


// Unified route handler for booking property and handling payment status
exports.handleBooking = async (req, res) => {
  const { action } = req.query;
  console.log(req.body);
   const amount =req.body.totalCost;
  try {
    switch (action) {
      case 'book': // Booking initiation
        const propertyId = req.params.id;
        const { checkinDate, checkoutDate } = req.body;

        // Find the property by ID
        const property = await List.findById(propertyId);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        // Check for date conflicts
        const isBooked = await Booking.findOne({
          property: propertyId,
          $or: [
            { checkinDate: { $lte: new Date(checkoutDate), $gte: new Date(checkinDate) } },
            { checkoutDate: { $gte: new Date(checkinDate), $lte: new Date(checkoutDate) } }
          ],
        });
        if (isBooked) return res.status(400).json({ message: 'The selected dates are already booked' });

        const paymentData = {
          total_amount: amount,
          currency: 'BDT',
          success_url: '',
          fail_url: 'http://localhost:3000/booking?action=fail',
          cancel_url: 'http://localhost:3000/cancel',
          ipn_url: 'http://localhost:3000/ipn',
          cus_name: "testrest",
          cus_email:  "testrest",
          cus_phone: "testrest",
          cus_add1:  "testrest",
          shipping_method: 'NO',
          product_name: 'Property Booking',
          product_category: 'Real Estate',
          product_profile: 'travel-vertical',
          hotel_name: "bed bd",
          length_of_stay: `2 days`,
          check_in_time: "12:00 PM", 
          hotel_city: property.location.thana,
        };
        // console.log("after paymentData chck")
        const apiResponse = await initPayment(paymentData);
        const GatewayPageURL = apiResponse.GatewayPageURL;
        if (!GatewayPageURL) return res.status(500).json({ message: 'Payment gateway initialization failed' });

        // Create a new booking with status 'pending'
        const newBooking = new Booking({
          user: req.auth._id,
          property: propertyId,
          checkinDate: checkinDate,
          checkoutDate:checkoutDate,
          price: property.price,
          tran_id: paymentData.tran_id,
          status:"pending",
        });
        const savedBooking = await newBooking.save();
        property.bookings.push(savedBooking._id);
        await property.save();

        return res.json({ GatewayPageURL, message: 'Redirecting to payment gateway' });

      // case 'success': // Payment success
      //   const { tran_id: successTranId } = req.body;
      //   const successBooking = await Booking.findOne({ tran_id: successTranId });
      //   if (!successBooking) return res.status(404).json({ message: 'Booking not found' });

      //   successBooking.status = 'confirmed';
      //   await successBooking.save();
      //   return res.status(200).json({ message: 'Payment successful, booking confirmed', booking: successBooking });

      // case 'fail': // Payment failure
      //   const { tran_id: failTranId } = req.body;
      //   const failedBooking = await Booking.findOne({ tran_id: failTranId });
      //   if (!failedBooking) return res.status(404).json({ message: 'Booking not found' });

      //   failedBooking.status = 'failed';
      //   await failedBooking.save();
      //   return res.status(400).json({ message: 'Payment failed, booking canceled' });

      default:
        return res.status(400).json({ message: 'Invalid action specified' });
    }
  } catch (error) {
    console.error('Error in booking handler:', error);
    res.status(500).json({ message: 'Error processing booking request', error });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { tran_id } = req.body;

    // Call SSLCommerz to verify the payment status
    const paymentStatus = await verifyPaymentStatus(tran_id);

    if (paymentStatus) {
      // Update booking status in your database (e.g., to 'confirmed')
      const booking = await Booking.findOne({ tran_id });
      if (booking) {
        booking.status = 'confirmed'; // Or any other status you define
        await booking.save();
        return res.status(200).json({ message: 'Payment confirmed', booking });
      }
      return res.status(404).json({ message: 'Booking not found' });
    } else {
      return res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: 'Error confirming payment', error });
  }
};




exports.confirmSuccess = async (req, res) => {
  try {
      const tran_id = req.params.id;
      console.log("tran_id success page", tran_id);

      const booking = await Booking.findOne({ tran_id });

      if (!booking) {
          return res.status(404).json({ message: 'Booking not found' });
      }

      booking.status = "paymentsuccess";
      await booking.save();

      // Send an HTML response with JavaScript for popup and redirect
      res.send(`
          <html>
              <body>
                  <script>
                      alert("Your payment was successful");
                      setTimeout(function() {
                          window.location.href = "http://www.bedbd.com/success/${tran_id}";
                      }, 2000);
                  </script>
              </body>
          </html>
      `);
  } catch (error) {
      console.error("Error processing payment success:", error);
      res.status(500).json({ message: 'Error processing payment success', error: error.message || error });
  }
};

