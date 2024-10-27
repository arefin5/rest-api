const Image=require("../models/Image")
const cloudinary = require("cloudinary");
const shortid = require('shortid');
const fs = require('fs');

cloudinary.config({
  cloud_name: "arefintalukder5",
  api_key: "622592679337996",
  api_secret: "lQqwTTsKLLgm0F3_yasknj-jefg",
});
exports.uploadImagesMultiple = async (req, res) => {
  try {
    // Ensure files were uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    // Normalize files to an array
    let filesArray = [];
    for (const key in req.files) {
      if (Array.isArray(req.files[key])) {
        filesArray.push(...req.files[key]); // If it's an array, add all files
      } else {
        filesArray.push(req.files[key]); // If it's a single file, add to the array
      }
    }

    // Validate if at least 5 files are uploaded
    if (filesArray.length < 5) {
      return res.status(400).json({ message: "A minimum of 5 files is required." });
    }

    // Upload each file to Cloudinary
    const uploadPromises = filesArray.map(file =>
      cloudinary.uploader.upload(file.path)
    );

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);

    // Map results to get URLs and public IDs
    const images = results.map(result => ({
      url: result.secure_url,
      public_id: result.public_id,
    }));

    // Respond with the uploaded images' URLs and IDs
    res.json(images);
  } catch (err) {
    console.error("Error uploading images:", err);
    res.status(500).json({ message: "Error uploading images", error: err });
  }
};
// exports.uploadImagesMultiple = async (req, res) => {
//     try {
//       // Check if files were uploaded
//       console.log(req.files);
//       console.log(req.body);
//       if (!req.files || Object.keys(req.files).length === 0) {
//         return res.status(400).json({ message: "No files were uploaded." });
//       }
//    // Check if files were uploaded
//       if (!req.files || Object.keys(req.files).length === 0) {
//         return res.status(400).json({ message: "No files were uploaded." });
//       }
//       // Normalize files to an array
//       let filesArray = [];
//       for (const key in req.files) {
//         if (Array.isArray(req.files[key])) {
//           filesArray.push(...req.files[key]); // If it's already an array, add all files
//         } else {
//           filesArray.push(req.files[key]); // If it's a single file, add to the array
//         }
//       }
     
//       // Check if files array is empty
//       if (filesArray.length === 0) {
//         return res.status(400).json({ message: "No files were uploaded." });
//       }
//    // Check if files array is empty or contains less than 5 images
//       if (filesArray.length < 5) {
//         return res.status(400).json({ message: "A minimum of 5 files is required." });
//       }
//       // Upload each file to Cloudinary
//       const uploadPromises = filesArray.map(file =>
//         cloudinary.uploader.upload(file.path)
//       );
  
//       // Wait for all uploads to complete
//       const results = await Promise.all(uploadPromises);
  
//       // Map results to get URLs and public IDs
//       const images = results.map(result => ({
//         url: result.secure_url,
//         public_id: result.public_id,
//       }));
  
//       res.json(images);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Error uploading images", error: err });
//     }
//   };
exports.uploadImage = async (req, res) => {
    console.log("req files => ",req.files);
    try {
      const result = await cloudinary.uploader.upload(req.files.image.path);
      console.log("uploaded image url => ", result);
      res.json({
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (err) {
      console.log(err);
    }
  };


exports.UplodadSinglePrivete = async (req, res) => {
  try {
    // Assume we're dealing with a single file
    const image = req.files.image[0]; // Access the first image in the array

    // Read the file into a buffer
    const fileBuffer = fs.readFileSync(image.path);
      
    const newImage = new Image({
      url: 'data:' + image.type + ';base64,' + fileBuffer.toString('base64'),
      public_id: shortid.generate(), // Generate a unique public_id
    });

    await newImage.save(); // Save to the database

    res.status(201).json({ message: 'File uploaded successfully', image: newImage });
    console.log("success");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
// 

// exports.uploadVerifyImages = async (req, res) => {
//   try {
//     console.log(req.user)
//     const imagesArray = req.files.image; // Assuming this is an array of images
//     const savedImages = [];

//     for (let image of imagesArray) {
//       const fileBuffer = fs.readFileSync(image.path);
      
//       const newImage = new Image({
//         url: 'data:' + image.type + ';base64,' + fileBuffer.toString('base64'),
//         public_id: shortid.generate(), // Generate a unique public_id
//       });

//       await newImage.save(); // Save each image to the database
//       savedImages.push(newImage); // Push to the result array
//     }

//     res.status(201).json({ message: 'Files uploaded successfully', images: savedImages });
//     console.log("success");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

exports.uploadVerifyImages = async (req, res) => {
  try {
    console.log(req.user);
    
    const imagesArray = req.files.image; // Assuming this is an array of images
    const savedImages = [];

    for (let image of imagesArray) {
      const fileBuffer = fs.readFileSync(image.path);
      
      const newImage = new Image({
        url: 'data:' + image.type + ';base64,' + fileBuffer.toString('base64'),
        public_id: shortid.generate(), // Generate a unique public_id
        categories: req.body.categories || 'nid', // You can pass the category from the request body
        user: req.user._id, // Assuming the user info is available in req.user
      });

      await newImage.save(); // Save each image to the database
      savedImages.push(newImage); // Push to the result array
    }

    res.status(201).json({ message: 'Files uploaded successfully', images: savedImages });
    console.log("success");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 
exports.getVerificationImage= async (req, res) => {
 try {
   const image = await Image.find({ user : req.user.id});
   if (!image) {
     return res.status(404).json({ message: 'Image not found' });
   }
   res.status(200).json({ image });
 } catch (error) {
   res.status(500).json({ message: 'Internal Server Error' });
 }
}
exports.GetImage=async (req, res) => {
  //  console.log(req.user)
  //  

  try {
    const image = await Image.findOne({ public_id: req.params.public_id });
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.status(200).json({ image });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


