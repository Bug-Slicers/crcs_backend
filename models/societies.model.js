const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const societySchema = new mongoose.Schema(
    {
        society_name: {
            type: String,
            required: [true, "Please Enter a Name of Society"]
        },
        society_logo: {
            type: String,
            required: [true, "Society Logo is a required Field"]
        },
        address: {
            type: String,
            required: [true, "Please Enter valid address of the society"]
        },
        pincode: {
            type: mongoose.Types.Decimal128,
            required: [true, "Please Enter a valid Pincode"]
        },
        state: {
            type: String,
            required: [true, "Please Select a correct state"]
        },
        district: {
            type: String,
            required: [true, "Please select a correct district"]
        },
        society_type: {
            type: String,
            enum: [
                "Agro",
                "Construction",
                "Consumer",
                "Cooperative Bank",
                "Credit",
                "Dairy",
                "Export",
                "Federation",
                "Fisheries",
                "Industrial/Textile",
                "Labour",
                "Marketing",
                "Multi Purpose",
                "National Federation",
                "Organic",
                "Others",
                "Seed",
                "Technical",
                "Tourism",
                "Transport",
                "Welfare",
                "Health/Hospital",
                "Housing"
            ],
            required: [true, "Please select a valid Society type"]
        },
        name_of_officer: {
            type: String,
            required: [true, 'name of officer is a required field']
        },
        designation: {
            type: String,
            required: [true, "designation is required field"]
        },
        pan_number: {
            type: String,
            required: [true, "Pan number is a required field"],
            unique: true,
            validate: {
                validator: function (pan_number) {
                    // PAN number regular expression pattern
                    const panRegex = /^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/;
                    return panRegex.test(pan_number);
                },
                message: 'Invalid PAN number format',
            }
        },
        email: {
            type: String,
            required: [true, "Email is a required field"],
            validate: [isEmail, "Please Enter a Valid Email"],
            unique: true,
            lowercase: true,
        },
        phone_number: {
            type: mongoose.Types.Decimal128,
            required: [true, "Phone number is a required field"],
            validate: {
                validator: function (phone_number) {
                    const phone_regex = /^([0-9]){10}?$/
                    return phone_regex.test(phone_number);
                },
                message: "Please Enter a Valid Phone Number",
            },
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required field"],
            minLength: [8, "Password must be at least 8 characters"],
        },
        is_approved: {
            type: Boolean,
            required: true,
            default: false,
        },
        otp: {
            type: String,
            default: null,
        },
        otp_generation_time: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

societySchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

societySchema.statics.login = async function (email, password) {
    const society = await this.findOne({ email });
    if (society) {
        const auth = await bcrypt.compare(password, society.password);
        if (auth) {
            return society;
        }
        throw Error("Incorrect Password");
    }
    throw Error("Invalid Email.");
};

const Society = mongoose.model("Society", societySchema);
module.exports = Society;