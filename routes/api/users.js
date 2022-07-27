const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');
// const passwordValidator = require('password-validator');

// let schema = new passwordValidator();

// schema
//     .is().min(8)
//     .is().max(40)
//     .has().uppercase()
//     .has().lowercase();

// @route   POST api/users
// @desc    Register route
// @access  Public (no token required)
router.post('/',[
    // 1st param dictates the key
    // 2nd param defines the error message if the key's value fails validation
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    // TODO: add validation to ensure its a string
    check("password", "Please enter a password with 6 or more charachters").isLength({min:6})
    // schema.validate("password", "Password requires must be between 8-40 charachters, and must contain at least 1 uppercase and 1 lowercase letter.")
],
 async (req, res) => {
    const errors = validationResult(req);
    //if there's errors
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const { name, email, password} = req.body;

    try{
        // check if user exists - if already exists - send back an error
        let user = await User.findOne({ email })
        if(user){
            // format like so to ensure error format is consistent
            return res.status(400).json({
                errors : [{ msg: 'User already exists'}]
            });
        }
        // get user's gravatar
        const avatar = gravatar.url(
            email,{
                // size
                s: '200',
                // rating - cant have explicit images if at pg
                r: 'pg',
                // default image - could be 404 if deafult should be empty
                d: 'mm'
            }
        );

        // creates a new user instance - doesnt save automatically to MongoDB though
        user = new User({
            name,
            email,
            avatar,
            password
        });

        // encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // return JWT
        // console.log(req.body);
        res.send('User successfully registered'); 
    }catch(e){
        console.error(e.message);
        res.status(500).send("Internal Server Error");
    }

 }
);

module.exports = router;