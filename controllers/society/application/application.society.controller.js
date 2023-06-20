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
                    supporting_documents: files.map(file => {
                        const originalName = file.originalname.replace(/\s+/g, '_');
                        return `/download/${newApplication._id}/${originalName}`
                    })
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

module.exports.updateApplication = async (req, res) => {
    try {
        const app_id = req.params.id;
        const files = req.files;
        console.log(files)
        const { application_type, application_title, application_desc } = req.body;

        const app_data = await Application.findOne({ _id: app_id });
        if (!app_data.is_approved) {
            const data = await Application.updateOne(
                { _id: app_id },
                {
                    $set: {
                        application_desc,
                        application_title,
                        application_type,
                        supporting_documents: [...app_data.supporting_documents, ...files.map(file => {
                            const originalName = file.originalname.replace(/\s+/g, '_');
                            return `/download/${app_id}/${originalName}`
                        })]
                    }
                }
            )

            res.status(200).json({
                msg: "Application Updated Successfully",
                success: true,
            })
        } else {
            res.status(400).json({
                success: false,
                msg: "Cannot update application , it is already approved."
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "Internal Server Error",
            success: false,
        })
    }



}

module.exports.getApplicationBySocietyId = async (req, res) => {
    try {
        const id = req.Society._id;
        const data = await Application.find({ society_id: id })

        res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        })
    }
}