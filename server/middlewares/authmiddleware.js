const jwt = require('jsonwebtoken');
const User = require('../models/User')

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        console.log(decodedToken);
        req.user = decodedToken; // You can use this if needed later
        next();
      }
    });
  } else {
    return res.status(401).json({ message: 'No token found' });
  }
};

//to get current looged-in user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async(err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.cuser = null
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        console.log(decodedToken);

        //we passed the id into the function while creating a token (authController -> createToken(id))
        //so now we can find the user in the database with that id
        //and when we get the user we can use that for frontend
        let user = await User.findById(decodedToken.id)
        res.locals.cuser = user //inside the views if we have the valid user and we found that in database
        next();
      }
    });
  } 
  else {
    res.locals.cuser=null
    return res.status(401).json({ message: 'No token found' });
  }
}

module.exports = { requireAuth , checkUser};
