const path = require("path")
const Application = require("../../models/application.model");
const fs = require('fs');

module.exports.downloadFile = (req, res) => {
    const filename = req.params.filename;
    const foldername = req.params.folder;

    let download_doc = '';

    if (foldername !== "certificates" && foldername !== "notices" && foldername !== "orders" && foldername !== "society_logos") {
        download_doc = `../../upload/application_docs/${foldername}`
    }
    else {
        download_doc = `../../upload/${foldername}`
    }
    const filePath = path.join(__dirname, download_doc, filename);

    res.download(filePath, (error) => {
        if (error) {
            console.error('Error downloading file:', error);
            res.status(500).json({ message: 'Error downloading file' });
        }
    });
}

module.exports.deleteFile = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const fileName = req.params.filename;
        const filePath = path.join(__dirname, `../../../upload/application_docs/${applicationId}/${fileName}`);
        fs.unlink(filePath, async (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ success: false, message: 'internal Server Error' });
            }
            const data = await Application.findOne({ _id: applicationId });
            // const support = 
            const application_data = await Application.updateOne(
                { _id: applicationId },
                {
                    $set: {
                        supporting_documents: data.supporting_documents.filter(item => item !== fileName)
                    }
                }
            )

            res.status(200).json({ success: true, message: 'File deleted successfully' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        })
    }

}
