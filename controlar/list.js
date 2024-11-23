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

    // Find the document by ID
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Loop over the request body and update only provided fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        // Update fields in nested objects (deep update)
        if (typeof updateData[key] === 'object' && !Array.isArray(updateData[key])) {
          Object.keys(updateData[key]).forEach((nestedKey) => {
            list[key][nestedKey] = updateData[key][nestedKey];
          });
        } else {
          list[key] = updateData[key];
        }
      }
    });

    // Save the updated document
    const updatedList = await list.save();

    res.status(200).json(updatedList);
  } catch (error) {
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



// exports.getSingleList = async (req, res) => {
//   const listId = req.params.id;
  
//   try {
//     const list = await List.findById(listId)
//       .populate("Postedby", "fname lname profilePic isVerified")
//       .populate({
//         path: 'reviews',
//         populate: {
//           path: 'user',
//           select: 'name', // Only retrieve the user's name in reviews
//         }
//       });

//     if (!list) {
//       return res.status(404).json({ message: 'Listing not found' });
//     }

//     // Calculate average rating
//     const reviews = list.reviews;
//     let totalRating = 0;
//     reviews.forEach(review => {
//       totalRating += review.overallRating;
//     });
//     const avgRating = reviews.length ? (totalRating / reviews.length).toFixed(1) : 0;

//     // Return list with avgRating
//     res.status(200).json({
//       ...list.toObject(),
//       avgRating: avgRating,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'An error occurred while retrieving the listing' });
//   }
// };


// exports.getSingleList = async (req, res) => {
//   const listId = req.params.id;

//   try {
//     const list = await List.aggregate([
//       { $match: { _id: mongoose.Types.ObjectId(listId) } },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'Postedby',
//           foreignField: '_id',
//           as: 'Postedby',
//         },
//       },
//       {
//         $lookup: {
//           from: 'reviews',
//           localField: '_id',
//           foreignField: 'listId', // Assuming `listId` in the reviews collection references the list
//           as: 'reviews',
//         },
//       },
//       { $unwind: { path: "$Postedby", preserveNullAndEmptyArrays: true } },
//       {
//         $addFields: {
//           avgRating: { $avg: "$reviews.overallRating" },
//           totalReview: { $size: "$reviews" },
//         },
//       },
//       {
//         $project: {
//           "Postedby.fname": 1,
//           "Postedby.lname": 1,
//           "Postedby.profilePic": 1,
//           "Postedby.isVerified": 1,
//           avgRating: { $ifNull: [{ $round: ["$avgRating", 1] }, 0] },
//           totalReview: 1,
//           // Include other fields you want to return
//         },
//       },
//     ]);

//     if (!list || !list.length) {
//       return res.status(404).json({ message: 'Listing not found' });
//     }

//     res.status(200).json(list[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'An error occurred while retrieving the listing' });
//   }
// };

// exports.getSingleList = async (req, res) => {
//   const listId = req.params.id;

//   try {
//     const list = await List.aggregate([
//       { $match: { _id: new mongoose.Types.ObjectId(listId) } },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'Postedby',
//           foreignField: '_id',
//           as: 'Postedby',
//         },
//       },
//       {
//         $lookup: {
//           from: 'reviews',
//           localField: '_id',
//           foreignField: 'listId', // Assuming `listId` in the reviews collection references the list
//           as: 'reviews',
//         },
//       },
//       { $unwind: { path: "$Postedby", preserveNullAndEmptyArrays: true } },
//       {
//         $addFields: {
//           avgRating: { $avg: "$reviews.overallRating" },
//           totalReview: { $size: "$reviews" },
//         },
//       },
//       {
//         $project: {
//           "Postedby.fname": 1,
//           "Postedby.lname": 1,
//           "Postedby.profilePic": 1,
//           "Postedby.isVerified": 1,
//           avgRating: { $ifNull: [{ $round: ["$avgRating", 1] }, 0] },
//           totalReview: 1,
//           // Include other fields you want to return
//         },
//       },
//     ]);

//     if (!list || !list.length) {
//       return res.status(404).json({ message: 'Listing not found' });
//     }

//     res.status(200).json(list[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'An error occurred while retrieving the listing' });
//   }
// };


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
 
    //  console.log(req.body.aprovingmethod)
    const {
      typeOfproperty,
      propertyCondition,
      propertyTitle,
      description,
      outdoorShower,
      propertyFeature, 
      location,
      price,
      tax,
      serviceFee,
      GroundPrice,
      aprovingmethod,
      gender,
      image,
      amenities,
      bookingtype,
      Guest,
      totalroom,
      totalBed,
      availablecheck,
      checkInTime,
      checkOutTime,
      homerule
    } = req.body;
    if (!typeOfproperty || !propertyTitle || !price) {
      return res.status(400).json({ message: "Required fields are missing." });
    }
     let status="published"
 if(aprovingmethod==="instant") {
   status="published"
 }else{
  status="draft"
 }
    const newList = new List({
      typeOfproperty,
      propertyCondition,
      propertyFeature: { features: propertyFeature },
    
      homerule:{homesRoules:homerule},
      propertyTitle,
      bookingtype:{bookingTypes:bookingtype},
      description,
      outdoorShower,
      location,
      price,
      gender,
      tax,
      images:image,
      serviceFee,
      GroundPrice,
      Guest,
      totalroom,
      totalBed,
      availablecheck,
      checkInTime,
      checkOutTime,
      status,
      Postedby: req.auth._id, 
    });
    // Save the list in the database
    const savedList = await newList.save();
    // console.log(savedList)
    // Send response
    res.status(201).json(savedList);
  } catch (error) {
    // console.error('Error creating list:', error);
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

exports.listReveiw= async (req, res) => {
  const listId = req.params.id;

  try {
    const list = await List.fine()
    

    if (!list || !list.length) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(list[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving the listing' });
  }
};
// sortList 
// exports.SortLocation=async (req,res) => {
//   try {
//     // Extract query parameters
//     // console.log(req.query);
// //     console.log(req.body);

// //     // const { latitude, longitude, maxDistance = 500 } = req.query;
// //     const maxDistance = 500
// // const latitude=await req.body.location.latitude;
// // const longitude=await req.body.location.longitude

//     const { latitude, longitude, maxDistance = 500 } = req.body.locations || {};
//     const { checkinDate, checkoutDate } = req.body;
//    console.log(req.body);
   

//     // Validate inputs
//     if (!latitude || !longitude) {
//       return res.status(400).json({ error: 'Latitude and Longitude are required' });
//     }

//     // Geospatial query
//     const midpoint = {
//       type: "Point",
//       coordinates: [parseFloat(longitude), parseFloat(latitude)],
//     };

//     const results = await List.aggregate([
//       {
//         $geoNear: {
//           near: midpoint,
//           distanceField: "distance",
//           spherical: true,
//           maxDistance: parseInt(maxDistance), 
//           query: { status: "published" },
//         },
//       },
//       { $sort: { distance: 1 } }, // Sort by proximity
//     ]);
//    console.log(results)
//     res.status(200).json(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while fetching data' });
//   }
// }

exports.SortLocation = async (req, res) => {
  try {
      // Extract query parameters
      const { latitude, longitude, maxDistance = 500, checkinDate, checkoutDate } = req.query;

      console.log(req.query); // Check query parameters

      // Validate inputs
      if (!latitude || !longitude) {
          return res.status(400).json({ error: 'Latitude and Longitude are required' });
      }

      // Geospatial query
      const midpoint = {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };

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
          { $sort: { distance: 1 } }, // Sort by proximity
      ]);

      console.log(results);
      res.status(200).json(results);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data' });
  }
};
