const User = require('../models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "auth/google/callback"
}, async function(acessToken, refreshToken, profile, done) {
    console.log("user profile is: ", profile);
    //done(null, profile);
    /*User.findOrCreate({googleId: profile.id}, async function(err, user) {
        user = {
            email: profile.displayName,    // just corrected from diplay-display
            //avatar: profile.photos[0]
        }
        return await user.save();
    })
    done(null, profile);*/
}))

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})