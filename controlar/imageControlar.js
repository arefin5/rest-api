const cloudinary = require("cloudinary")
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