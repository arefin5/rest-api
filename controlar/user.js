const User = require("../models/userModel");
const List = require('../models/listModel'); 
const Booking = require("../models/bookingSchema"); 
const FailedBooking = require('../models/failedBookingSchema'); 
const Review=require("../models/Review")
const { initPayment } = require('../service/payment');
const uuid = require('uuid'); // To generate unique transaction IDs
const ServiceAndVat =require("../models/ServiceAndVat")
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
      
    const bookings = await Booking.find({ BClientId: userId })
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
exports.bookPropertyPayment=async (req, res) => {


  try {
    const bookingId = req.params.id; // This refers to the booking ID
    console.log(bookingId);

    // Find the booking by its ID
    const booking = await Booking.findById(bookingId).populate('property'); // Populate the property reference
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    console.log(booking);

    // Ensure the associated property exists
    const property = booking.property;
    if (!property) {
      return res.status(400).json({ message: 'Associated property not found for this booking' });
    }
    const transactionId = `TRANS_${uuid.v4()}`;
    booking.tran_id = transactionId;

    // Save the updated booking with the transaction ID
    await booking.save();
    console.log(booking)
   
     const paymentData = {
      tran_id:transactionId,
      total_amount: booking.price,
      currency: 'BDT',
      success_url : `http://145.223.22.239:5001/api/success-payment/${transactionId}/`,
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

    res.json({ GatewayPageURL, message: 'Redirecting to payment gateway' });
  //  after payment success then how can find tran_id here and use this into front end 
  } catch (error) {
    console.error('Error booking the property:', error);
    res.status(500).json({ message: 'Error booking the property', error });
  }
};

exports.bookProperty=async (req, res) => {
  try {
   const BClientID=req.auth._id;
  const propertyId = req.params.id;
  
    const { checkinDate, checkoutDate, guestCount, totalNights } = req.body;
    console.log(checkinDate);
  console.log(checkoutDate)
    if (!checkinDate || !checkoutDate || !totalNights || totalNights <= 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }
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
    const TaxAndFee=await ServiceAndVat.find()

    const basePrice = property.GroundPrice * totalNights || 0;
    const serviceFee = TaxAndFee.serviceFee * totalNights*basePrice|| 0;
    const tax = TaxAndFee.tax * totalNights*basePrice || 0;
    const amount = serviceFee + tax + basePrice;
    const newBooking = new Booking({
      user: req.auth._id,
      property: propertyId,
      checkinDate: new Date(checkinDate),
      checkoutDate: new Date(checkoutDate),
      price:amount,
      basePrice:basePrice,
      Host:property.Postedby._id,
      BClientId:BClientID,
      guest:guestCount
    });
    const savedBooking = await newBooking.save();
    res.json({  message: 'Your Booking Request is Success .waiting for Host Aproved'});

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
      const userId = req.auth._id; 
    //  console.log(req.body)
      const {
        locationOfProperty,
        loremIpsumRating,
        hygieneRating,
        amenitiesRating,
        communicationRating,
        reviewText,
        avgRating
      }=req.body;
      const newReview = new Review({
          listId: listId,
          user: userId,
          locationOfProperty,
          loremIpsumRating,
          hygieneRating,
          amenitiesRating,
          communicationRating,
          reviewText,
          avgRating
      });
      await newReview.save();
      await List.findByIdAndUpdate(listId, { $push: { reviews: newReview._id } });

      return res.status(201).json({
          message: 'Review created successfully',
          review: newReview,
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




// exports.confirmSuccess = async (req, res) => {
//   try {
//       const tran_id = req.params.id;
//       console.log("tran_id success page", tran_id);
        
//       const booking = await Booking.findOne({ tran_id });

//       if (!booking) {
//           return res.status(404).json({ message: 'Booking not found' });
//       }
//        const property=await ()
//       booking.status = "paymentsuccess";
//       await booking.save();
//       property.bookings.push(booking._id);
//       await property.save();
//       // Send an HTML response with JavaScript for popup and redirect
//       res.send(`
//           <html>
//               <body>
//                   <script>
//                       alert("Your payment was successful");
//                       setTimeout(function() {
//                           window.location.href = "http://www.bedbd.com/success/${tran_id}";
//                       }, 2000);
//                   </script>
//               </body>
//           </html>
//       `);
//   } catch (error) {
//       console.error("Error processing payment success:", error);
//       res.status(500).json({ message: 'Error processing payment success', error: error.message || error });
//   }
// };


exports.confirmSuccess = async (req, res) => {
  try {
    const tran_id = req.params.id;
    console.log("tran_id success page", tran_id);

    // Find the booking with the given transaction ID
    const booking = await Booking.findOne({ tran_id }).populate('property'); // Populate property details

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Find the associated property
    const property = await List.findById(booking.property);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Update booking status
    booking.status = "paymentsuccess";
    await booking.save();

    // Add the booking to the property bookings array
    property.bookings.push(booking._id);
    await property.save();

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


exports.bookingApprovedPending = async (req, res) => {
  try {
    const hostID = req.auth._id; 
    // console.log("start");
    
    const bookingPending = await Booking.find({ Host: hostID, status: "pending" })
    .populate('property', 'propertyTitle').populate('BClientId', 'fname ');
          
    if (!bookingPending || bookingPending.length === 0) {
      return res.status(200).json({ message: "No pending bookings" });
    }
       // console.log(bookingPending)
    res.status(200).json(bookingPending);
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.bookingApproved = async (req, res) => {
  try {
    const hostID = req.auth._id;
    const id = req.params.id;

    const bookingPending = await Booking.findOneAndUpdate(
      { _id: id, Host: hostID }, 
      { status: "hostApproved" },   
      { new: true }
    );
    if (!bookingPending) {
      return res.status(400).json({ message: "Unauthorized or Booking not found" });
    }
    res.status(200).json({ message: "Booking approved successfully" });
  } catch (error) {
    console.error("Error approving booking:", error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.allBookingListForHost = async (req, res) => {
  try {
    const hostID = req.auth._id; 
    const bookingPending = await Booking.find({ Host: hostID})
    .populate('property', 'propertyTitle').populate('BClientId', 'fname ');
    if (!bookingPending || bookingPending.length === 0) {
      return res.status(200).json({ message: "No pending bookings" });
    }
    res.status(200).json(bookingPending);
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.bookingPaymentClaim = async (req, res) => {
  try {
    const hostID = req.auth._id;
    const id = req.params.id;

    const bookingPending = await Booking.findOneAndUpdate(
      { _id: id, Host: hostID }, 
      { paymentClaim: "confirmed" },   
      { new: true }
    );
    if (!bookingPending) {
      return res.status(400).json({ message: "Unauthorized or Booking not found" });
    }
    res.status(200).json({ message: "Booking approved successfully" });
  } catch (error) {
    console.error("Error approving booking:", error);
    res.status(500).json({ error: "Server error" });
  }
};
