const List = require("../models/listModel");
const User=require("../models/userModel")


exports.lists = async (req, res) => {
  try {
    // Fetch lists with associated reviews and users
    const lists = await List.find({ status: "published" })
      .populate("Postedby", "name profilePic isVerified") // Populate Postedby field with user name
      .populate({
        path: 'reviews',
        populate: {
          path: 'user', // Populate user data in the review
          select: 'name', // Only retrieve the name field
        }
      })
      .sort({ createdAt: -1 })
      // .limit(12);

    // Optionally calculate average ratings
    const listsWithAvgRating = lists.map(list => {
      const reviews = list.reviews;
      let totalRating = 0;
      reviews.forEach(review => {
        totalRating += review.overallRating; // Sum up the overall ratings
      });
      const avgRating = reviews.length ? (totalRating / reviews.length).toFixed(1) : 0;

      return {
        ...list.toObject(),
        avgRating: avgRating, // Add average rating to each list
      };
    });

    res.json(listsWithAvgRating);
  } catch (err) {
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
      .populate("Postedby", "name profilePic isVerified")
      if (!list) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      res.status(200).json(list);
  } catch (err) {
    console.log(err);
  }
}
exports.allListByUser = async (req, res) => {
  try {
    const list = await List.find({
      Postedby: req.auth._id
    })
      .populate("Postedby", "name")
      .sort({ createdAt: -1 })
      .limit(12);
if(!list ){
  return res.status(400).json({
    error:"user has no List "
  })
}
    res.json(list);
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
    console.error('Error creating list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
