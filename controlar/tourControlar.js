exports.createTour = async (req, res) => {
  try {
    const {
    
      location,
      price,
      tax,
      serviceFee,
      GroundPrice,
      aprovingmethod,
      gender,
      image,
      availablecheck,
    } = req.body;

    if (!typeOfproperty || !propertyTitle || !price) {
      console.log(req.body.availablecheck);
      return res.status(400).json({ message: "Required fields are missing." });
    }

    let status = aprovingmethod === "instant" ? "published" : "draft";


    // if(location?.coordinates){
    //   location.coordinates=[90.388964,23.764287]
    // }
// console.log(amenities);
// console.log(location);
    const newList = new Tour({
      location,
      price,
      gender,
      tax,
      images: image,
      serviceFee,
      GroundPrice,
      Guest,
      availablecheck,
      status,
      Postedby: req.auth._id,
    });

    // Save the list in the database
    const savedList = await newList.save();
    // console.log(savedList);

    // Send response
    res.status(201).json(savedList);
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};