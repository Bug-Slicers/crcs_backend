module.exports.handleError = (err) => {
    let errors = { email: "", password: "" };

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
        errors.email = "That email is already registered";
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
