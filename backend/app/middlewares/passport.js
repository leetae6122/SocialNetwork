const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { JWT_Secret } = require('../config');

const MongoDB = require("../utils/mongodb.util");
const UserService = require("../services/user.service");

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: JWT_Secret,
}, async (payload, done) =>{
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.findById(payload.sub);
        if (!user) return done(null, false);
        
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));