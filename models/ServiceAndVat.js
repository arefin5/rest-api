const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServiceAndVatSchema = new Schema(
  {
    taxRate: {
      type: Number,
      required: true, // Enforces that taxRate must be provided, with a default fallback
      default: 0.06,
      min: 0, // Ensures non-negative values
    },
    price: {
      type: Number,
      required: true, 
      default: 0,
      min: 0, 
    },
    serviceFee: {
      type: Number,
      required: true,
      default: 0.10,
      min: 0, 
    },
  },
  { 
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    versionKey: false, // Removes `__v` field from the documents
  }
);

// Middleware to prevent creation of new documents
ServiceAndVatSchema.pre('save', async function (next) {
  const existingDocuments = await mongoose.models.ServiceAndVat.countDocuments();
  if (existingDocuments > 0 && this.isNew) {
    const error = new Error('Creation of additional documents is not allowed.');
    error.name = 'DocumentCreationError';
    return next(error);
  }
  next();
});

module.exports = mongoose.model('ServiceAndVat', ServiceAndVatSchema);
