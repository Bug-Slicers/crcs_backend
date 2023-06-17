module.exports.handleError = (err) => {
    let errors = {};

    // incorrect email
    if (err.message === "Invalid Email.") {
        errors.email = "That email is not registered";
    }

    // incorrect password
    if (err.message === "Incorrect Password") {
        errors.password = "That password is incorrect";
    }

    // duplicate error code
    if (err.code === 11000) {
        if (err.keyPattern.email === 1) {
            errors.email = "That email is already registered";
        }
        else if (err.keyPattern.pan_number === 1) {
            errors.pan_number = 'That Pan is Already registered';
        } else if (err.keyPattern.phone_number === 1) {
            errors.phone_number = 'That phone is already registerd'
        }
        return errors;
    }

    if (err.message.includes("user validation failed")) {
        let errorsarray = Object.values(err.errors);
        errorsarray.forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};
