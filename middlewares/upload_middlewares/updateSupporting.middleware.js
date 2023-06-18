const multer = require('multer');
const path = require('path');

// This is for updating the supporting docs of application
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const app_id = req.params.id
        const destination = `upload/application_docs/${app_id}/`
        cb(null, destination)
    },
    filename: (req, file, cb) => {
        const originalName = path.parse(file.originalname).name;
        const extension = path.extname(file.originalname);
        const fileName = `${originalName}${extension}`;
        cb(null, fileName);
    }
});

const updateSupportingDocs = multer({ storage }).array('supporting_docs', 5);

module.exports = updateSupportingDocs