const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    // next is a callback that points to the next fucntion to be run (because this is middleware)

    // get the token from the header
    const token = req.header('x-auth-token');

    // check if the token exists
    if (!token){
        res.status(401).json({msg:"No token, authorization denied"});
    }

    // if it does exist - verify it
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    }catch(error){
        // if token is invalid
        res.status(401).json({msg:'Token is not valid'})
    }
    
}