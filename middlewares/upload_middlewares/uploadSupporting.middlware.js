const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set storage options for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const society_id = req.Society._id;
        const destination = `upload/application_docs/${society_id}/`;
        console.log("destination", destination)
        fs.mkdirSync(destination, { recursive: true }); // Create the directory if         

        cb(null, destination);
    },
    filename: (req, file, cb) => {
        const originalName = path.parse(file.originalname).name;
        const extension = path.extname(file.originalname);
        const fileName = `${originalName}_${extension}`;
        cb(null, fileName);
    },
});

// Create the file upload middleware
const uploadSupportingDocuments = multer({ storage }).array('supporting_docs', 5);

module.exports = uploadSupportingDocuments;