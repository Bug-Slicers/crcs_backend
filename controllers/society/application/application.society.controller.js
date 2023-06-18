const Application = require("../../../models/application.model");
const fs = require('fs');
const path = require("path");

module.exports.createApplication = async (req, res) => {
    try {
        const society_id = req.Society._id;
        const { application_type, application_desc, application_title } = req.body;
        const files = req.files;
        const newApplication = await Application.create({
            society_id,
            application_type,
            application_title,
            application_desc,
        })


        const updateApplication = await Application.updateOne(
            { _id: newApplication._id },
            {
                $set: {
                    supporting_documents: files.map(file => { return file.originalname })
                }
            }
        )

        fs.rename(`upload/application_docs/${society_id}`, `upload/application_docs/${newApplication._id}`, (err) => {
            if (err) {
                console.error('Error renaming folder:', err);
            } else {
                console.log('Folder renamed successfully.');
            }
        })

        res.status(200).json({
            msg: `application created for ${application_type} and waiting for approval`,
            success: true,
        })

    } catch (err) {
        console.error("Error while creating application: ", err);
        res.status(500).json({
            msg: "Internal Server Error",
            success: false,
        })
    }
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

module.exports.updateApplication = async (req, res) => {
    try {
        const app_id = req.params.id;
        const files = req.files;
        console.log(files)
        const { application_type, application_title, application_desc } = req.body;

        const app_data = await Application.findOne({ _id: app_id });

        const data = await Application.updateOne(
            { _id: app_id },
            {
                $set: {
                    application_desc,
                    application_title,
                    application_type,
                    supporting_documents: [...app_data.supporting_documents, ...files.map(file => { return file.originalname })]
                }
            }
        )

        res.status(200).json({
            msg: "Application Updated Successfully",
            success: true,
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "Internal Server Error",
            success: false,
        })
    }



}

