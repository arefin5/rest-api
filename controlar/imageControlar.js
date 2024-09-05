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
      // Check if files were uploaded
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "No files were uploaded." });
      }
   // Check if files were uploaded
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "No files were uploaded." });
      }
      // Normalize files to an array
      let filesArray = [];
      for (const key in req.files) {
        if (Array.isArray(req.files[key])) {
          filesArray.push(...req.files[key]); // If it's already an array, add all files
        } else {
          filesArray.push(req.files[key]); // If it's a single file, add to the array
        }
      }
     
      // Check if files array is empty
      if (filesArray.length === 0) {
        return res.status(400).json({ message: "No files were uploaded." });
      }
   // Check if files array is empty or contains less than 5 images
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
  
      res.json(images);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error uploading images", error: err });
    }
  };
exports.uploadImage = async (req, res) => {
    // console.log("req files => ",req.files);
    try {
      const result = await cloudinary.uploader.upload(req.files.image.path);
      // console.log("uploaded image url => ", result);
      res.json({
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (err) {
      console.log(err);
    }
  };



// exports.UplodadSinglePrivete =async (req, res) => {
//   try {
//     const newImage = new Image({
//       url: '',
//       public_id: shortid.generate(), // Generate a unique public_id
//     });

//     // Save the uploaded file to the database
//     newImage.url = 'data:image/png;base64,' + req.file.buffer.toString('base64');
//     await newImage.save();

//     res.status(201).json({ message: 'File uploaded successfully',public_id: newImage.public_id  });
//     console.log("success");
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }


// exports.UplodadSinglePrivete =async (req, res) => {
//   try {
//     const newImage = new Image({
//       url: '',
//       public_id: shortid.generate(), // Generate a unique public_id
//     });
//      console.log(req.files)
//     // // Save the uploaded file to the database
//     newImage.url = 'data:image/png;base64,' + req.file.buffer.toString('base64');
//     // await newImage.save();

//     // res.status(201).json({ message: 'File uploaded successfully',public_id: newImage.public_id  });
//         res.status(201).json({ message: 'File uploaded successfully',newImage  });

    
//      console.log("success");
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }


// exports.UplodadSinglePrivete = async (req, res) => {
//   try {
//     const images = req.files.image; // Get the array of images

//     // Check if there's only one file (it might not be an array in that case)
//     const imageFiles = Array.isArray(images) ? images : [images];

//     const savedImages = [];

//     for (const image of imageFiles) {
//       // Read the file into a buffer
//       const fileBuffer = fs.readFileSync(image.path);
      
//       const newImage = new Image({
//         url: 'data:' + image.type + ';base64,' + fileBuffer.toString('base64'),
//         public_id: shortid.generate(),
//       });

//       await newImage.save(); // Save to the database
//       savedImages.push(newImage);
//     }

//     res.status(201).json({ message: 'Files uploaded successfully', images: savedImages });
//     console.log("success");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };


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