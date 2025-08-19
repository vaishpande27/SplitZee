const express = require('express')
const router = express.Router();
const authController = require('../../controllers/authController')
const {requireAuth,checkUser} = require('../../middlewares/authmiddleware')

router.post('/register',authController.register_post);

router.post('/login', authController.login_post)

router.get('/verify-user', requireAuth, (req, res) => {
  res.status(200).json({ message: 'User is authenticated' });
});

router.get('/get-user',checkUser,(req,res)=>{
  res.status(200).json({message:'',user: res.locals.cuser})
})

router.post('/logout',authController.logout_get);

module.exports = router