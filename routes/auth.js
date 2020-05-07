const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { forwardAuthenticated, ensureAuthenticated } = require('../middlewares/auth')


router.get('/', forwardAuthenticated, (req, res) => {
    res.render('index')
})

// router.get('/register', forwardAuthenticated, (req, res) => {
//     res.render('register')
// })


//Registration Handler Route
// router.post('/register', [
//     check('name', 'Provide your full name for registration!').not().isEmpty(),
//     check('email', 'Provide your valid email address for registration!').isEmail(),
//     check('password', 'Please provide a password with 6 or more characters for registration!').isLength({min:6})
// ], async (req, res) => {
//     const errors = validationResult(req)
//     if(!errors.isEmpty()){
//         req.flash('errors', errors.array())
//         return res.redirect('/register')
//     }
//     const { name, email, password } = req.body
//     try{
//         let user = await User.findOne({email})
//         if(user) {
//             req.flash('errors', [{msg: "User already exists!"}])
//             return res.redirect('/register')
//         } else {
//             const avatar = gravatar.url(email, {
//                 s: '200',
//                 r: 'pg',
//                 d: 'mm'
//             })
//             user = new User({name, email, avatar, password})
//             const salt = await bcrypt.genSalt(10)
//             user.password = await bcrypt.hash(password, salt)
//             try{
//                 await user.save()
//                 req.flash('successes', [{msg: "User registration completed! You can login now."}])
//                 return res.redirect('/')
//             }catch(e){throw e}
//         }
//     } catch(error) {
//         console.log(error)
//         req.flash('errors', [{msg: error.message}])
//         return res.redirect('/register')
//     }
// })

//Login Route

router.post('/login', [
    check('email', 'Enter your registered email to login!').isEmail(),
    check('password', 'Enter your password to login!').not().isEmpty(),
    function(req, res, next){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            req.flash('errors', errors.array())
            return res.redirect('/')
        }
        passport.authenticate('local', {
            successRedirect: '/requests',
            failureRedirect: '/',
            failureFlash: true,
        })(req, res, next)
    }
])

//Logout Route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('successes', [{msg: 'You are logged out'}]);
    res.redirect('/');
});

module.exports = router