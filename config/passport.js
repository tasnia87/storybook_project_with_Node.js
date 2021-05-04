const GoogleStrategy = require('passport-google-oauth20').Strategy
require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')
const dotenv = require('dotenv')


module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: '570837766225-jndg0r36t8kbkve3n9ji1j1jgsqu0joa.apps.googleusercontent.com',
                clientSecret: 'NpcD7m4gac4_0GyZJsxAR2WM',
                callbackURL: '/auth/google/callback'
            },

        async (assyncToken, refreshToken, profile, done) => {
            const newuser = {
                
                displayName: profile.displayName,                    
                firstName:profile.name.givenName,                    
                lastName: profile.name.familyName,
                image: profile.photos[0].value
                    
            }
            try {
                let user = await User.findOne({
                    googleId: profile.id
                })
                if (user) {
                    done(null, user)
                }
                else {
                    user = await User.create(newuser)
                    done(null,user)
                }
                    

            }
            catch(err) {
                console.log(err)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.id)

    })

    passport.deserializeUser((id, done) => {
        User.findById(id,(err, user)=>
            done(err, user)
        )

    })

}