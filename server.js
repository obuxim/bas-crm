const express = require('express')
const session = require('express-session')
const layouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const fileUpload = require('express-fileupload')
const config = require('config')
const app = express()
const cookieParser = require('cookie-parser')
const passport = require('passport')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000
connectDB()
require('./config/passport')(passport)

app.use(session({
    secret: 'sessionSecretOfBAS2.0CRM',
    resave: true,
    saveUninitialized: true,
}))
app.use(cookieParser())
app.set('trust proxy', 1)
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(layouts)
app.use(express.urlencoded({extended: false})).use(express.json({extended: false}))
app.use(fileUpload())
//Passport
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.locals.app_url = config.get('app_url')
app.use(function(req, res, next){
    app.locals.success = req.flash('success')
    app.locals.error = req.flash('error')
    app.locals.successes = req.flash('successes')
    app.locals.errors = req.flash('errors')
    app.locals.user = req.user
    app.locals.previousInputs = req.flash('previousInputs')
    next()
})

app.use('/', require('./routes/auth'))
app.use('/requests', require('./routes/requests'))

app.listen(PORT, console.log(`App started on port ${PORT}`))
