const {Router} = require('express');
const router = Router();
const User = require('../models/user.model');

router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.post('/signup', async (req, res) => {
  const {fullName, email, password} = req.body;
  await User.create({
    fullName,
    email,
    password
  })

  return res.redirect('/')
});

router.get('/signin', (req, res) => {
  return res.render('signin');
});

router.post('/signin', async (req, res) => {
  try{
  const {email, password} = req.body;
  const token = await User.matchPasswordAndGenerateToken(email,password)

  console.log(token)
  res.cookie('token', token)
  return res.redirect('/')
  }catch(err){
    console.log(err)
    return res.render('signin', {
      error : "Invalid email or password"
    })
  }
})

router.get('/logout',(req,res)=>{
  res.clearCookie('token')
  return res.redirect('/')
})

// This should be an admin-only route!
router.get('/update-profile-images', async (req, res) => {
  try {
    // Update all documents with the correct path
    const result = await User.updateMany(
      { profileImageURL: './images/default.png' }, // Notice the .png extension
      { $set: { profileImageURL: '/images/default.jpg' } } // Keep the same extension
    );
    
    return res.json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} user profiles`,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });
  } catch (error) {
    console.error('Error updating profile images:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile images',
      error: error.message
    });
  }
});

module.exports = router;


module.exports = router