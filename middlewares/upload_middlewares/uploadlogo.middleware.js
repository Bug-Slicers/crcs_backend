const multer = require('multer');
const path = require('path');
const fs = require('fs');



// Set storage options for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destination = 'upload/society_logos';
        fs.mkdirSync(destination, { recursive: true });
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        const fileName = 'temp.jpeg';
        cb(null, fileName);
    },
    overwrite: true
});

const upload = multer({ storage });
// Middleware to handle file uploads
const uploadLogo = (req, res, next) => {
    upload.fields([
        { name: 'society_logo', maxCount: 1 }
    ])(req, res, (err) => {
        if (err) {
            console.error('Error uploading files:', err);
            return res.status(500).json({ message: 'Error uploading files' });
        }
        next();
    });
};

module.exports = {
    uploadLogo,
};
