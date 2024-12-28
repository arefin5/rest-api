const List = require("../models/listModel");
const User=require("../models/userModel")
const Booking = require("../models/bookingSchema"); 

const mongoose = require('mongoose');

exports.lists = async (req, res) => {
  try {
    const listsWithAvgRating = await List.find({ status: "published" })
    .populate("Postedby", "fname lname profilePic isVerified")
    .populate("reviews", "avgRating")
    .sort({ createdAt: -1 })
     
    res.status(200).json(listsWithAvgRating)
  }
   catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while fetching the lists' });
  }
};


exports.updateList = async (req, res) => {
  try {
    const listId = req.params.id;
    const updateData = req.body;
  //  console.log(updateData)
    
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: 'Listing not found' });
    }

   
     list.aprovingmethod = updateData.aprovingmethod;
     list.location=updateData.location;
     list.typeOfproperty= updateData.typeOfproperty;
     list.propertyFeature=updateData.propertyFeature;
     list.homeRule=updateData.homeRule;
     list.bookingTypes=updateData.bookingTypes;
     list.propertyCondition=updateData.propertyCondition;
    list.typeOfguests=updateData.typeOfguests;
    list.propertyTitle=updateData.propertyTitle;
    list.description=updateData.description;
    list.amenities=updateData.amenities;
    list.Guest=updateData.Guest;
    list.totalroom=updateData.totalroom;
    list.totalBed=updateData.totalBed;
    list.availablecheck=updateData.availablecheck;
    list.gender=updateData.gender;
    list.GroundPrice=updateData.GroundPrice;
    list.images=updateData.images;
    list.checkInTime=updateData.checkInTime;
    list.checkOutTime=updateData.checkOutTime

    // Save the updated document to the database
    const updatedList = await list.save();
    console.log(updatedList)
    res.status(200).json(updatedList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSinglelist = async (req, res) => {
  try {
    const listId = req.params.id;
    const list = await List.findByIdAndDelete(listId);
    if (!list) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Return success message after deletion
    res.status(200).json({
      message: "Listing deleted successfully",
    });
  } catch (error) {
    // Return server error if any issues occur
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleList=async (req, res) => {
  const listId = req.params.id;
  // console.log(listId)
  try {
    const list = await List.findById(listId)
      .populate("Postedby", "fname lname profilePic isVerified")
      if (!list) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      res.status(200).json(list);
  } catch (err) {
    console.log(err);
  }
}


exports.allListByUser = async (req, res) => {
  // console.log(req.auth._id)
  try {
    const list = await List.find({
      Postedby: req.auth._id
    })
      .sort({ createdAt: -1 })
      .limit(12);
if(!list ){
  return res.status(400).json({
    error:"user has no List "
  })
}
    res.json(list);
    // console.log(list)
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.HostCheck=async(req,res)=>{
  try {
    // Find the user by ID from the authenticated request
    const user = await User.findById(req.auth._id);
    
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Assuming you have an 'isHost' field to check host status
    if (user.role==="host") {
      return res.status(200).json({ isHost: true, message: "User is a host" });
    } else {
      return res.status(400).json({ isHost: false, message: "User is not a host" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
}


exports.createList = async (req, res) => {
  try {
    const {
      typeOfproperty,
      propertyCondition,
      propertyTitle,
      description,
      outdoorShower,
      propertyFeature,
      // location,
      price,
      tax,
      serviceFee,
      GroundPrice,
      aprovingmethod,
      gender,
      image,
      amenities,
      bookingTypes,
      Guest,
      totalroom,
      totalBed,
      availablecheck,
      checkInTime,
      checkOutTime,
      homeRule,
    } = req.body;
    console.log("req.body,===>",req.body.bookingTypes);

   

   let location = req.body.location || {};

    // // Add default location type and coordinates
    // location.type = location.type || "Point";
    // location.coordinates = location.coordinates || [90.388964, 23.764287];
    const newList = new List({
      typeOfproperty,
      propertyCondition,
      propertyFeature: propertyFeature,
      homeRule: homeRule,
      propertyTitle,
      bookingTypes:bookingTypes,
      amenities:amenities,
      description,
      outdoorShower,
      location:location,
      price,
      gender,
      tax,
      images: image,
      serviceFee,
      GroundPrice,
      Guest,
      totalroom,
      totalBed,
      availablecheck,
      checkInTime,
      checkOutTime,
      Postedby: req.auth._id,
      aprovingmethod:aprovingmethod,
    });

    // Save the list in the database
    const savedList = await newList.save();
    console.log(savedList);

    // Send response
    res.status(201).json(savedList);
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.authorBookingDetails = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'property',         
        match: { Postedby: req.auth._id },
      })
      .exec();

    // Filter out any bookings where 'property' is null due to the match condition
    const filteredBookings = bookings.filter(booking => booking.property !== null);

    if (filteredBookings.length === 0) {
      return res.status(400).json({
        error: "User has no bookings for their properties",
      });
    }

    res.json(filteredBookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.listReveiw= async (req, res) => {
  const listId = req.params.id;

  try {
    const list = await List.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(listId) } }, 
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'listId', 
          as: 'reviews',
        },
      },
      {
        $addFields: {
          avgRating: { $avg: "$reviews.overallRating" },
          totalReview: { $size: "$reviews" },
        },
      },
      {
        $project: {
          avgRating: { $ifNull: [{ $round: ["$avgRating", 1] }, 0] },
          totalReview: 1,
          // Add any other list-specific fields you want to return
        },
      },
    ]);

    if (!list || !list.length) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(list[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving the listing' });
  }
};

exports.SortLocation = async (req, res) => {
  try {
    // Extract query parameters
    const {
      latitude,
      longitude,
      maxDistance = 500,
      checkinDate,
      checkoutDate,
      guestCount,
    } = req.query;

    // Validate required inputs
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }
    if (!checkinDate || !checkoutDate) {
      return res.status(400).json({ error: "Check-in and check-out dates are required" });
    }

    // Parse input dates
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);

    if (isNaN(checkin) || isNaN(checkout)) {
      return res.status(400).json({ error: "Invalid date format for check-in or check-out" });
    }

    const totalGuests = parseInt(guestCount, 10);
    if (isNaN(totalGuests) || totalGuests < 0) {
      return res.status(400).json({ error: 'Invalid guest count' });
    }

    const midpoint = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };

    // Aggregation to fetch properties within the defined distance
    const results = await List.aggregate([
      {
        $geoNear: {
          near: midpoint,
          distanceField: "distance",
          spherical: true,
          maxDistance: parseInt(maxDistance),
          query: { status: "published" },
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "property",
          as: "bookings",
        },
      },
      {
        $match: {
          $and: [
            {
              $or: [
                { bookings: { $exists: false } },
                { bookings: { $size: 0 } },
                {
                  bookings: {
                    $not: {
                      $elemMatch: {
                        checkinDate: { $lt: checkout },
                        checkoutDate: { $gt: checkin },
                      },
                    },
                  },
                },
              ],
            },
            {
              $expr: {
                $gte: [
                  {
                    $add: [
                      { $ifNull: ["$Guest.adultGuest", 0] },
                      { $ifNull: ["$Guest.childrenGuest", 0] },
                    ],
                  },
                  totalGuests,
                ],
              },
            },
          ],
        },
      },
      { $sort: { distance: 1 } },
    ]);

    // Send the results as an array
    // console.log(results)
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
