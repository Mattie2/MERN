const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public (no token required)
router.get('/', auth, async (req, res) => {
    try{
        // return everything apart from the password
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Authenticate user & gett token
// @access  Public (no token required)
router.post('/',[
    // 1st param dictates the key
    // 2nd param defines the error message if the key's value fails validation
    check('email', 'Please include a valid email').isEmail(),
    // TODO: add validation to ensure its a string
    check("password", "Password is required").exists()
    // schema.validate("password", "Password requires must be between 8-40 charachters, and must contain at least 1 uppercase and 1 lowercase letter.")
],
 async (req, res) => {
    const errors = validationResult(req);
    //if there's errors
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const { email, password} = req.body;

    try{
        // check if user exists - if already exists - send back an error
        let user = await User.findOne({ email })
        if(!user){
            return res.status(400).json({
                errors : [{ msg: 'Invalid Credentials'}]
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match){
            // good practice to have the same error message, as being too verbose will make it easier to hack
            // e.g. saying user does/desnt exist etc
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}]});
        }

        // return JWT
        //user.id is auto-generated by MongoDB for the entry
        const payload = {
            user:{
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            // {} denotes that the option is optional
            { expiresIn: config.get('jwtExpirationTime')},
            (err, token) => {
                if (err){
                    throw err;
                }else{
                    // response.json is the jwt token
                    res.json({ token });
                }
            }
        );
    }catch(e){
        console.error(e.message);
        res.status(500).send("Internal Server Error");
    }

 }
);

module.exports = router;