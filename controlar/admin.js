const User = require("../models/userModel");
const List = require('../models/listModel'); 
const Booking = require("../models/bookingSchema"); 
const FailedBooking = require('../models/failedBookingSchema'); 

const { initPayment } = require('../service/payment');
const ServiceAndVat = require("../models/ServiceAndVat");

exports.getFailedBookings = async (req, res) => {
    try {
      const failedBookings = await FailedBooking.find().populate('user').populate('property');
      res.status(200).json(failedBookings);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving failed bookings', error });
    }
  };
  exports.getAllBooking=async(req,res)=>{
    try {
      const booking = await Booking.find({status:"confirmed"}).populate({
        path: 'property',
        select: 'propertyTitle description image', // Select only specific fields
      })
      .populate({
        path: 'user', // Assuming you have a reference to the user in the booking model
        select: 'name email', // Select specific fields from user
      })
      .exec();
      if (!booking) {
        return res.status(400).json({ message: 'there are no list found' });
      }
      res.status(200).json({
        booking,
        message:"all Booking"
      });
    } catch (error) {
      res.status(500).json({ message: 'Error checking availability', error });
    }
  }
  exports.getAllPanding=async(req,res)=>{
    try {
      const booking = await Booking.find({status:"pending"}).populate({
        path: 'property',
        select: 'propertyTitle description image', // Select only specific fields
      })
      .populate({
        path: 'user', // Assuming you have a reference to the user in the booking model
        select: 'name email', // Select specific fields from user
      })
      .exec();
      if (!booking) {
        return res.status(400).json({ message: 'there are no list found' });
      }
      res.status(200).json({
        booking,
        message:"all Booking"
      });
    } catch (error) {
      res.status(500).json({ message: 'Error checking availability', error });
    }
  }
  // update put 
  exports.aprovedBooking = async (req, res) => {
    const { id } = req.params;
  
    try {
        // Find the single blog by id
        const booking = await Booking.findById(id);
  
        if (!booking) {
            return res.status(404).json({ error: 'List not found' });
        }
        // Update the status to 'published'
        booking.status = 'confirmed';
        await booking.save();
        res.status(200).json({ message: 'booking approved successfully', booking });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  exports.aprovedList = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the single blog by id
        const list = await List.findById(id);
  
        if (!list) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        // Update the status to 'published'
        list.status = 'active';
        await list.save();
        res.status(200).json({ message: 'list approved successfully', list });
    } catch (error) {
        console.error('Error updating list status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  exports.aprovedAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the single blog by id
        const  user= await User.findById(id);
  
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }
        // Update the status to 'published'
        user.role = 'admin';
        await user.save();
        res.status(200).json({ message: 'user approved successfully', user });
    } catch (error) {
        console.error('Error updating user Role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  // admin
exports.getAlluser=async(req,res)=>{
    try {
      const users = await User.find({role:"user"});
      if (!users) {
        return res.status(400).json({ message: 'This user not found' });
      }
      res.status(200).json({
        users,
        message:"all user"
      });
    } catch (error) {
      res.status(500).json({ message: 'Error checking availability', error });
    }
  }
  exports.getAllhost=async(req,res)=>{
    try {
      const users = await User.find({role:"host"});
      if (!users) {
        return res.status(400).json({ message: 'This user not found' });
      }
      res.status(200).json({
        users,
        message:"all user"
      });
    } catch (error) {
      res.status(500).json({ message: 'Error checking availability', error });
    }
  }
  exports.allBookingPaymentHost = async (req, res) => {
    try {
      const hostID = req.auth._id;
  
      // Fetch bookings for the specific host with successful payment status
      const bookings = await Booking.find({ Host: hostID, status: "paymentsuccess" });
  
      // If no bookings are found
      if (bookings.length === 0) {
        return res.status(404).json({ message: 'No bookings found for this host' });
      }
  
      // Return the found bookings
      res.status(200).json({
        bookings,
        message: "All bookings for this host with successful payments"
      });
    } catch (error) {
      res.status(500).json({ message: 'Error checking booking availability', error });
    }
  };
  
  exports.allBookingPayment=async(req,res)=>{
    try {
      const booking = await Booking.find({status:"paymentsuccess"});
      if (!booking) {
        return res.status(400).json({ message: 'This user not found' });
      }
      res.status(200).json({
        booking,
        message:"all booking"
      });
    } catch (error) {
      res.status(500).json({ message: 'Error checking availability', error });
    }
  }
  exports.getAllList=async(req,res)=>{
    try {
      const list = await List.find()
      if (!list) {
        return res.status(400).json({ message: 'there are no list found' });
      }
      console.log("list")
      res.status(200).json({
        list,
        message:"all List"
      });
    } catch (error) {
      res.status(500).json({ message: 'Error checking availability', error });
    }


  //   try {
  //   // Retrieve and sort `List` by price (ascending order)
  //   const sortedLists = await List.find()
  //     .sort({ price: 1 }); // Replace `price` with your desired field if needed.

  //   // Retrieve and sort `Booking` by check-in date (ascending order)
  //   const sortedBookings = await Booking.find()
  //     .populate("property", "propertyTitle") // Populate property details
  //     .populate("Host", "name email") // Populate host details
  //     .populate("BClientId", "name email") // Populate client details
  //     .sort({ checkinDate: 1 }); // Replace `checkinDate` with the desired field.

  //   // Check if data exists
  //   if (!sortedLists.length && !sortedBookings.length) {
  //     return res.status(404).json({ message: "No lists or bookings found" });
  //   }

  //   // Combine both results and respond
  //   res.status(200).json({
  //     message: "Sorted lists and bookings retrieved successfully",
  //     data: {
  //       lists: sortedLists,
  //       bookings: sortedBookings,
  //     },
  //   });
  //   console.log(res)
  // } catch (error) {
  //   console.error("Error retrieving lists and bookings:", error);
  //   res.status(500).json({
  //     message: "Error retrieving sorted data",
  //     error: error.message,
  //   });
  // }
  }
  exports.blockuser=async (req, res) => {
    try{
      const userId = req.params.id
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Set the role to 'host'
      user.status = 'inactive';
      // Save the updated user document
      await user.save();
      // Send a response indicating success
      res.json({ message: 'Role updated to host successfully', user });
    }
   catch (error) {
      console.error('Error updating role:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  exports.aprovedListPublished = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the single blog by id
        const list = await List.findById(id);
  
        if (!list) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        // Update the status to 'published'
        list.status = 'published';
        await list.save();
        res.status(200).json({ message: 'list approved successfully', list });
    } catch (error) {
        console.error('Error updating list status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  // allbooking
  exports.allBookingList = async (req, res) => {
    try {
      const hostID = req.auth._id; 
      const bookinglist = await Booking.find()
      .populate('property', 'propertyTitle').populate('BClientId', 'fname ');
      if (!bookinglist || bookinglist.length === 0) {
        return res.status(200).json({ message: "No pending bookings" });
      }
      res.status(200).json(bookinglist);
    } catch (error) {
      console.error("Error fetching pending bookings:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  exports.getRateOfService=async(req,res)=>{
    try {
      const serviceAndVat = await ServiceAndVat.findOne();
      if (!serviceAndVat) {
        console.log('No ServiceAndVat document found.');
        return null;
      }
      // console.log('ServiceAndVat document:', serviceAndVat);
      res.status(200).json(serviceAndVat);
      
    } catch (error) {
      console.error('Error fetching ServiceAndVat document:', error);
      throw error;
    }
  }

  exports.createVat= async (req, res) => {

    try {
      const { taxRate, serviceFee } = req.body;
  
      // Check if a document already exists
      const existingDocument = await ServiceAndVat.findOne();
      if (existingDocument) {
        return res.status(400).json({
          message: 'ServiceAndVat document already exists',
          data: existingDocument,
        });
      }
  
      // Create the first document with provided parameters
      const newDocument = new ServiceAndVat({
        taxRate: taxRate ?? 0.06, // Default to 0.06 if not provided
        serviceFee: serviceFee ?? 0.10, // Default to 0.10 if not provided
      });
      const savedDocument = await newDocument.save();
  
      return res.status(201).json({
        message: 'ServiceAndVat document created successfully',
        data: savedDocument,
      });
    } catch (error) {
      console.error('Error creating ServiceAndVat document:', error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
  exports.updateVat=async (req, res) => {
  try {
    const { taxRate, serviceFee } = req.body;

    // Check if the document exists
    const existingDocument = await ServiceAndVat.findOne();
    if (!existingDocument) {
      return res.status(404).json({
        message: 'ServiceAndVat document not found. Please create one first.',
      });
    }

    // Update the document with provided values
    existingDocument.taxRate = taxRate ?? existingDocument.taxRate; // Only update if taxRate is provided
    existingDocument.serviceFee = serviceFee ?? existingDocument.serviceFee; // Only update if serviceFee is provided

    const updatedDocument = await existingDocument.save();

    return res.status(200).json({
      message: 'ServiceAndVat document updated successfully',
      data: updatedDocument,
    });
  } catch (error) {
    console.error('Error updating ServiceAndVat document:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
