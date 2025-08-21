const User = require('../models/User.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const handleErrors = (err) => {
    let errors = { email: '', password: '' };

    console.log("Full Error Object:", err); // Debugging
    console.log("Validation Errors:", err.errors); // Debugging

    // Duplicate email error (MongoDB unique constraint)
    if (err.code === 11000 || err.message.includes('E11000')) {
        errors.email = 'Email already registered!';
        return errors;
    }

    // Mongoose validation errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    // Custom login errors
    if (err.message === 'incorrect email') {
        errors.email = 'Email not found!';
    }
    if (err.message === 'incorrect password') {
        errors.password = 'Incorrect password!';
    }

    // console.log("Processed Errors:", errors); // Debugging
    return errors;
};
const maxAge = 3 * 24 * 60 * 60 //(3 days in sec)
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    })
}

exports.register_post = async (req, res) => {
    const {username, email, password } = req.body;
        console.log("Register Body:", req.body);


    try {
        const user = await User.create({name:username, email, password })
        const token = createToken(user._id) //now we created a jwt token so we have to put this in cookie and send it to browser
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
            secure: true,           // required for HTTPS
  sameSite: "none"  
        })
        res.status(201).json({
            message: 'SignUp Successful!',
            user
        })
    }
    catch (err) {
        const errors = handleErrors(err)
        console.log("signUp erros", errors)
        res.status(400).json({ errors });  // Send error messages to the frontend

    }
}

exports.login_post = async (req, res) => {
    const { email, password } = req.body
    try {
        //in User schema we created a static function login which checks if user exists and password match
        const user = await User.login(email, password);
        const token = createToken(user._id) //now we created a jwt token so we have to put this in cookie and send it to browser
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
            secure: true,           // required for HTTPS
  sameSite: "none"  
        })
        return res.status(200).json({
            message: "Login successful",
            user: { email: user.email, id: user._id }
        });
    }
    catch (err) {
        const errors = handleErrors(err);
        console.log("Login Errors:", errors)
        res.status(400).json({ errors })
    }
}

exports.logout_get = (req,res)=>{
    res.cookie('jwt','',{maxAge:1})
    res.status(200).json({message:'Logged Out Successfully'})
}
