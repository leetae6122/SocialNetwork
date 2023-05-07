const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

const config = require("../config");
const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

//Json Web Token
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: config.JWT_Secret
}, async (payload, done) => {
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.findById(payload.id);
        if (!user) return done(null, false);
        done(null, user);
    } catch (error) {
        done(error, false)
    }
}));