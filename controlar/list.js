const List = require("../models/listModel");

exports.createList = async (req, res) => {
  try {
    const {
      typeOfproperty,
      propertyCondition,
      typeOfguests,
      propertyTitle,
      description,
      outdoorShower,
      propertyFeature, 
      favorites, 
      safety, 
      amenities, 
      totalroom, 
      totalBed, 
      availablecheck, 
      adults, 
      under14, 
      gender, 
      aprovingmethod, 
      price,
      serviceFee, 
      tex, 
      images,
      location, 
      bedge, 
    } = req.body;

    const newList = new List({
      typeOfproperty,
      propertyCondition,
      typeOfguests,
      propertyTitle,
      description,
      outdoorShower,
      propertyFeature, 
      favorites, 
      safety, 
      amenities, 
      totalroom, 
      totalBed, 
      availablecheck,
      adults,
      under14,
      gender,
      aprovingmethod,
      price,
      serviceFee,
      tex,
      images, 
      location,
      Postedby: req.auth._id, 
    });

    // Save the list in the database
    const savedList = await newList.save();

    // Send response
    res.status(201).json(savedList);
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.lists = async (req, res) => {
  // console.log(req.auth.)
  try {
    const list = await List.find({status:"active"})
      .populate("Postedby", "name")
      .sort({ createdAt: -1 })
      .limit(12);
    res.json(list);
  } catch (err) {
    console.log(err);
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
      .populate("Postedby", "name")
      if (!list) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      res.status(200).json(list);
  } catch (err) {
    console.log(err);
  }
}