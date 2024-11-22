const User = require("../models/userModel");
const List = require('../models/listModel'); 
const Booking = require("../models/bookingSchema"); 
const FailedBooking = require('../models/failedBookingSchema'); 

const { initPayment } = require('../service/payment');

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
      const users = await User.find();
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
  exports.getAllList=async(req,res)=>{
    try {
      const list = await List.find();
      if (!list) {
        return res.status(400).json({ message: 'there are no list found' });
      }
      res.status(200).json({
        list,
        message:"all List"
      });
    } catch (error) {
      res.status(500).json({ message: 'Error checking availability', error });
    }
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
  