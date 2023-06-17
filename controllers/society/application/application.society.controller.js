const Application = require("../../../models/application.model");
const fs = require('fs');
const path = require("path");

module.exports.createApplication = async (req, res) => {
    const society_id = req.Society._id;
    console.log(req.body);
    console.log(req.files);
    const {application_type, application_desc, application_title } = req.body;

    try {
        const files = req.files;
        const newApplication = await Application.create({
            society_id,
            application_type,
            application_title,
            application_desc,
        })
        
        const support = [];

        for(let file in files)
        {
            const filename = files[file].originalname
            support.push(filename)
        }
        
        const updateApplication = await Application.updateOne(
            {_id : newApplication._id},
            {
                $set : {
                    supporting_documents : support
                }
            }
        )

        fs.rename(`upload/application_docs/${society_id}` , `upload/application_docs/${newApplication._id}`, (err) => {
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

// module.exports.updateApplication = (req, res) => {
//     const app_id = req.params.id;
//     const { application_type, application_title, application_desc} = req.body;

//     const files = req.files;

//     const updateApplication
    
// }