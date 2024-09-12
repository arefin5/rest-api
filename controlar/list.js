const List = require("../models/listModel");

exports.createList = async (req, res) => {
  try {
    const {
      title, images, typeOfproperty, typeOfguests, guest, bedRoom, beds, bathroom,
      wifi, tv, kitchen, washer, freeParking, paidParking, airCondition, dedicatedWorkSpace,
      pool, hottub, patio, bbqGrill, outdoorDiningArea, firePit, poolTable, indoorFirePlace,
      piano, exerciseEquipment, lakeAccess, beachAccess, ski, outdoorShower, safety, houseTitle,
      describehouse, description,location,
      price
    } = req.body;

    const newList = new List({
      title, images, typeOfproperty, typeOfguests,  guest, bedRoom, beds, bathroom,
      favorites: { wifi, tv, kitchen, washer, freeParking, paidParking, airCondition, dedicatedWorkSpace },
      safety, amenities: { pool, hottub, patio, bbqGrill, outdoorDiningArea, firePit, poolTable, indoorFirePlace, piano, exerciseEquipment, lakeAccess, beachAccess, ski, outdoorShower },
      houseTitle, describehouse, description,
      location,
      price,
       Postedby: req.user._id
    });

    const savedList = await newList.save();
    res.status(201).json(savedList);
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
