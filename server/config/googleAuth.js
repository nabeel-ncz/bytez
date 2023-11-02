const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user,done) => {
    done(null,user);
})
passport.deserializeUser((user,done) => {
    done(null,user);
})

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URL,
    passReqToCallback:true,
    scope:['profile', 'email']
}, async (requset, accessToken, refreshToken, profile, done) => {
    try{
        const existingUser = await User.findOne({ email: profile._json.email });
        if(existingUser) {
            done(null, existingUser);
        } else {
            const newUser = await new User({
                name: profile.displayName,
                email: profile._json.email,
                password: profile.id,
                verified: true,
                oauth:true,
                createdAt: Date.now(),
            }).save();
            done(null, newUser);
        }
    } catch (error) {
        done(error, null);
    }
}));