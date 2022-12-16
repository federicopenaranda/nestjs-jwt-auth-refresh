import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor() {
        // https://docs.nestjs.com/security/authentication#implementing-passport-strategies
        super({
            secretOrKey: process.env.JWT_ACCESS_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    // This method is standard for a PassportStrategy, it executes for every request
    // and creates a "user" property in the request once is validated, then sets the value of
    // the "user" property to the returned value of this "validate" method.
    // But it can be overrided when instantiated by changing the value of "property" property.

    // Here we automatically validate the user. Extra:
    // could first search for the user with userService 
    // and return the found user.

    // https://docs.nestjs.com/security/authentication#implementing-passport-local
    // https://www.codemag.com/Article/2001081/Nest.js-Step-by-Step-Part-3-Users-and-Authentication

    // Extra: Add user email to the access token data.
    validate(payload: any) {
        return { userId: payload.userId }
    }

}