const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();



const uploadDir = path.join(__dirname, '..', 'tmp');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });



router.post('/image', protect, upload.single('image'), uploadImage);



module.exports = router;
