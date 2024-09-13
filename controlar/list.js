const List = require("../models/listModel");

// exports.createList = async (req, res) => {
//   try {
//     const {
//       title, images, typeOfproperty, typeOfguests, guest, bedRoom, beds, bathroom,
//       wifi, tv, kitchen, washer, freeParking, paidParking, airCondition, dedicatedWorkSpace,
//       pool, hottub, patio, bbqGrill, outdoorDiningArea, firePit, poolTable, indoorFirePlace,
//       piano, exerciseEquipment, lakeAccess, beachAccess, ski, outdoorShower, safety,
//       describehouse, description,location,
//       propertyCondition,
//       propertyTitle,
//       price
//     } = req.body;

//     const newList = new List({
//       title, images, typeOfproperty, typeOfguests,  guest, bedRoom, beds, bathroom,
//       favorites: { wifi, tv, kitchen, washer, freeParking, paidParking, airCondition, dedicatedWorkSpace },
//       safety, amenities: { pool, hottub, patio, bbqGrill, outdoorDiningArea, firePit, poolTable, indoorFirePlace, piano, exerciseEquipment, lakeAccess, beachAccess, ski, outdoorShower },
//        describehouse, description,
//       location,
//       propertyCondition,
//       propertyTitle,
//       price,
      
//        Postedby: req.user._id
//     });

//     const savedList = await newList.save();
//     res.status(201).json(savedList);
//   } catch (error) {
//     console.error('Error creating list:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



exports.createList = async (req, res) => {
  try {
    const {
      typeOfproperty,
      propertyCondition,
      typeOfguests,
      propertyTitle,
      description,
      outdoorShower,
      propertyFeature, // List of property features (array)
      favorites, // Object with amenities like wifi, tv, etc.
      safety, // Safety features object
      amenities, // Object for amenities
      totalroom, // Object for total rooms
      totalBed, // Object for total beds
      availablecheck, // Date for availability
      adults, // Number of adults
      under14, // Number of guests under 14
      gender, // Gender preference
      aprovingmethod, // Approval method (instant or manual)
      price, // Price of the property
      serviceFee, // Service fee
      tex, // Tax
      images, // Images array (with url and public_id)
      location, // Object with location data
      bedge, // Badge or special recognition
      status // Active/inactive status
    } = req.body;

    const newList = new List({
      typeOfproperty,
      propertyCondition,
      typeOfguests,
      propertyTitle,
      description,
      outdoorShower,
      propertyFeature, // Expecting an array here
      favorites, // Should match the FavoritesSchema structure
      safety, // Should match the safetySchema structure
      amenities, // Should match the AmenitiesSchema structure
      totalroom, // Should match totalroomSchema
      totalBed, // Should match totalBedSchema
      availablecheck, // Should match availableDateSchema
      adults,
      under14,
      gender,
      aprovingmethod,
      price,
      serviceFee,
      tex,
      images, // Expecting an array of image objects {url, public_id}
      location, // Should match the location object in schema
      bedge,
      status,
      Postedby: req.user._id, // Assuming the user is authenticated
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
