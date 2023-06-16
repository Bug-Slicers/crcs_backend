const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set storage options for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder;
        if (file.fieldname === 'certificate') {
            folder = 'upload/certificates';
        } else if (file.fieldname === 'order') {
            folder = 'upload/orders';
        } else if (file.fieldname === 'notice') {
            folder = 'upload/notices';
        }
        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const applicationId = req.params.id;
        const fileName = `${file.fieldname}_${applicationId}.pdf`;
        cb(null, fileName);
    },

    overwrite: true
});

const upload = multer({ storage });



// Middleware to handle file uploads
const uploadFiles = (req, res, next) => {
    upload.fields([
        { name: 'certificate', maxCount: 1 },
        { name: 'order', maxCount: 1 },
        { name: 'notice', maxCount: 1 },
    ])(req, res, (err) => {
        if (err) {
            console.error('Error uploading files:', err);
            return res.status(500).json({ message: 'Error uploading files' });
        }
        next();
    });
};

module.exports = {
    uploadFiles,
};
