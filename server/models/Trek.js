const mongoose = require('mongoose');

const trekSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Trek name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'hard'],
      required: [true, 'Difficulty is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: 'You can upload at most 10 images',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trek', trekSchema);
