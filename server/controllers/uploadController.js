const fs = require('fs');
const cloudinary = require('../config/cloudinary');

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'trek-planner',
    });

    fs.unlink(filePath, () => {});

    res.status(201).json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
};
