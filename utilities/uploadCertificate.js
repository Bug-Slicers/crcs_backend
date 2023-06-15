const multer = require('multer');

// Set storage options for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/certificates/'); // Define the destination folder for certificate uploads
    },

    filename: (req, file, cb) => {
        const society_id = req.params.id;
        cb(null, `certificate_${society_id}.pdf`); // Generate a unique filename for the certificate
    },
});

const upload = multer({ storage });
const uploadCertificate = upload.single('certificate');

module.exports = {
    uploadCertificate,
}