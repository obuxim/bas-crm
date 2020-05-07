const localStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'email'}, async (email, password, done) => {
        const user = await User.findOne({email})
        if(!user){
            return done(null, false, { message: "User does not exists!" })
        }
        const isMatched = await bcrypt.compare(password, user.password)
        if(!isMatched){
            return done(null, false, { message: "Invalid password!" })
        }
        return done(null, user)
    }))

    passport.serializeUser(function(user, done){
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user) {
            done(err, user)
        })
    })
}